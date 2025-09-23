const express = require('express')
const path = require('path')
const pool = require('./db')
const port = 3000

const app = express()
app.use(express.json())

// Serve static UI
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// ---------- CRUD API Routes ----------

// CREATE
app.post('/schools', async (req, res) => {
    const { name, address } = req.body       // <-- changed location -> address
    try {
        const result = await pool.query(
            'INSERT INTO schools (name, address) VALUES ($1, $2) RETURNING *',
            [name, address]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

// READ all
app.get('/schools', async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM schools ORDER BY id ASC')
        res.status(200).json(data.rows)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

// READ single by id
app.get('/schools/:id', async (req, res) => {
    const { id } = req.params
    try {
        const result = await pool.query('SELECT * FROM schools WHERE id = $1', [id])
        if (result.rows.length === 0) return res.status(404).json({ message: "Not found" })
        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

// UPDATE
app.put('/schools/:id', async (req, res) => {
    const { id } = req.params
    const { name, address } = req.body        // <-- changed location -> address
    try {
        const result = await pool.query(
            'UPDATE schools SET name = $1, address = $2 WHERE id = $3 RETURNING *',
            [name, address, id]
        )
        if (result.rows.length === 0) return res.status(404).json({ message: "Not found" })
        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

// DELETE
app.delete('/schools/:id', async (req, res) => {
    const { id } = req.params
    try {
        const result = await pool.query(
            'DELETE FROM schools WHERE id = $1 RETURNING *',
            [id]
        )
        if (result.rows.length === 0) return res.status(404).json({ message: "Not found" })
        res.json({ message: "Deleted successfully", deleted: result.rows[0] })
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

// ---------- Table Setup ----------
app.get('/setup', async (req, res) => {
    try {
        await pool.query(
            'CREATE TABLE IF NOT EXISTS schools (id SERIAL PRIMARY KEY, name VARCHAR(100), address VARCHAR(100))'
        )
        await pool.query(`
            INSERT INTO schools (name, address)
            VALUES
                ('Vishal', 'Delhi'),
                ('Vivek', 'Mumbai')
            ON CONFLICT DO NOTHING
        `);
        res.json({ message: "Table ready with some data" })
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`))
 