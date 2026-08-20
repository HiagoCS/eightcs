const {DatabaseSync} = require("node:sqlite");
const { drizzle } = require("drizzle-orm/node-sqlite");

const sqlite = new DatabaseSync("./database.sqlite");

const db = drizzle(sqlite);

module.exports = { db };