<?php
declare(strict_types=1);

require_once __DIR__ . '/lib/utils.php';
require_once __DIR__ . '/lib/db.php';
require_once __DIR__ . '/lib/rate-limit.php';

smc_apply_cors();
smc_require_post();

$ip_hash = smc_ip_hash();
$config  = smc_config();
smc_rate_limit_check('bespoke_click', $ip_hash, (int)($config['rate_limit_bespoke_per_min'] ?? 6));

$payload = smc_read_json();

$session_id = smc_session_id($payload['session_id'] ?? null);
if ($session_id === null) {
    smc_json(['success' => false, 'error' => 'invalid_session_id'], 400);
}

$trigger_source = smc_enum($payload['trigger_source'] ?? null, [
    'contact_us_need_more',
    'contact_us_footer',
    'contact_page_form',
]);
if ($trigger_source === null) {
    smc_json(['success' => false, 'error' => 'invalid_trigger_source'], 400);
}

$referrer     = smc_short_string($payload['referrer']     ?? null, 1000);
$utm_source   = smc_short_string($payload['utm_source']   ?? null, 100);
$utm_medium   = smc_short_string($payload['utm_medium']   ?? null, 100);
$utm_campaign = smc_short_string($payload['utm_campaign'] ?? null, 100);

$pdo = smc_db();
$stmt = $pdo->prepare('
    INSERT INTO bespoke_leads (
        session_id, trigger_source,
        user_agent, referrer, utm_source, utm_medium, utm_campaign, ip_hash
    ) VALUES (
        :session_id, :trigger_source,
        :user_agent, :referrer, :utm_source, :utm_medium, :utm_campaign, :ip_hash
    )
');
$stmt->execute([
    ':session_id'     => $session_id,
    ':trigger_source' => $trigger_source,
    ':user_agent'     => smc_user_agent(),
    ':referrer'       => $referrer,
    ':utm_source'     => $utm_source,
    ':utm_medium'     => $utm_medium,
    ':utm_campaign'   => $utm_campaign,
    ':ip_hash'        => $ip_hash,
]);

$lead_id = (int)$pdo->lastInsertId();
smc_json(['success' => true, 'lead_id' => $lead_id]);
