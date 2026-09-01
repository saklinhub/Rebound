CREATE TABLE audit_entries (
    id BIGSERIAL PRIMARY KEY,
    transaction_id VARCHAR(255) NOT NULL REFERENCES transactions(id),
    timestamp TIMESTAMP(6) WITHOUT TIME ZONE NOT NULL,
    action VARCHAR(255) NOT NULL,
    detail TEXT,
    intervention VARCHAR(255),
    confidence INTEGER,
    outcome VARCHAR(255),
    api_fallback BOOLEAN NOT NULL,
    gemini_raw_response TEXT,
    processing_time_ms BIGINT
);
