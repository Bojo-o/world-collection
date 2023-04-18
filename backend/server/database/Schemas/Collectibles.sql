DROP TABLE IF EXISTS Collectibles;

-- Schema for creating a new table, which will contain collectibles content
CREATE TABLE Collectibles(
  q_number INTEGER NOT NULL, --QNumber of the collectible, we use the same identifier as WIKIDATA uses for further using
  collection_id INTEGER NOT NULL, -- ID of collection where the collectible belongs
  name TEXT NOT NULL, -- name of collectible
  instance_of TEXT NOT NULL, -- all "super class", it helps to describes the collectible in more details likes if collectible is castle or cave, delimited by '/'
  latitude REAL NOT NULL, -- latitude coordinate of collectible
  longitude REAL NOT NULL, -- longtitude coordinate of collectible
  is_visited BOOL DEFAULT false, -- check value for storing info about collectible visitation 
  visit_date_from DATE DEFAULT NULL, -- date representing visitation, if this is not null and "visit_date_to" is null , it means that, an user set visit as spedicif date not range of time
  visit_date_to DATE DEFAULT NULL, -- date representing visitation, used if an user set range of visit not just specific time
  visit_date_format TEXT DEFAULT NULL, -- format of date, it helps fronted to know how to render date of visit 
  icon TEXT NOT NULL DEFAULT 'default', -- name of icon image, which fronted renders on the web page
  notes TEXT DEFAULT NULL,  --  notes of collectible, an user can makes notes about collectible, in this that notes will be stored
  CONSTRAINT PK_Collectible PRIMARY KEY (q_number,collection_id),   -- set the pair Q number and ID of collection as unique primary key, the primary key value can be stored only once,
                                                                -- but for the entity it should be posibble to assing it to more collections 
  FOREIGN KEY (collection_id) REFERENCES Collections(collection_id) ON DELETE CASCADE   -- use collection id as foreign key, if the collection was deleted, 
                                                                                    -- it automatic cleans all entities, which belonged in that collection 
);