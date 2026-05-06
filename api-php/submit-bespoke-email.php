<?php
declare(strict_types=1);

require_once __DIR__ . '/lib/utils.php';
require_once __DIR__ . '/lib/db.php';
require_once __DIR__ . '/lib/rate-limit.php';

smc_apply_cors();
smc_require_post();

$ip_hash = smc_ip_hash();
$config  = smc_config();
smc_rate_limit_check('bespoke_email', $ip_hash, (int)($config['rate_limit_bespoke_per_min'] ?? 6));

$payload = smc_read_json();

// Honeypot — bots fill it; real users never see it.
$honeypot = $payload['website_url'] ?? '';
if (is_string($honeypot) && trim($honeypot) !== '') {
    // Pretend success so bots don't learn the trick.
    smc_json(['success' => true]);
}

$session_id = smc_session_id($payload['session_id'] ?? null);
if ($session_id === null) {
    smc_json(['success' => false, 'error' => 'invalid_session_id'], 400);
}

$lead_id_raw = $payload['lead_id'] ?? null;
if (!is_int($lead_id_raw) && !(is_string($lead_id_raw) && ctype_digit($lead_id_raw))) {
    smc_json(['success' => false, 'error' => 'invalid_lead_id'], 400);
}
$lead_id = (int)$lead_id_raw;
if ($lead_id <= 0) {
    smc_json(['success' => false, 'error' => 'invalid_lead_id'], 400);
}

$email_raw = $payload['email'] ?? null;
$email = is_string($email_raw) ? trim($email_raw) : '';
if ($email === '' || strlen($email) > 255 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    smc_json(['success' => false, 'error' => 'invalid_email'], 400);
}

$message_raw = $payload['message'] ?? null;
$message = null;
if (is_string($message_raw)) {
    $message = trim($message_raw);
    if ($message === '') {
        $message = null;
    } elseif (strlen($message) > 500) {
        $message = substr($message, 0, 500);
    }
}

$pdo = smc_db();
$stmt = $pdo->prepare('
    UPDATE bespoke_leads
       SET email = :email,
           email_submitted_at = NOW(),
           message = :message
     WHERE id = :id
       AND session_id = :session_id
       AND email IS NULL
');
$stmt->execute([
    ':email'      => $email,
    ':message'    => $message,
    ':id'         => $lead_id,
    ':session_id' => $session_id,
]);

if ($stmt->rowCount() === 0) {
    // Either lead_id doesn't match session, or email was already submitted.
    smc_json(['success' => false, 'error' => 'lead_not_found_or_already_submitted'], 404);
}

smc_json(['success' => true]);
