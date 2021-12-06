/** isHashableKey - O(n) such that n is the length of hashableKeys array
 * Returns a boolean indicating that the passed in value is a hasbale key
 *
 * @param {string} key  Key to test if hashable
 * @param {Array} hashableKeys Array of hashable keys
 * @return {boolean} Hashable or not
 */
export const isHashableKey = (key: string, hashableKeys: string[]): boolean => {
  const hashableKeysSet = new Set(hashableKeys);
  return hashableKeysSet.has(key)
}
const arrHashableKeys = ["id", "__typename"];
console.log(isHashableKey("id", arrHashableKeys));
console.log(isHashableKey("__typename", arrHashableKeys));
console.log(isHashableKey(["id"], arrHashableKeys));
console.log(isHashableKey({ "id": "id" }, arrHashableKeys));
console.log(isHashableKey("Brad", arrHashableKeys));

/* ----------------------------------------------------------------*/

















/* ----------------------------------------------------------------*/

/** containsHashableObject - O(n) such that n is the length of hashableKeys array
 * Returns a boolean indicating that the passed in value contains a hashable object. It must:
 * 1) Be an object
 * 2) Has all hashable keys
 *
 * @param {any} objectInQuestion Object being tested if hashable
 * @param {Array} hashableKeys Array of hashable keys
 * @return {boolean} Boolean indicating if objectInQuestion is hashable or not
 */

export const containsHashableObject = (objectInQuestion: GenericObject, hashableKeys: Array<string>) => {
  if (typeof objectInQuestion !== 'object' ||
    Array.isArray(objectInQuestion) ||
    !objectInQuestion
  ) return false;
  const objectInQuestionKeysSet = new Set(Object.keys(objectInQuestion));
  return hashableKeys.every(key => objectInQuestionKeysSet.has(key))
}

const containsHashableObjFalse1 =
  [
    "id",
    "__typename"
  ]
const containsHashableObjTrue1 =
{
  "id": "11",
  "__typename": "Movie",
  "title": "Ad Astra",
  "thing": { "generic": "thing" }
}
const containsHashableObjTrue2 = {
  "id": "7",
  "__typename": "Movie",
  "title": "Ad Astra",
  "releaseYear": 2019,
  "genre": "SCIFI",
  "actors": [
    {
      "id": "1",
      "__typename": "Actor",
      "firstName": "Brad",
      "lastName": "Pitt"
    },
    {
      "id": "14",
      "__typename": "Actor",
      "firstName": "Tommy Lee",
      "lastName": "Jones"
    }
  ]
}
const containsHashableObjTrue3 = {
  "id": "1",
  "__typename": "Actor",
  "firstName": "Brad",
  "lastName": "Pitt",
  "movies": ["Ad Astra", "Fight Club"]
}
console.log(containsHashableObject(containsHashableObjFalse1, arrHashableKeys));
console.log(containsHashableObject(containsHashableObjTrue1, arrHashableKeys));
console.log(containsHashableObject(containsHashableObjTrue2, arrHashableKeys));
console.log(containsHashableObject(containsHashableObjTrue3, arrHashableKeys));
/* ----------------------------------------------------------------*/















/* ----------------------------------------------------------------*/
/** isHashableObject - 
 * Returns a boolean indicating that the passed in value is hashable. It must:
 * 1) Contain hashable object
 * 2) Does not have any nesting (i.e., contains no objects or array values)
 *
 * @param {any} objectInQuestion Object being tested if hashable
 * @param {array} hashableKeys Array of hashable keys
 * @return {boolean} Boolean indicating if objectInQuestion is hashable or not
 */
export const isHashableObject = (objectInQuestion: any, hashableKeys: Array<string>): boolean => {
  if (!containsHashableObject(objectInQuestion, hashableKeys)) return false;
  for (const key in objectInQuestion) {
    if (typeof objectInQuestion[key] === 'object') return false;
  }
  return true;
}

const isHashableObjFalse1 =
  [
    "id",
    "__typename"
  ]
const isHashableObjFalse2 =
{
  "id": "11",
  "__typename": "Movie",
  "title": "Ad Astra",
  "thing": { "generic": "thing" }
}
const isHashableObjTrue1 =
{
  "id": "7",
  "__typename": "Movie",
  "title": "Ad Astra",
  "releaseYear": 2019,
  "genre": "SCIFI"
}
const isHashableObjTrue2 =
{
  "id": "1",
  "__typename": "Actor",
  "firstName": "Brad",
  "lastName": "Pitt"
}

