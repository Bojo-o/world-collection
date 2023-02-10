DROP TABLE IF EXISTS Collections_TEST;

-- Schema for creating a new table with collections content
CREATE TABLE Collections_TEST(
  collection_id INTEGER NOT NULL AUTOINCREMENT, --a unique id of collection
  name TEXT UNIQUE NOT NULL, -- name of collection
  PRIMARY KEY (collection_id)
);