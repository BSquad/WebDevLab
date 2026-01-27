import { promises as fs } from "fs";
import path from "path";
import { Db } from "./db.js";

const DB_PATH = path.join("./database.sqlite");

async function resetDatabase() {
  try {
    await fs.access(DB_PATH);
    console.log("Bestehende Datenbank gefunden, wird gelöscht...");
    await fs.unlink(DB_PATH);
    console.log("Datenbank gelöscht.");
  } catch (err) {
    console.log("Keine bestehende Datenbank gefunden, überspringe Löschung.");
  }

  const db = new Db();
  await db.initDB();
  await db.createInitialData();
  console.log("Datenbank neu initialisiert.");
}

resetDatabase().catch(err => {
  console.error("Fehler beim Zurücksetzen der DB:", err);
});
