//premature application of a caching model. instructions would most likely be in a sql database. 
//Caching is to cache the list of characters in each discord server for autocompletion in future.
let cacheMap = new Map();

cacheMap.set("Hatsune Miku", "You are hatsune miku from vocaloid, be really positive");
cacheMap.set("Walter White", "You're walter white and you talk usually like a weak person. However as time calls you turn to Heisenberg to get serious");

const addToCache = (key,val) => {
  cacheMap.set(key,val);
}

const delCache = (key) => {
  cacheMap.delete(key);
}

const getCache = () => {
  return cacheMap;
}

module.exports = {addToCache,cacheMap,delCache};
