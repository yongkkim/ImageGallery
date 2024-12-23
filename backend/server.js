const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const imageRoutes = require("./image");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use("/images", imageRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
