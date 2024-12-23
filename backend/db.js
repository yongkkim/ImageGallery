const sql = require("mssql");

const config = {
  server: "localhost", // Replace with your SQL Server name or IP
  database: "PhotoGallery", // Your database name
  user: "ykkim6", // SQL Server Authentication username
  password: "Password123^", // SQL Server Authentication password
  options: {
    encrypt: false, // Disable encryption for local SQL Server
    trustServerCertificate: true, // Required for self-signed certificates
  },
};

module.exports = async () => {
  try {
    const pool = await sql.connect(config);
    console.log("Database connected successfully");
    return pool;
  } catch (err) {
    console.error("Database Connection Error:", err);
    throw err;
  }
};
