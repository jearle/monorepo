-- User states enum
CREATE TYPE user_state AS ENUM ('active', 'inactive', 'pending_verification', 'suspended', 'deleted');

-- Main users table
CREATE TABLE users (
  id                        VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  email                     VARCHAR(255) UNIQUE NOT NULL,
  first_name                VARCHAR(255),
  last_name                 VARCHAR(255),
  avatar_url                VARCHAR(500),

  -- Traditional auth fields
  password_hash             VARCHAR(255),
  email_verified            BOOLEAN NOT NULL DEFAULT false,
  email_verification_token  VARCHAR(255),
  password_reset_token      VARCHAR(255),
  password_reset_expires_at TIMESTAMPTZ,
  jwt_version               INTEGER NOT NULL DEFAULT 1,

  -- Account management
  state                     user_state NOT NULL DEFAULT 'pending_verification',
  last_login_at             TIMESTAMPTZ,
  login_count               INTEGER NOT NULL DEFAULT 0,

  -- Timestamps
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at                TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT chk_jwt_version_positive CHECK (jwt_version > 0)
);

-- OAuth providers table (one-to-many relationship)
CREATE TABLE user_oauth_providers (
  id                     SERIAL PRIMARY KEY,
  user_id                VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider               VARCHAR(50) NOT NULL, -- 'google', 'github', 'microsoft'
  provider_id            VARCHAR(255) NOT NULL, -- OAuth provider's user ID
  provider_email         VARCHAR(255), -- Email from OAuth provider
  provider_data          JSONB, -- Store additional OAuth data
  
  created_at             TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMP NOT NULL DEFAULT NOW(),
  
  UNIQUE(provider, provider_id),
  UNIQUE(user_id, provider) -- One account per provider per user
);

-- User tokens table (refresh tokens, etc.)
CREATE TABLE user_tokens (
  id                     SERIAL PRIMARY KEY,
  user_id                VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token                  VARCHAR(500) NOT NULL, -- store refresh token hash
  token_type             VARCHAR(50) NOT NULL DEFAULT 'refresh',
  expires_at             TIMESTAMP NOT NULL,
  created_at             TIMESTAMP NOT NULL DEFAULT NOW(),
  revoked_at             TIMESTAMP,
  device_fingerprint     VARCHAR(255),
  client_name            VARCHAR(100), -- 'web', 'mobile_ios', 'mobile_android'
  
  -- Constraints
  CONSTRAINT chk_token_not_empty CHECK (LENGTH(token) > 0),
  CONSTRAINT chk_token_type CHECK (token_type IN ('refresh', 'access', 'temp'))
);

-- Security events and audit trail
CREATE TABLE user_security_events (
  id                     SERIAL PRIMARY KEY,
  user_id                VARCHAR REFERENCES users(id) ON DELETE CASCADE,
  event_type             VARCHAR(50) NOT NULL, -- 'login_success', 'login_failed', 'password_changed', etc.
  ip_address             INET,
  user_agent             TEXT,
  metadata               JSONB,
  created_at             TIMESTAMP NOT NULL DEFAULT NOW()
);

-- User sessions (optional - for server-side session management)
CREATE TABLE user_sessions (
  id                     VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ip_address             INET,
  user_agent             TEXT,
  expires_at             TIMESTAMP NOT NULL,
  created_at             TIMESTAMP NOT NULL DEFAULT NOW(),
  last_activity_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Two-factor authentication (optional)
CREATE TABLE user_2fa (
  id                     SERIAL PRIMARY KEY,
  user_id                VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  method                 VARCHAR(20) NOT NULL, -- 'totp', 'sms', 'email'
  secret                 VARCHAR(255), -- for TOTP
  backup_codes           TEXT[], -- recovery codes
  enabled                BOOLEAN NOT NULL DEFAULT false,
  created_at             TIMESTAMP NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id, method) -- One method per user (can be extended if needed)
);

-- Rate limiting table (optional)
CREATE TABLE rate_limits (
  id                     SERIAL PRIMARY KEY,
  identifier             VARCHAR(255) NOT NULL, -- IP, user_id, email, etc.
  action                 VARCHAR(50) NOT NULL, -- 'login', 'password_reset', etc.
  attempts               INTEGER NOT NULL DEFAULT 1,
  window_start           TIMESTAMP NOT NULL DEFAULT NOW(),
  blocked_until          TIMESTAMP,
  
  UNIQUE(identifier, action)
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_state ON users(state);
CREATE INDEX idx_users_email_verified ON users(email_verified);
CREATE INDEX idx_users_jwt_version ON users(jwt_version);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_last_login_at ON users(last_login_at);
CREATE INDEX idx_users_email_verification_token ON users(email_verification_token) WHERE email_verification_token IS NOT NULL;
CREATE INDEX idx_users_password_reset_token ON users(password_reset_token) WHERE password_reset_token IS NOT NULL;

-- OAuth providers indexes
CREATE INDEX idx_oauth_user_id ON user_oauth_providers(user_id);
CREATE INDEX idx_oauth_provider_lookup ON user_oauth_providers(provider, provider_id);

-- User tokens indexes
CREATE INDEX idx_user_tokens_user_id ON user_tokens(user_id);
CREATE INDEX idx_user_tokens_expires_at ON user_tokens(expires_at);
CREATE INDEX idx_user_tokens_revoked_at ON user_tokens(revoked_at) WHERE revoked_at IS NOT NULL;
CREATE INDEX idx_user_tokens_type ON user_tokens(token_type);
CREATE INDEX idx_user_tokens_device ON user_tokens(device_fingerprint) WHERE device_fingerprint IS NOT NULL;

-- Security events indexes
CREATE INDEX idx_security_events_user_id ON user_security_events(user_id);
CREATE INDEX idx_security_events_type ON user_security_events(event_type);
CREATE INDEX idx_security_events_created_at ON user_security_events(created_at);

-- Sessions indexes
CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON user_sessions(expires_at);

-- Rate limits indexes
CREATE INDEX idx_rate_limits_identifier ON rate_limits(identifier);
CREATE INDEX idx_rate_limits_action ON rate_limits(action);
CREATE INDEX idx_rate_limits_blocked_until ON rate_limits(blocked_until) WHERE blocked_until IS NOT NULL;