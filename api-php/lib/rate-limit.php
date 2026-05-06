<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

// File-backed sliding-window rate limiter. We keep the data in MySQL so the
// limit is shared across all PHP workers and survives restarts. The window is
// 60 seconds; counts older than that are pruned on each call.
function smc_rate_limit_check(string $bucket, string $ip_hash, int $limit_per_min): void {
    $pdo = smc_db();

    // Best-effort table create. Idempotent; cheap because the table is tiny.
    static $ensured = false;
    if (!$ensured) {
        $pdo->exec('
            CREATE TABLE IF NOT EXISTS rate_limit_hits (
                bucket   VARCHAR(64) NOT NULL,
                ip_hash  VARCHAR(64) NOT NULL,
                hit_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_bucket_ip (bucket, ip_hash, hit_at)
            )
        ');
        $ensured = true;
    }

    // Prune old rows occasionally (1% of requests) to keep the table small.
    if (random_int(0, 99) === 0) {
        $pdo->exec('DELETE FROM rate_limit_hits WHERE hit_at < (NOW() - INTERVAL 5 MINUTE)');
    }

    $stmt = $pdo->prepare('
        SELECT COUNT(*) FROM rate_limit_hits
        WHERE bucket = :bucket
          AND ip_hash = :ip_hash
          AND hit_at > (NOW() - INTERVAL 1 MINUTE)
    ');
    $stmt->execute([':bucket' => $bucket, ':ip_hash' => $ip_hash]);
    $count = (int)$stmt->fetchColumn();

    if ($count >= $limit_per_min) {
        require_once __DIR__ . '/utils.php';
        smc_json(['success' => false, 'error' => 'rate_limited'], 429);
    }

    $insert = $pdo->prepare('INSERT INTO rate_limit_hits (bucket, ip_hash) VALUES (:bucket, :ip_hash)');
    $insert->execute([':bucket' => $bucket, ':ip_hash' => $ip_hash]);
}
