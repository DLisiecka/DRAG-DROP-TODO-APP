const DB_KEY = 'db';

const getStorage = (dbKey) => {
    const dbVal = localStorage.getItem(dbKey);
    const dbValParsed = JSON.parse(dbVal);
    return dbValParsed;
};

const setStorage = (dbKey, dbVal) => {
    const dbValStringified = JSON.stringify(dbVal);
    localStorage.setItem(dbKey, dbValStringified);
};

const getDB = () => {
    let getStorageVal = getStorage(DB_KEY);
    if(getStorageVal === null){
        getStorageVal = [];
    }
    return getStorageVal
};
const setDB = (db) => setStorage(DB_KEY, db);