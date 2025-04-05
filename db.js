// db.js
const sqlite3 = require('sqlite3').verbose();

// Crear conexión
const db = new sqlite3.Database('users.sqlite', (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});

// Crear tabla "users" si no existe
const sql_create = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    gender TEXT NOT NULL,
    age TEXT
  );
`;

db.run(sql_create, (err) => {
  if (err) {
    console.error('Error al crear tabla:', err.message);
  } else {
    console.log('Tabla "users" lista.');
  }
});

module.exports = db;
