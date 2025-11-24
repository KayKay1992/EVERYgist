const sharp = require("sharp");
const path = require("path");
const fs = require("fs").promises;

/**
 * Image Optimization Utility
 * Handles compression, thumbnail generation, and WebP conversion
 */

const THUMBNAIL_SIZES = {
  small: { width: 150, height: 150 },
  medium: { width: 400, height: 400 },
  large: { width: 800, height: 800 },
};

const IMAGE_QUALITY = {
  jpeg: 80,
  webp: 85,
  png: 90,
};

/**
 * Optimize image - compress and convert to WebP
 * @param {string} inputPath - Path to original image
 * @returns {Promise<Object>} - Paths to optimized images
 */
async function optimizeImage(inputPath) {
  try {
    const parsedPath = path.parse(inputPath);
    const outputDir = parsedPath.dir;
    const baseFilename = parsedPath.name;

    // Get image metadata
    const metadata = await sharp(inputPath).metadata();

    const results = {
      original: inputPath,
      optimized: null,
      webp: null,
      thumbnail: null,
      thumbnailWebp: null,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
      },
    };

    // 1. Create optimized version (compressed, original format)
    const optimizedPath = path.join(
      outputDir,
      `${baseFilename}-optimized${parsedPath.ext}`
    );

    if (metadata.format === "jpeg" || metadata.format === "jpg") {
      await sharp(inputPath)
        .jpeg({ quality: IMAGE_QUALITY.jpeg, progressive: true })
        .toFile(optimizedPath);
    } else if (metadata.format === "png") {
      await sharp(inputPath)
        .png({ quality: IMAGE_QUALITY.png, compressionLevel: 9 })
        .toFile(optimizedPath);
    } else {
      // For other formats, just copy
      await fs.copyFile(inputPath, optimizedPath);
    }

    results.optimized = optimizedPath;

    // 2. Create WebP version (better compression)
    const webpPath = path.join(outputDir, `${baseFilename}.webp`);
    await sharp(inputPath)
      .webp({ quality: IMAGE_QUALITY.webp })
      .toFile(webpPath);

    results.webp = webpPath;

    // 3. Generate thumbnail (for cards, previews)
    const thumbnailPath = path.join(
      outputDir,
      `${baseFilename}-thumb${parsedPath.ext}`
    );

    await sharp(inputPath)
      .resize(THUMBNAIL_SIZES.medium.width, THUMBNAIL_SIZES.medium.height, {
        fit: "cover",
        position: "center",
      })
      .jpeg({ quality: IMAGE_QUALITY.jpeg })
      .toFile(thumbnailPath);

    results.thumbnail = thumbnailPath;

    // 4. Generate WebP thumbnail
    const thumbnailWebpPath = path.join(
      outputDir,
      `${baseFilename}-thumb.webp`
    );

    await sharp(inputPath)
      .resize(THUMBNAIL_SIZES.medium.width, THUMBNAIL_SIZES.medium.height, {
        fit: "cover",
        position: "center",
      })
      .webp({ quality: IMAGE_QUALITY.webp })
      .toFile(thumbnailWebpPath);

    results.thumbnailWebp = thumbnailWebpPath;

    return results;
  } catch (error) {
    console.error("Error optimizing image:", error);
    throw new Error(`Image optimization failed: ${error.message}`);
  }
}

/**
 * Generate multiple thumbnail sizes
 * @param {string} inputPath - Path to original image
 * @returns {Promise<Object>} - Paths to different thumbnail sizes
 */
