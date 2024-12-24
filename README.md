# photo_gallery

A web application to manage photo galleries.

## Available Scripts

Here are the commands you can run in this project:

```bash
frontend: webpack-dev-server --config webpack.config.js
backend: node backend/server.js
start: concurrently "npm run frontend" "npm run backend"
build: Webpack .
```

## How to Run Scripts

Use `npm run <script>` or `yarn <script>` to execute the scripts.

## Script to create a database and tables

```bash
CREATE DATABASE PhotoGallery;
GO

-- Use the database
USE PhotoGallery;
GO

-- Script to create tables
CREATE TABLE Images (
Id INT PRIMARY KEY IDENTITY(1,1),
GalleryId INT NOT NULL, -- This column references the Galleries table
name NVARCHAR(255) NOT NULL,
blob VARBINARY(MAX) NULL, -- Binary data column
favorite BIT DEFAULT 0, -- Boolean-like field
comment NVARCHAR(255),
UploadedAt DATETIME DEFAULT GETDATE(),
FOREIGN KEY (GalleryId) REFERENCES Galleries(Id) -- Add FK to Galleries(Id)
);

CREATE TABLE Galleries (
Id INT PRIMARY KEY IDENTITY(1,1), -- Unique gallery ID
GalleryName NVARCHAR(50) NOT NULL, -- Name of the gallery (required)
Username NVARCHAR(100) NOT NULL, -- Hashed username (increase size for longer hashes),
CreatedAt DATETIME DEFAULT GETDATE() -- Automatically track creation timestamp
);
```
