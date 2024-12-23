const dbConnect = require("./backend/db");

(async () => {
  try {
    const pool = await dbConnect(); // Connect to the database
    const result = await pool.request().query("SELECT TOP 5 * FROM Galleries");
    console.log("Query Results:", result.recordset); // Display the fetched rows
  } catch (err) {
    console.error("Error:", err.message);
  }
})();
