const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
const dbPath = path.resolve(__dirname, 'delivery.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// --- Routes ---

// Categories
app.get('/categories', (req, res) => {
    db.all('SELECT * FROM categories', [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/categories', (req, res) => {
    const { id, name, icon, emoji } = req.body;
    const sql = 'INSERT INTO categories (id, name, icon, emoji) VALUES (?, ?, ?, ?)';
    const params = [id, name, icon, emoji];
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'Category added', id: this.lastID });
    });
});

app.delete('/categories/:id', (req, res) => {
    const sql = 'DELETE FROM categories WHERE id = ?';
    db.run(sql, req.params.id, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'Category deleted', changes: this.changes });
    });
});

// Venues (Restaurants/Supermarkets)
app.get('/venues', (req, res) => {
    db.all('SELECT * FROM venues', [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        // Parse categories JSON string back to array
        const venues = rows.map(venue => ({
            ...venue,
            categories: JSON.parse(venue.categories)
        }));
        res.json(venues);
    });
});

app.post('/venues', (req, res) => {
    const { id, name, rating, deliveryTime, image, categories, priceRange, website } = req.body;
    const sql = 'INSERT INTO venues (id, name, rating, deliveryTime, image, categories, priceRange, website) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [id, name, rating, deliveryTime, image, JSON.stringify(categories), priceRange, website];
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'Venue added', id: this.lastID });
    });
});

app.delete('/venues/:id', (req, res) => {
    const sql = 'DELETE FROM venues WHERE id = ?';
    db.run(sql, req.params.id, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'Venue deleted', changes: this.changes });
    });
});

// Products
app.get('/products', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/products', (req, res) => {
    const { id, venueId, name, description, price, image } = req.body;
    const sql = 'INSERT INTO products (id, venueId, name, description, price, image) VALUES (?, ?, ?, ?, ?, ?)';
    const params = [id, venueId, name, description, price, image];
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'Product added', id: this.lastID });
    });
});

app.delete('/products/:id', (req, res) => {
    const sql = 'DELETE FROM products WHERE id = ?';
    db.run(sql, req.params.id, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'Product deleted', changes: this.changes });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
