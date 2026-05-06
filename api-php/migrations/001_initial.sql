-- ShareMyContact analytics + lead-capture schema
-- Run this once in PhpMyAdmin against your database.
--
-- HARD RULE: form_submissions stores zero PII from the contact form.
-- Only booleans (has_*) and anonymous metadata. No name/phone/email/
-- company/website/linkedin values, ever.

CREATE TABLE form_submissions (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    session_id   VARCHAR(64)  NOT NULL,
    event_type   ENUM(
        'form_started',
        'form_submitted',
        'qr_generated',
        'link_copied',
        'link_shared'
    ) NOT NULL,

    -- Booleans only. NEVER values.
    has_phone    BOOLEAN NULL,
    has_email    BOOLEAN NULL,
    has_company  BOOLEAN NULL,
    has_website  BOOLEAN NULL,
    has_linkedin BOOLEAN NULL,

    -- Anonymous metadata
    user_agent   TEXT         NULL,
    referrer     TEXT         NULL,
    utm_source   VARCHAR(100) NULL,
    utm_medium   VARCHAR(100) NULL,
    utm_campaign VARCHAR(100) NULL,
    ip_hash      VARCHAR(64)  NULL,
    device_type  ENUM('mobile', 'tablet', 'desktop') NULL,

    INDEX idx_session    (session_id),
    INDEX idx_created    (created_at),
    INDEX idx_event_type (event_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE bespoke_leads (
    id                 INT AUTO_INCREMENT PRIMARY KEY,
    created_at         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    session_id         VARCHAR(64)  NOT NULL,
    trigger_source     ENUM(
        'contact_us_need_more',
        'contact_us_footer',
        'contact_page_form'
    ) NOT NULL,
    email              VARCHAR(255) NULL,
    email_submitted_at TIMESTAMP    NULL,
    message            TEXT         NULL,
    user_agent         TEXT         NULL,
    referrer           TEXT         NULL,
    utm_source         VARCHAR(100) NULL,
    utm_medium         VARCHAR(100) NULL,
    utm_campaign       VARCHAR(100) NULL,
    ip_hash            VARCHAR(64)  NULL,

    INDEX idx_session (session_id),
    INDEX idx_created (created_at),
    INDEX idx_email   (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Rate-limit table is created lazily by lib/rate-limit.php on first request,
-- but you can create it eagerly here if you prefer:
--
-- CREATE TABLE rate_limit_hits (
--     bucket  VARCHAR(64) NOT NULL,
--     ip_hash VARCHAR(64) NOT NULL,
--     hit_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     INDEX idx_bucket_ip (bucket, ip_hash, hit_at)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
