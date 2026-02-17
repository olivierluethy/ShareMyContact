<?php
// ============================================================
// api.php — Backend API
// All DB operations, vCard generation, CORS headers
// ============================================================

// ── CORS & Headers ───────────────────────────────────────────
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── Load Config ───────────────────────────────────────────────
$config = require __DIR__ . '/config.php';

// ── DB Connection ─────────────────────────────────────────────
function getDB(): PDO {
    static $pdo;
    if ($pdo) return $pdo;

    global $config;
    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=%s',
        $config['host'],
        $config['port'],
        $config['dbname'],
        $config['charset']
    );
    $pdo = new PDO($dsn, $config['username'], $config['password'], [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
    return $pdo;
}

// ── Helpers ───────────────────────────────────────────────────
function jsonOut(mixed $data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function generateUUID(): string {
    // RFC 4122 v4
    $data = random_bytes(16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

function generateToken(): string {
    // 12-char alphanumeric token
    $chars = 'abcdefghijkmnpqrstuvwxyz23456789';
    $token = '';
    for ($i = 0; $i < 12; $i++) {
        $token .= $chars[random_int(0, strlen($chars) - 1)];
    }
    return $token;
}

function vcardEscape(string $s): string {
    return str_replace([',', ';', '\\', "\n"], ['\\,', '\\;', '\\\\', '\\n'], $s);
}

// Allowed contact detail types
const ALLOWED_TYPES = ['phone', 'email', 'company', 'website', 'linkedin'];

// ── Router ────────────────────────────────────────────────────
$method = $_SERVER['REQUEST_METHOD'];
$action = trim($_GET['action'] ?? '');
$token  = trim($_GET['token']  ?? '');

// POST api.php?action=save — create/update profile & details
if ($method === 'POST' && $action === 'save') {
    $body = json_decode(file_get_contents('php://input'), true);

    $name    = trim($body['name']      ?? '');
    $phone   = trim($body['phone']     ?? '');
    $email   = trim($body['email']     ?? '');
    $company = trim($body['company']   ?? '');
    $website = trim($body['website']   ?? '');
    $linkedin= trim($body['linkedin']  ?? '');

    // Optional: existing profileId for update
    $existingProfileId = trim($body['profile_id'] ?? '');

    if ($name === '') jsonOut(['error' => 'Name is required'], 422);

    $db = getDB();

    try {
        $db->beginTransaction();

        if ($existingProfileId) {
            // Update existing profile
            $stmt = $db->prepare("SELECT id FROM profiles WHERE id = ?");
            $stmt->execute([$existingProfileId]);
            $exists = $stmt->fetchColumn();

            if (!$exists) {
                $db->rollBack();
                jsonOut(['error' => 'Profile not found'], 404);
            }

            $db->prepare("UPDATE profiles SET name = ? WHERE id = ?")
               ->execute([$name, $existingProfileId]);

            // Delete old details and re-insert
            $db->prepare("DELETE FROM contact_details WHERE profile_id = ?")
               ->execute([$existingProfileId]);

            $profileId = $existingProfileId;

            // Reuse existing token if present
            $stmt = $db->prepare("SELECT token FROM share_links WHERE profile_id = ?");
            $stmt->execute([$profileId]);
            $existingToken = $stmt->fetchColumn();
            $shareToken = $existingToken ?: null;

        } else {
            // Create new profile
            $profileId = generateUUID();
            $db->prepare("INSERT INTO profiles (id, name) VALUES (?, ?)")
               ->execute([$profileId, $name]);

            $shareToken = null; // will generate below
        }

        // Insert contact details
        $details = [
            'phone'    => $phone,
            'email'    => $email,
            'company'  => $company,
            'website'  => $website,
            'linkedin' => $linkedin,
        ];

        $stmtDetail = $db->prepare(
            "INSERT INTO contact_details (id, profile_id, type, value) VALUES (?, ?, ?, ?)"
        );
        foreach ($details as $type => $value) {
            if ($value !== '') {
                $stmtDetail->execute([generateUUID(), $profileId, $type, $value]);
            }
        }

        // Generate share token if needed
        if (!$shareToken) {
            do {
                $shareToken = generateToken();
                $stmt = $db->prepare("SELECT token FROM share_links WHERE token = ?");
                $stmt->execute([$shareToken]);
            } while ($stmt->fetchColumn()); // ensure uniqueness

            $db->prepare("INSERT INTO share_links (token, profile_id) VALUES (?, ?)")
               ->execute([$shareToken, $profileId]);
        }

        $db->commit();
        jsonOut(['profile_id' => $profileId, 'token' => $shareToken]);

    } catch (Throwable $e) {
        $db->rollBack();
        jsonOut(['error' => 'Database error: ' . $e->getMessage()], 500);
    }
}

// GET api.php?action=contact&token=xxx — fetch contact by share token
if ($method === 'GET' && $action === 'contact' && $token) {
    $db = getDB();

    $stmt = $db->prepare("
        SELECT p.id AS profile_id, p.name
        FROM share_links sl
        JOIN profiles p ON p.id = sl.profile_id
        WHERE sl.token = ?
    ");
    $stmt->execute([$token]);
    $profile = $stmt->fetch();

    if (!$profile) jsonOut(['error' => 'Contact not found'], 404);

    $stmt = $db->prepare("
        SELECT type, value
        FROM contact_details
        WHERE profile_id = ?
    ");
    $stmt->execute([$profile['profile_id']]);
    $rawDetails = $stmt->fetchAll();

    // Map into keyed object
    $details = [];
    foreach ($rawDetails as $row) {
        $details[$row['type']] = $row['value'];
    }

    jsonOut([
        'profile_id' => $profile['profile_id'],
        'name'       => $profile['name'],
        'details'    => $details,
    ]);
}

// GET api.php?action=vcard&token=xxx — download vCard
if ($method === 'GET' && $action === 'vcard' && $token) {
    $db = getDB();

    $stmt = $db->prepare("
        SELECT p.id AS profile_id, p.name
        FROM share_links sl
        JOIN profiles p ON p.id = sl.profile_id
        WHERE sl.token = ?
    ");
    $stmt->execute([$token]);
    $profile = $stmt->fetch();

    if (!$profile) {
        http_response_code(404);
        echo 'Contact not found';
        exit;
    }

    $stmt = $db->prepare("SELECT type, value FROM contact_details WHERE profile_id = ?");
    $stmt->execute([$profile['profile_id']]);
    $rows = $stmt->fetchAll();

    $details = [];
    foreach ($rows as $row) {
        $details[$row['type']] = $row['value'];
    }

    // Build vCard
    $nameParts = explode(' ', $profile['name'], 2);
    $last  = vcardEscape($nameParts[0] ?? '');
    $first = vcardEscape($nameParts[1] ?? '');

    $vcard  = "BEGIN:VCARD\r\n";
    $vcard .= "VERSION:3.0\r\n";
    $vcard .= "FN:"  . vcardEscape($profile['name']) . "\r\n";
    $vcard .= "N:{$last};{$first};;;\r\n";
    if (!empty($details['phone']))   $vcard .= "TEL;TYPE=CELL:"   . vcardEscape($details['phone'])   . "\r\n";
    if (!empty($details['email']))   $vcard .= "EMAIL:"           . vcardEscape($details['email'])   . "\r\n";
    if (!empty($details['company'])) $vcard .= "ORG:"             . vcardEscape($details['company']) . "\r\n";
    if (!empty($details['website'])) $vcard .= "URL:"             . vcardEscape($details['website']) . "\r\n";
    if (!empty($details['linkedin']))$vcard .= "X-SOCIALPROFILE;type=linkedin:" . vcardEscape($details['linkedin']) . "\r\n";
    $vcard .= "END:VCARD\r\n";

    $filename = preg_replace('/[^a-z0-9_\-]/i', '_', $profile['name']) . '.vcf';
    header('Content-Type: text/vcard; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    echo $vcard;
    exit;
}

// Fallback
jsonOut(['error' => 'Invalid request'], 400);