async function generateThumbnails(inputPath) {
  try {
    const parsedPath = path.parse(inputPath);
    const outputDir = parsedPath.dir;
    const baseFilename = parsedPath.name;

    const thumbnails = {};

    for (const [size, dimensions] of Object.entries(THUMBNAIL_SIZES)) {
      const thumbPath = path.join(
        outputDir,
        `${baseFilename}-thumb-${size}.jpg`
      );

      await sharp(inputPath)
        .resize(dimensions.width, dimensions.height, {
          fit: "cover",
          position: "center",
        })
        .jpeg({ quality: IMAGE_QUALITY.jpeg })
        .toFile(thumbPath);

      thumbnails[size] = thumbPath;

      // WebP version
      const thumbWebpPath = path.join(
        outputDir,
        `${baseFilename}-thumb-${size}.webp`
      );

      await sharp(inputPath)
        .resize(dimensions.width, dimensions.height, {
          fit: "cover",
          position: "center",
        })
        .webp({ quality: IMAGE_QUALITY.webp })
        .toFile(thumbWebpPath);

      thumbnails[`${size}Webp`] = thumbWebpPath;
    }

    return thumbnails;
  } catch (error) {
    console.error("Error generating thumbnails:", error);
    throw new Error(`Thumbnail generation failed: ${error.message}`);
  }
}

/**
 * Convert image to WebP format
 * @param {string} inputPath - Path to original image
 * @returns {Promise<string>} - Path to WebP image
 */
async function convertToWebP(inputPath) {
  try {
    const parsedPath = path.parse(inputPath);
    const outputPath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);

    await sharp(inputPath)
      .webp({ quality: IMAGE_QUALITY.webp })
      .toFile(outputPath);

    return outputPath;
  } catch (error) {
    console.error("Error converting to WebP:", error);
    throw new Error(`WebP conversion failed: ${error.message}`);
  }
}

/**
 * Compress image without changing format
 * @param {string} inputPath - Path to original image
 * @param {number} quality - Compression quality (1-100)
 * @returns {Promise<string>} - Path to compressed image
 */
async function compressImage(inputPath, quality = 80) {
  try {
    const parsedPath = path.parse(inputPath);
    const metadata = await sharp(inputPath).metadata();
    const outputPath = path.join(
      parsedPath.dir,
      `${parsedPath.name}-compressed${parsedPath.ext}`
    );

    if (metadata.format === "jpeg" || metadata.format === "jpg") {
      await sharp(inputPath)
        .jpeg({ quality, progressive: true })
        .toFile(outputPath);
    } else if (metadata.format === "png") {
      await sharp(inputPath)
        .png({ quality, compressionLevel: 9 })
        .toFile(outputPath);
    } else if (metadata.format === "webp") {
      await sharp(inputPath).webp({ quality }).toFile(outputPath);
    } else {
      // Unsupported format, return original
      return inputPath;
    }

    return outputPath;
  } catch (error) {
    console.error("Error compressing image:", error);
    throw new Error(`Image compression failed: ${error.message}`);
  }
}

/**
 * Get image info (dimensions, format, size)
 * @param {string} inputPath - Path to image
 * @returns {Promise<Object>} - Image metadata
 */
async function getImageInfo(inputPath) {
  try {
    const metadata = await sharp(inputPath).metadata();
    const stats = await fs.stat(inputPath);

    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: stats.size,
      sizeKB: (stats.size / 1024).toFixed(2),
      sizeMB: (stats.size / (1024 * 1024)).toFixed(2),
    };
  } catch (error) {
    console.error("Error getting image info:", error);
    throw new Error(`Failed to get image info: ${error.message}`);
  }
}

/**
 * Delete image and all its variants
 * @param {string} basePath - Base path to image (without extension variants)
 */
async function deleteImageVariants(basePath) {
  try {
    const parsedPath = path.parse(basePath);
    const dir = parsedPath.dir;
    const files = await fs.readdir(dir);

    // Find all files that match the base filename
    const variantFiles = files.filter((file) =>
      file.startsWith(parsedPath.name)
    );

    // Delete all variants
    for (const file of variantFiles) {
      const filePath = path.join(dir, file);
      await fs.unlink(filePath);
    }

    return { deleted: variantFiles.length };
  } catch (error) {
    console.error("Error deleting image variants:", error);
    throw new Error(`Failed to delete image variants: ${error.message}`);
  }
}

module.exports = {
  optimizeImage,
  generateThumbnails,
  convertToWebP,
  compressImage,
  getImageInfo,
  deleteImageVariants,
  THUMBNAIL_SIZES,
  IMAGE_QUALITY,
};
