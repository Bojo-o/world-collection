DROP TABLE IF EXISTS Collections;

-- Schema for creating a new table with collections content
CREATE TABLE Collections(
  collection_id INTEGER PRIMARY KEY AUTOINCREMENT, --a unique id of collection
  name TEXT UNIQUE NOT NULL -- name of collection
);