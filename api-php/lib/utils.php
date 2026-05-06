<?php
declare(strict_types=1);

function smc_config(): array {
    static $config = null;
    if ($config === null) {
        $config = require __DIR__ . '/../config.php';
    }
    return $config;
}

function smc_client_ip(): string {
    // Trust X-Forwarded-For only if behind a known proxy. Most shared hosts
    // forward the client IP via REMOTE_ADDR already; CF adds CF-Connecting-IP.
    $candidates = [
        $_SERVER['HTTP_CF_CONNECTING_IP'] ?? null,
        // X-Forwarded-For can be a list — first entry is the client.
        isset($_SERVER['HTTP_X_FORWARDED_FOR'])
            ? trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0])
            : null,
        $_SERVER['REMOTE_ADDR'] ?? null,
    ];
    foreach ($candidates as $ip) {
        if ($ip && filter_var($ip, FILTER_VALIDATE_IP)) return $ip;
    }
    return '0.0.0.0';
}

function smc_ip_hash(): string {
    $config = smc_config();
    $salt = (string)($config['ip_hash_salt'] ?? '');
    return hash('sha256', smc_client_ip() . '|' . $salt);
}

function smc_user_agent(): ?string {
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? null;
    if (!$ua) return null;
    // Cap to keep log/db rows bounded. UA strings beyond ~500 chars are usually
    // garbage from misbehaving clients.
    return substr((string)$ua, 0, 500);
}

function smc_apply_cors(): void {
    $config = smc_config();
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowed = $config['allowed_origins'] ?? [];

    if ($origin && in_array($origin, $allowed, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        header('Access-Control-Max-Age: 600');
    }

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function smc_require_post(): void {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        smc_json(['success' => false, 'error' => 'method_not_allowed'], 405);
    }
}

function smc_read_json(): array {
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') return [];
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        smc_json(['success' => false, 'error' => 'invalid_json'], 400);
    }
    return $data;
}

function smc_json(array $body, int $status = 200): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($body);
    exit;
}

function smc_session_id(mixed $value): ?string {
    if (!is_string($value)) return null;
    // sessionStorage UUIDs are 36 chars; we accept up to 64 to leave headroom.
    if ($value === '' || strlen($value) > 64) return null;
    if (!preg_match('/^[a-zA-Z0-9_-]+$/', $value)) return null;
    return $value;
}

function smc_short_string(mixed $value, int $max): ?string {
    if (!is_string($value)) return null;
    $value = trim($value);
    if ($value === '') return null;
    return substr($value, 0, $max);
}

function smc_enum(mixed $value, array $allowed): ?string {
    if (!is_string($value)) return null;
    return in_array($value, $allowed, true) ? $value : null;
}

function smc_bool_or_null(mixed $value): ?bool {
    if ($value === null) return null;
    return (bool)$value;
}
