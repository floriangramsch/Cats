const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',  // Frontend URL
  methods: 'GET, POST, DELETE, OPTIONS',
  allowedHeaders: 'Content-Type'
}));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/api/cats', (req, res) => {
  pool.query('SELECT * FROM cat', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Datenbankfehler: ' + error.message });
      return;
    }
    res.json(results);
  });
});

app.get('/api/cats/:id', (req, res) => {
  const { id } = req.params;
  pool.query('SELECT * FROM cat WHERE id = ?', [id], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Datenbankfehler: ' + error.message });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Katze nicht gefunden' });
      return;
    }
    res.json(results[0]);
  });
});

app.get('/api/ate', (req, res) => {
  pool.query('SELECT * FROM ate', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Datenbankfehler: ' + error.message });
      return;
    }
    res.json(results);
  });
});

app.get('/api/ate/today', (req, res) => {
  pool.query('SELECT * FROM ate WHERE DATE(time) = CURDATE()', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Datenbankfehler: ' + error.message });
      return;
    }
    res.json(results);
  });
});

app.get('/api/ate/today/:catName', (req, res) => {
  const { catName } = req.params;
  pool.query('SELECT id, time FROM ate WHERE DATE(time) = CURDATE() AND cat_name = ?', [catName], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Datenbankfehler: ' + error.message });
      return;
    }
    res.json(results);
  });
});

app.post('/api/feed', (req, res) => {
  const { cat } = req.body;
  const time = new Date().toISOString().slice(0, 19).replace('T', ' ');
  pool.query('INSERT INTO ate (cat_name, time) VALUES (?, ?)', [cat, time], (error) => {
    if (error) {
      res.status(500).json({ error: 'Datenbankfehler: ' + error.message });
      return;
    }
    res.json({ message: 'Katze gefüttert' });
  });
});

app.delete('/api/uneat/:id', (req, res) => {
  const { id } = req.params;
  pool.query('DELETE FROM ate WHERE id = ?', [id], (error) => {
    if (error) {
      res.status(500).json({ error: 'Datenbankfehler: ' + error.message });
      return;
    }
    res.json({ message: 'Eintrag gelöscht' });
  });
});

app.listen(5000, () => {
  console.log('Server läuft auf http://localhost:5000');
});