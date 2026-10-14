const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool instead of a single connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ai_trip_planner_db',
  port: process.env.DB_PORT || 3306,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Setup database and tables automatically
async function setupDatabase() {
  try {
    // First connect without a database selected to create it if it doesn't exist
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'ai_trip_planner_db'}\`;`);
    await connection.end();

    // Now create the required tables
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar VARCHAR(255),
        isVerified BOOLEAN DEFAULT false,
        verificationToken VARCHAR(255),
        resetPasswordToken VARCHAR(255),
        resetPasswordExpires BIGINT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createTripsTable = `
      CREATE TABLE IF NOT EXISTS trips (
        id VARCHAR(255) PRIMARY KEY,
        userId VARCHAR(255) NOT NULL,
        data JSON NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    await pool.query(createUsersTable);
    await pool.query(createTripsTable);
    
    // Check if columns exist, if not add them (for existing db)
    try {
      await pool.query('ALTER TABLE users ADD COLUMN resetPasswordToken VARCHAR(255)');
      await pool.query('ALTER TABLE users ADD COLUMN resetPasswordExpires BIGINT');
    } catch (e) {
      // Columns likely already exist, which is fine
    }
    
    console.log("✅ Database and tables are ready!");

  } catch (error) {
    console.error("❌ Failed to setup database:", error);
  }
}

setupDatabase();

module.exports = pool;