console.log(isHashableObject(isHashableObjFalse1, arrHashableKeys));
console.log(isHashableObject(isHashableObjFalse2, arrHashableKeys));
console.log(isHashableObject(isHashableObjTrue1, arrHashableKeys));
console.log(isHashableObject(isHashableObjTrue2, arrHashableKeys));
/* ----------------------------------------------------------------*/







/* ----------------------------------------------------------------*/
type FlatObject = { [key: string]: (string | number | boolean) };
/**
 * Creates unique hash for an object with hashable keys
 *
 * @param {FlatObject} nestedObject Nested object 
 * @return {ArrayOfObjects} Array of normalized objects
 */
export const hashMaker = (hashableObject, hashableKeys): string => {
  if (!isHashableObject(hashableObject, hashableKeys)) return "Not a hashable object";

  let hash = '';
  let value = '';

  for (let i = hashableKeys.length - 1; i >= 0; i--) {
    value = '~';
    value += hashableObject[hashableKeys[i]]
    hash += value;
  }
  /*
  for(const hashableKey of hashableKeys){
      let value = '';
      value += tilde;
      value += hashableObject[hashableKey]
      hash += value;
  }
  */
  return hash;
}
console.log(hashMaker({ "id": "7", "__typename": "Movie", "title": "Ad Astra" }, arrHashableKeys));

/* ----------------------------------------------------------------*/
type GenericObject = { [key: string]: any };
type ArrayOfObjects = GenericObject[]

const printHashableObject = (hashableObject: GenericObject): GenericObject => {
  const hashObj = {};
  for (const key in hashableObject) {
    if (typeof hashableObject[key] !== 'object' && !hashObj.hasOwnProperty(key)) hashObj[key] = hashableObject[key];
  }
  return hashObj;
}

console.log(printHashableObject(containsHashableObjTrue1));
console.log(printHashableObject(containsHashableObjTrue2));
console.log(printHashableObject(containsHashableObjTrue3));

/* ----------------------------------------------------------------*/

/**
 * Flattens an arbitrarily nested object into an array of objects by: 
 * 
 *
 * @param {GenericObject} nestedObject Nested object 
 * @return {ArrayOfObjects} Array of normalized objects
 */
export const normalizeObject = (nestedObject: GenericObject, hashableKeys: Array<string>, normalizedObjects = []): ArrayOfObjects => {
  for (const key in nestedObject) {
    if (isHashableObject(nestedObject, hashableKeys)) normalizedObjects.push(nestedObject)
    if (isHashableObject(nestedObject[key], hashableKeys)) normalizedObjects.push(nestedObject[key])
    if (containsHashableObject(nestedObject[key], hashableKeys)) normalizedObjects.push(printHashableObject(nestedObject[key]));
    if (!containsHashableObject(nestedObject, hashableKeys)) normalizeObject(nestedObject[key], hashableKeys, normalizedObjects)
  }
  return normalizedObjects;
}
const nestedObject1 = {
  "data": {
    "movies": [
      {
        "id": "7",
        "__typename": "Movie",
        "title": "Ad Astra",
        "releaseYear": 2019,
        "genre": "SCIFI",
        "actors": [
          {
            "id": "1",
            "__typename": "Actor",
            "firstName": "Brad",
            "lastName": "Pitt"
          },
          {
            "id": "14",
            "__typename": "Actor",
            "firstName": "Tommy Lee",
            "lastName": "Jones"
          }
        ]
      },
      {
        "id": "15",
        "__typename": "Movie",
        "title": "World War Z",
        "releaseYear": 2013,
        "genre": "SCIFI",
        "actors": [
          {
            "id": "1",
            "__typename": "Actor",
            "firstName": "Brad",
            "lastName": "Pitt"
          }
        ]
      },
      {
        "id": "17",
        "__typename": "Movie",
        "title": "Sky Captain and the World of Tomorrow",
        "releaseYear": 2004,
        "genre": "SCIFI",
        "actors": [
          {
            "id": "2",
            "__typename": "Actor",
            "firstName": "Angelina",
            "lastName": "Jolie"
          },
          {
            "id": "25",
            "__typename": "Actor",
            "firstName": "Jude",
            "lastName": "Law"
          },
          {
            "id": "26",
            "__typename": "Actor",
            "firstName": "Gwyneth",
            "lastName": "Paltrow"
          }
        ]
      }
    ]
  }
}
console.log(normalizeObject(nestedObject1, arrHashableKeys))


























