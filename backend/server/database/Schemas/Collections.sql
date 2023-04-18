DROP TABLE IF EXISTS Collections;

-- Schema for creating a new table, which will contain collections data
CREATE TABLE Collections(
  collection_id INTEGER PRIMARY KEY AUTOINCREMENT, --a unique ID of collection
  name TEXT UNIQUE NOT NULL -- a unique name of collection
);