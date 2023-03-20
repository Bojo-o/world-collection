DROP TABLE IF EXISTS Collectibles;

-- Schema for creating a new table with collectibles content
CREATE TABLE Collectibles(
  q_number INTEGER NOT NULL, --Q number of the entity,we store only int number, we later add prefix 'Q'
  collection_id INTEGER NOT NULL, -- ID of collection where the entity belongs
  name TEXT NOT NULL, -- name of entity, what it is called
  instance_of TEXT NOT NULL, -- all super class,it describes the entity in more details what it is, delimited by '/'
  latitude REAL NOT NULL, -- latitude coordinate
  longitude REAL NOT NULL, -- longtitude coordinate
  is_visited BOOL DEFAULT false, -- check if the entity have already been visited  
  --year_of_visit YEAR, -- the year of visit, is used if we do not know exact date of visit, only remember the year
  visit_date_from DATE DEFAULT NULL, -- 
  visit_date_to DATE DEFAULT NULL, --
  visit_date_format TEXT DEFAULT NULL,
  icon TEXT NOT NULL DEFAULT 'default',
  notes TEXT DEFAULT NULL,
  CONSTRAINT PK_Collectible PRIMARY KEY (q_number,collection_id),   -- set the pair Q number and id of collection as unique primary key, the primary key value can be stored only once,
                                                                -- but for the entity it should be posibble to assing it to more collections 
  FOREIGN KEY (collection_id) REFERENCES Collections(collection_id) ON DELETE CASCADE   -- use collection id as foreign key, if the collection was deleted, 
                                                                                    -- it automatic cleans all entities, which belonged in that collection 
);