# Photo Gallery

A web application to display, save, and load your photos.

## Installation

1. Clone this repository:

```bash
   git clone https://github.com/your-repo/photo_gallery.git
```

2. Navigate to the project folder:

```bash
   cd photo_gallery
```

3. Install dependencies:

```bash
   npm install
```

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

## Setting Up the Database (SQL Server)

1. Open **SQL Server Management Studio (SSMS)**.
2. Connect to your SQL Server instance.
3. Open a new query window and copy the following SQL script:

   ```sql
   CREATE DATABASE PhotoGallery;
   GO

   USE PhotoGallery;
   GO

   CREATE TABLE Galleries (
       Id INT PRIMARY KEY IDENTITY(1,1),
       GalleryName NVARCHAR(50) NOT NULL,
       Username NVARCHAR(100) NOT NULL,
       CreatedAt DATETIME DEFAULT GETDATE()
   );

   CREATE TABLE Images (
       Id INT PRIMARY KEY IDENTITY(1,1),
       GalleryId INT NOT NULL,
       Name NVARCHAR(255) NOT NULL,
       Blob VARBINARY(MAX) NULL,
       Favorite BIT DEFAULT 0,
       Comment NVARCHAR(255),
       UploadedAt DATETIME DEFAULT GETDATE(),
       FOREIGN KEY (GalleryId) REFERENCES Galleries(Id)
   );
   ```
