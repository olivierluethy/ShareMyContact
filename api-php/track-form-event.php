<?php
declare(strict_types=1);

require_once __DIR__ . '/lib/utils.php';
require_once __DIR__ . '/lib/db.php';
require_once __DIR__ . '/lib/rate-limit.php';

// ------------------------------------------------------------------
//  ANONYMOUS FORM EVENT TRACKING
//
//  This endpoint MUST NEVER store the values of name, phone, email,
//  company, website, or linkedin. Only booleans (has_*) and metadata.
//  If you find yourself adding a column or a write that takes one of
//  those values, stop and re-read /privacy.
// ------------------------------------------------------------------

smc_apply_cors();
smc_require_post();

$ip_hash = smc_ip_hash();
$config  = smc_config();
smc_rate_limit_check('form_event', $ip_hash, (int)($config['rate_limit_form_per_min'] ?? 20));

$payload = smc_read_json();

$session_id = smc_session_id($payload['session_id'] ?? null);
if ($session_id === null) {
    smc_json(['success' => false, 'error' => 'invalid_session_id'], 400);
}

$event_type = smc_enum($payload['event_type'] ?? null, [
    'form_started',
    'form_submitted',
    'qr_generated',
    'link_copied',
    'link_shared',
]);
if ($event_type === null) {
    smc_json(['success' => false, 'error' => 'invalid_event_type'], 400);
}

// Whitelist of accepted field-flag keys. Anything else on the request
// is silently dropped so a buggy client cannot smuggle values through.
$allowed_flags = ['has_phone', 'has_email', 'has_company', 'has_website', 'has_linkedin'];
$incoming_flags = is_array($payload['field_flags'] ?? null) ? $payload['field_flags'] : [];
$flags = [];
foreach ($allowed_flags as $key) {
    $flags[$key] = array_key_exists($key, $incoming_flags)
        ? smc_bool_or_null($incoming_flags[$key])
        : null;
}

$device_type = smc_enum($payload['device_type'] ?? null, ['mobile', 'tablet', 'desktop']);
$referrer    = smc_short_string($payload['referrer']    ?? null, 1000);
$utm_source  = smc_short_string($payload['utm_source']  ?? null, 100);
$utm_medium  = smc_short_string($payload['utm_medium']  ?? null, 100);
$utm_campaign = smc_short_string($payload['utm_campaign'] ?? null, 100);

$pdo = smc_db();
$stmt = $pdo->prepare('
    INSERT INTO form_submissions (
        session_id, event_type,
        has_phone, has_email, has_company, has_website, has_linkedin,
        user_agent, referrer, utm_source, utm_medium, utm_campaign,
        ip_hash, device_type
    ) VALUES (
        :session_id, :event_type,
        :has_phone, :has_email, :has_company, :has_website, :has_linkedin,
        :user_agent, :referrer, :utm_source, :utm_medium, :utm_campaign,
        :ip_hash, :device_type
    )
');

$stmt->execute([
    ':session_id'   => $session_id,
    ':event_type'   => $event_type,
    ':has_phone'    => $flags['has_phone'],
    ':has_email'    => $flags['has_email'],
    ':has_company'  => $flags['has_company'],
    ':has_website'  => $flags['has_website'],
    ':has_linkedin' => $flags['has_linkedin'],
    ':user_agent'   => smc_user_agent(),
    ':referrer'     => $referrer,
    ':utm_source'   => $utm_source,
    ':utm_medium'   => $utm_medium,
    ':utm_campaign' => $utm_campaign,
    ':ip_hash'      => $ip_hash,
    ':device_type'  => $device_type,
]);

smc_json(['success' => true]);
