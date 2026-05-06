<?php
// Copy this file to config.php on the server and fill in real values.
// config.php is git-ignored — never commit it.

return [
    // Database (MySQL/MariaDB)
    'db' => [
        'host'    => 'localhost',
        'port'    => 3306,
        'name'    => 'sharemycontact',
        'user'    => 'xxx',
        'pass'    => 'xxx',
        'charset' => 'utf8mb4',
    ],

    // Salt for SHA-256 IP hashing. Pick a long random string and never rotate
    // unless you intend to break correlation across older rows.
    'ip_hash_salt' => 'xxx-replace-with-32-byte-random-string',

    // Origins allowed to call these endpoints (CORS).
    'allowed_origins' => [
        'https://sharemycontact.com',
        'https://www.sharemycontact.com',
    ],

    // Rate limit: max requests per minute per ip_hash. The form-event endpoint
    // is noisier than the bespoke ones, so it gets the higher cap.
    'rate_limit_form_per_min'    => 20,
    'rate_limit_bespoke_per_min' => 6,
];
