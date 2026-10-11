require('dotenv').config(); // Load environment variables from .env file

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function runSqlFile() {
  // 1. Create connection using environment variables
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    multipleStatements: true // Required to execute an entire .sql file dump
  });

  try {
    console.log('Reading SQL file...');
    // Path to your .sql file
    const filePath = path.join(__dirname, 'batabase/vexora.sql');
    const sqlQuery = fs.readFileSync(filePath, 'utf8');

    console.log('Executing SQL queries...');
    await connection.query(sqlQuery);
    
    console.log('SQL file imported successfully!');
  } catch (err) {
    console.error('Error importing SQL file:', err);
  } finally {
    await connection.end();
  }
}

runSqlFile();