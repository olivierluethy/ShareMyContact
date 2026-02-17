CREATE TABLE profiles (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contact_details (
  id CHAR(36) PRIMARY KEY,
  profile_id CHAR(36),
  type VARCHAR(50),
  value TEXT,
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE TABLE share_links (
  token CHAR(12) PRIMARY KEY,
  profile_id CHAR(36),
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);
