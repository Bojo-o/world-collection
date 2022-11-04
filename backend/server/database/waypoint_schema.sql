DROP TABLE IF EXISTS waypoints;

CREATE TABLE waypoints (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL
);