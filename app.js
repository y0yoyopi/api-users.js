// app.js
const express = require('express');
const db = require('./db');
const app = express();
const PORT = 8001;

// Middleware para leer datos JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET /users → Obtener todos los usuarios
app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const users = rows.map(row => ({
      id: row.id,
      firstname: row.firstname,
      lastname: row.lastname,
      gender: row.gender,
      age: row.age
    }));
    res.json(users);
  });
});

// POST /users → Crear nuevo usuario
app.post('/users', (req, res) => {
  const { firstname, lastname, gender, age } = req.body;
  
  if (!firstname || !lastname || !gender) {
    res.status(400).json({ error: 'Firstname, lastname y gender son requeridos' });
    return;
  }

  const sql = `INSERT INTO users (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)`;
  db.run(sql, [firstname, lastname, gender, age], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ message: `Usuario creado con ID ${this.lastID}` });
  });
});

// GET /user/:id → Obtener un usuario por ID
app.get('/user/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (row) {
      res.json(row);
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  });
});

// PUT /user/:id → Actualizar un usuario
app.put('/user/:id', (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, gender, age } = req.body;

  const sql = `
    UPDATE users 
    SET firstname = ?, lastname = ?, gender = ?, age = ?
    WHERE id = ?
  `;
  db.run(sql, [firstname, lastname, gender, age, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      id,
      firstname,
      lastname,
      gender,
      age
    });
  });
});

// DELETE /user/:id → Eliminar un usuario
app.delete('/user/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM users WHERE id = ?';
  db.run(sql, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.send(`Usuario con id ${id} eliminado correctamente.`);
  });
});

// Iniciar el servidor en el puerto 8001
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
