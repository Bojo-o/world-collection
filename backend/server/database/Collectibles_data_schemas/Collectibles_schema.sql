DROP TABLE IF EXISTS Collectibles;

CREATE TABLE Collectibles(
  qNumber INTEGER NOT NULL,
  collection INTEGER NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  CONSTRAINT PK_Collectible PRIMARY KEY (qNumber,collection),
  FOREIGN KEY (collection) REFERENCES Collections(collectionID)
);