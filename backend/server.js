const express = require('express')
const path = require('path')
const pool = require('./db')
const client = require('prom-client')  // <-- Prometheus client
const port = 3000

const app = express()
app.use(express.json())

// ---------- Prometheus Metrics Setup ----------
const register = new client.Registry()
client.collectDefaultMetrics({ register })

// Counter for HTTP requests
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
})
register.registerMetric(httpRequestCounter)

// ---------- Serve static UI ----------
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// ---------- CRUD API Routes ----------

// CREATE
app.post('/schools', async (req, res) => {
  const { name, address } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO schools (name, address) VALUES ($1, $2) RETURNING *',
      [name, address]
    )
    httpRequestCounter.inc({ method: 'POST', route: '/schools', status: 201 })
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    httpRequestCounter.inc({ method: 'POST', route: '/schools', status: 500 })
    res.sendStatus(500)
  }
})

// READ all
app.get('/schools', async (req, res) => {
  try {
    const data = await pool.query('SELECT * FROM schools ORDER BY id ASC')
    httpRequestCounter.inc({ method: 'GET', route: '/schools', status: 200 })
    res.status(200).json(data.rows)
  } catch (err) {
    console.error(err)
    httpRequestCounter.inc({ method: 'GET', route: '/schools', status: 500 })
    res.sendStatus(500)
  }
})

// READ single by id
app.get('/schools/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query('SELECT * FROM schools WHERE id = $1', [id])
    if (result.rows.length === 0) {
      httpRequestCounter.inc({ method: 'GET', route: '/schools/:id', status: 404 })
      return res.status(404).json({ message: "Not found" })
    }
    httpRequestCounter.inc({ method: 'GET', route: '/schools/:id', status: 200 })
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    httpRequestCounter.inc({ method: 'GET', route: '/schools/:id', status: 500 })
    res.sendStatus(500)
  }
})

// UPDATE
app.put('/schools/:id', async (req, res) => {
  const { id } = req.params
  const { name, address } = req.body
  try {
    const result = await pool.query(
      'UPDATE schools SET name = $1, address = $2 WHERE id = $3 RETURNING *',
      [name, address, id]
    )
    if (result.rows.length === 0) {
      httpRequestCounter.inc({ method: 'PUT', route: '/schools/:id', status: 404 })
      return res.status(404).json({ message: "Not found" })
    }
    httpRequestCounter.inc({ method: 'PUT', route: '/schools/:id', status: 200 })
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    httpRequestCounter.inc({ method: 'PUT', route: '/schools/:id', status: 500 })
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
    if (result.rows.length === 0) {
      httpRequestCounter.inc({ method: 'DELETE', route: '/schools/:id', status: 404 })
      return res.status(404).json({ message: "Not found" })
    }
    httpRequestCounter.inc({ method: 'DELETE', route: '/schools/:id', status: 200 })
    res.json({ message: "Deleted successfully", deleted: result.rows[0] })
  } catch (err) {
    console.error(err)
    httpRequestCounter.inc({ method: 'DELETE', route: '/schools/:id', status: 500 })
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
    `)
    httpRequestCounter.inc({ method: 'GET', route: '/setup', status: 200 })
    res.json({ message: "Table ready with some data" })
  } catch (err) {
    console.error(err)
    httpRequestCounter.inc({ method: 'GET', route: '/setup', status: 500 })
    res.sendStatus(500)
  }
})

// ---------- Prometheus Metrics Endpoint ----------
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType)
    res.end(await register.metrics())
  } catch (ex) {
    res.status(500).end(ex)
  }
})

// ---------- Start Server ----------
app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`))
