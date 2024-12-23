const express = require("express");
const router = express.Router();
const multer = require("multer");
const sql = require("mssql");
const sharp = require("sharp");
const db = require("./db"); // Import your database connection

const upload = multer();

// Save image
const MAX_WIDTH = 1080;
const MAX_HEIGHT = 1440;

router.post("/", upload.any(), async (req, res) => {
  const { galleryName } = req.body;

  const imageInfo = req.body.images.map((image, index) => {
    return {
      originalName: req.files[index]?.originalname, // File name
      blob: req.files[index]?.buffer, // File buffer
      favorite: image.favorite === "true",
      comment: image.comment,
    };
  });

  // Ensure galleryName is provided
  if (!galleryName) {
    return res.status(400).json({ error: "Gallery name is required" });
  }

  // Parse `imageInfo` data from the request body

  // Validate imageInfo array
  if (!Array.isArray(imageInfo) || imageInfo.length === 0) {
    return res.status(400).json({ error: "No image information provided" });
  }

  try {
    const pool = await db();

    // Step 1: Insert into Galleries table
    const galleryResult = await pool
      .request()
      .input("galleryName", sql.NVarChar, galleryName)
      .query(
        "INSERT INTO Galleries (GalleryName) VALUES (@galleryName); SELECT SCOPE_IDENTITY() AS GalleryID;"
      );

    // Get the newly inserted GalleryID
    const galleryID = galleryResult.recordset[0].GalleryID;

    // Step 2: Resize and insert each image into the Images table
    for (const image of imageInfo) {
      const { originalName } = image; // Destructure fields from each image object

      // Resize the image using Sharp
      const resizedImage = await sharp(image.blob)
        .rotate()
        .resize({
          width: MAX_WIDTH,
          height: MAX_HEIGHT,
          fit: "inside", // Ensures the aspect ratio is maintained and fits within the dimensions
          withoutEnlargement: true, // Ensures the image isn't enlarged beyond its original size
        })
        .toBuffer(); // Convert the resized image back to a buffer

      // Save the resized image into the database
      await pool
        .request()
        .input("name", sql.NVarChar, originalName) // File name
        .input("blob", sql.VarBinary, resizedImage) // Save the resized image buffer
        .input("galleryID", sql.Int, galleryID) // Link to the gallery
        .input("favorite", sql.Bit, image.favorite) // Favorite status
        .input("comment", sql.NVarChar, image.comment) // Comment
        .query(
          "INSERT INTO Images (name, blob, GalleryID, favorite, comment) VALUES (@name, @blob, @galleryID, @favorite, @comment);"
        );
    }

    // Success response
    res.status(201).json({
      message: "Images and gallery saved successfully",
      galleryID,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to save data", details: err.message });
  }
});

// Fetch 16 images
router.get("/", async (req, res) => {
  // GET /images
  try {
    const { galleryName, requestCount } = req.query;
    const limit = 16; // Number of images per page
    const offset = (requestCount - 1) * limit; // Calculate offset based on page

    if (!galleryName) {
      return res.status(400).json({ error: "Gallery name is required" });
    }

    const pool = await db();

    const galleryResult = await pool
      .request()
      .input("galleryName", sql.NVarChar, galleryName)
      .query("SELECT Id FROM Galleries where GalleryName = @galleryName");

    const galleryId = galleryResult.recordset[0].Id;

    const imageResult = await pool
      .request()
      .input("galleryId", sql.Int, galleryId)
      .query(
        `SELECT * FROM Images WHERE GalleryId = @galleryId ORDER BY Id OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`
      );

    res.json(imageResult.recordset);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch images", details: err.message });
  }
});

// Fetch galleries
router.get("/galleries", async (req, res) => {
  // GET /images/galleries
  try {
    const pool = await db();
    const result = await pool.request().query("SELECT * FROM Galleries");
    res.json(result.recordset);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch galleries", details: err.message });
  }
});

module.exports = router;
