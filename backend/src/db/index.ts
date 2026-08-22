const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const databasePath = path.resolve(
    __dirname,
    "../../database.sqlite"
);

const sqlite = new DatabaseSync(databasePath);

console.log("DATABASE PATH:", databasePath);

module.exports = {
    sqlite,
    databasePath
};