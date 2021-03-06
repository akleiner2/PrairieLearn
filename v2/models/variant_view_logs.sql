CREATE TABLE IF NOT EXISTS variant_view_logs (
    id SERIAL PRIMARY KEY,
    variant_id INTEGER NOT NULL REFERENCES variants ON DELETE CASCADE ON UPDATE CASCADE,
    access_log_id INTEGER UNIQUE NOT NULL REFERENCES access_logs ON DELETE CASCADE ON UPDATE CASCADE,
    open BOOLEAN,
    credit INTEGER
);
