const getStorage = (dbKey) => {
    const dbVal = localStorage.getItem(dbKey);
    const dbValParsed = JSON.parse(dbVal);
    return dbValParsed;
};

const setStorage = (dbKey, dbVal) => {
    const dbValStringified = JSON.stringify(dbVal);
    localStorage.setItem(dbKey, dbValStringified);
};

const getDB = () => getStorage(DB_KEY) || [];
const setDB = (db) => setStorage(DB_KEY, db);