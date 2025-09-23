// const { Pool } = require('pg')
// const pool = new Pool({
//     host: 'db',
//     port: 5432,
//     user: 'user123',
//     password: 'password123',
//     database: 'db123'
// })

// module.exports = pool

const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'user123',
  password: process.env.DB_PASSWORD || 'password123',
  database: process.env.DB_NAME || 'db123',
  port: 5432
});

module.exports = pool
