require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const cloudinary = require("./config/cloudinary");
const fs = require("fs");
const path = require("path");

// Import models
const BlogPost = require("./models/BlogPost");
const User = require("./models/User");

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Support both MONGO_URI and MONGODB_URI
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log("\n✅ MongoDB Connected\n");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Upload image to Cloudinary
const uploadToCloudinary = async (localPath, resourceType = "image") => {
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      folder: "gisthub",
      resource_type: resourceType,
      transformation: [
        { width: 1200, height: 630, crop: "limit" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });
    return result.secure_url;
  } catch (error) {
    console.error(`  ❌ Failed to upload ${localPath}:`, error.message);
    return null;
  }
};

// Extract filename from URL or path
const getFilename = (url) => {
  const parts = url.split("/");
  return parts[parts.length - 1];
};

// Migration function
const migrateToCloudinary = async () => {
  try {
    console.log("=".repeat(50));
    console.log("🚀 Cloudinary Migration Script");
    console.log("=".repeat(50) + "\n");

    const uploadsDir = path.join(__dirname, "uploads");

    // Check if uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      console.log("⚠️  No local uploads directory found.");
      console.log(
        "   This script will only work if you have local images to migrate.\n"
      );
      return;
    }

    let blogPostsUpdated = 0;
    let usersUpdated = 0;
    let imagesUploaded = 0;
    let imagesFailed = 0;

    // Migrate Blog Post Cover Images
    console.log("📝 Migrating blog post cover images...\n");
    const blogPosts = await BlogPost.find({});

    for (const post of blogPosts) {
      if (!post.coverImageUrl) continue;

      const filename = getFilename(post.coverImageUrl);
      const localPath = path.join(uploadsDir, filename);

      // Check if file exists locally
      if (fs.existsSync(localPath)) {
        console.log(`  📤 Uploading: ${post.title}`);
        const cloudinaryUrl = await uploadToCloudinary(localPath);

        if (cloudinaryUrl) {
          const oldUrl = post.coverImageUrl;
          post.coverImageUrl = cloudinaryUrl;
          await post.save();

          blogPostsUpdated++;
          imagesUploaded++;
          console.log(`  ✅ Success!`);
          console.log(`     Old: ${oldUrl}`);
          console.log(`     New: ${cloudinaryUrl}\n`);
        } else {
          imagesFailed++;
          console.log(`  ⚠️  Skipped (upload failed)\n`);
        }
      } else {
        console.log(`  ⚠️  Skipped: ${post.title} (file not found locally)\n`);
      }
    }

    // Migrate User Profile Images
    console.log("\n👤 Migrating user profile images...\n");
    const users = await User.find({});

    for (const user of users) {
      if (!user.profileImageUrl) continue;

      const filename = getFilename(user.profileImageUrl);
      const localPath = path.join(uploadsDir, filename);

      // Check if file exists locally
      if (fs.existsSync(localPath)) {
        console.log(`  📤 Uploading: ${user.name} (${user.email})`);
        const cloudinaryUrl = await uploadToCloudinary(localPath);

        if (cloudinaryUrl) {
          const oldUrl = user.profileImageUrl;
          user.profileImageUrl = cloudinaryUrl;
          await user.save();

          usersUpdated++;
          imagesUploaded++;
          console.log(`  ✅ Success!`);
          console.log(`     Old: ${oldUrl}`);
          console.log(`     New: ${cloudinaryUrl}\n`);
        } else {
          imagesFailed++;
          console.log(`  ⚠️  Skipped (upload failed)\n`);
        }
      } else {
        console.log(`  ⚠️  Skipped: ${user.name} (file not found locally)\n`);
      }
    }

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("📊 MIGRATION SUMMARY");
    console.log("=".repeat(50));
    console.log(`Blog Posts Updated: ${blogPostsUpdated}`);
    console.log(`Users Updated: ${usersUpdated}`);
    console.log(`Images Uploaded: ${imagesUploaded}`);
    console.log(`Images Failed: ${imagesFailed}`);
    console.log("=".repeat(50) + "\n");

    if (imagesUploaded === 0) {
      console.log(
        "ℹ️  No images were migrated. Check if local files exist in uploads/"
      );
    } else {
      console.log("✅ Migration completed successfully!");
      console.log("🌐 All images are now hosted on Cloudinary");
      console.log("💡 You can now delete the local uploads/ folder");
    }
  } catch (error) {
    console.error("\n❌ Migration error:", error);
    throw error;
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await migrateToCloudinary();
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  } finally {
    console.log("\n🎉 All done! Closing database connection...");
    await mongoose.connection.close();
    console.log("✅ Database connection closed.\n");
  }
};

main();
