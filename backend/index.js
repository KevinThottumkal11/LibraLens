// StAuth10244: I Kevin Binu Thottumkal, 000884769 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else.

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const port = 3001;

const db = new sqlite3.Database('library.db', (err) => {
    if (err) {
        console.error('ERROR:', err);
    }
    console.log('Connection Successful');
});

db.serialize(() => {
    // removing the existing table.
    db.run("DROP TABLE IF EXISTS library");

    // creating table; id is autoincremented
    db.run(`
        CREATE TABLE IF NOT EXISTS library (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            publishedYear INTEGER NOT NULL,
            genre TEXT NOT NULL,
            numPages INTEGER NOT NULL
        )
    `);
});

// Collection GET
app.get('/api/', (req, res) => {
    db.all('SELECT * FROM library', [], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.json(results);
    });
});

// Collection PUT
app.put('/api/', (req, res) => {
    const books = req.body;
    db.serialize(() => {
        db.run('DELETE FROM library');
        const stmt = db.prepare('INSERT INTO library (title, author, publishedYear, genre, numPages) VALUES (?, ?, ?, ?, ?)');
        books.forEach(book => {
            stmt.run([book.title, book.author, book.publishedYear, book.genre, book.numPages]);
        });
        stmt.finalize();
        res.json({ status: "REPLACE COLLECTION SUCCESSFUL" });
    });
});

// Collection POST
app.post('/api/', (req, res) => {
    const book = req.body;
    db.run('INSERT INTO library (title, author, publishedYear, genre, numPages) VALUES (?, ?, ?, ?, ?)',
        [book.title, book.author, book.publishedYear, book.genre, book.numPages],
        (error) => {
            if (error) {
                res.status(500).json({ error: error.message });
                return;
            }
            res.json({ status: "CREATE ENTRY SUCCESSFUL" });
        }
    );
});

// Collection DELETE
app.delete('/api/', (req, res) => {
    db.run('DELETE FROM library', [], (error) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.json({ status: "DELETE COLLECTION SUCCESSFUL" });
    });
});

// Item GET
app.get('/api/:id', (req, res) => {
    db.get('SELECT * FROM library WHERE id = ?', [req.params.id], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        if (!results) {
            res.status(404).json({ error: "Book not found" });
            return;
        }
        res.json(results);
    });
});

// Item PUT
app.put('/api/:id', (req, res) => {
    const book = req.body;
    db.run(
        'UPDATE library SET title = ?, author = ?, publishedYear = ?, genre = ?, numPages = ? WHERE id = ?',
        [book.title, book.author, book.publishedYear, book.genre, book.numPages, req.params.id],
        (error) => {
            if (error) {
                res.status(500).json({ error: error.message });
                return;
            }
            res.json({ status: "UPDATE ITEM SUCCESSFUL" });
        }
    );
});

// Item DELETE
app.delete('/api/:id', (req, res) => {
    db.run('DELETE FROM library WHERE id = ?', [req.params.id], (error) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.json({ status: "DELETE ITEM SUCCESSFUL" });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});