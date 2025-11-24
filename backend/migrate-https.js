const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// Load environment variables
const envFile = fs.existsSync(path.join(__dirname, ".env"))
  ? path.join(__dirname, ".env")
  : fs.existsSync(path.join(__dirname, ".env.local"))
  ? path.join(__dirname, ".env.local")
  : null;

if (envFile) {
  dotenv.config({ path: envFile });
} else {
  dotenv.config();
}

const BlogPost = require("./models/BlogPost");
const User = require("./models/User");

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Migration function to update HTTP to HTTPS and fix localhost URLs
const migrateHttpToHttps = async () => {
  try {
    console.log("\n🔄 Starting migration: HTTP → HTTPS...\n");

    // Get production URL from environment or use default
    const productionUrl =
      process.env.BACKEND_URL || "https://gisthub-backend-q5qd.onrender.com";
    console.log(`🌐 Production URL: ${productionUrl}\n`);

    // Update Blog Posts
    console.log("📝 Migrating blog post cover images...");
    const blogPosts = await BlogPost.find({
      $or: [
        { coverImageUrl: { $regex: "^http://", $options: "i" } },
        { coverImageUrl: { $regex: "localhost", $options: "i" } },
      ],
    });

    let blogPostsUpdated = 0;
    for (const post of blogPosts) {
      const oldUrl = post.coverImageUrl;
      let newUrl = oldUrl;

      // Replace http:// with https://
      newUrl = newUrl.replace(/^http:\/\//i, "https://");

      // Replace localhost:8000 with production URL
      newUrl = newUrl.replace(/https?:\/\/localhost:8000/gi, productionUrl);

      if (oldUrl !== newUrl) {
        post.coverImageUrl = newUrl;
        await post.save();

        blogPostsUpdated++;
        console.log(`  ✓ Updated: ${post.title}`);
        console.log(`    Old: ${oldUrl}`);
        console.log(`    New: ${newUrl}\n`);
      }
    }

    // Update User Profile Images
    console.log("\n👤 Migrating user profile images...");
    const users = await User.find({
      $or: [
        { profileImageUrl: { $regex: "^http://", $options: "i" } },
        { profileImageUrl: { $regex: "localhost", $options: "i" } },
      ],
    });

    let usersUpdated = 0;
    for (const user of users) {
      const oldUrl = user.profileImageUrl;
      let newUrl = oldUrl;

      // Replace http:// with https://
      newUrl = newUrl.replace(/^http:\/\//i, "https://");

      // Replace localhost:8000 with production URL
      newUrl = newUrl.replace(/https?:\/\/localhost:8000/gi, productionUrl);

      if (oldUrl !== newUrl) {
        user.profileImageUrl = newUrl;
        await user.save();

        usersUpdated++;
        console.log(`  ✓ Updated: ${user.name} (${user.email})`);
        console.log(`    Old: ${oldUrl}`);
        console.log(`    New: ${newUrl}\n`);
      }
    }

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("📊 MIGRATION SUMMARY");
    console.log("=".repeat(50));
    console.log(`Blog Posts Updated: ${blogPostsUpdated}`);
    console.log(`Users Updated: ${usersUpdated}`);
    console.log(`Total URLs Migrated: ${blogPostsUpdated + usersUpdated}`);
    console.log("=".repeat(50) + "\n");

    if (blogPostsUpdated === 0 && usersUpdated === 0) {
      console.log(
        "ℹ️  No HTTP URLs found. All images already use correct HTTPS URLs!"
      );
    } else {
      console.log("✅ Migration completed successfully!");
    }
  } catch (error) {
    console.error("\n❌ Migration error:", error);
    throw error;
  }
};

// Run migration
const runMigration = async () => {
  try {
    await connectDB();
    await migrateHttpToHttps();

    console.log("\n🎉 All done! Closing database connection...");
    await mongoose.connection.close();
    console.log("✅ Database connection closed.\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Fatal error:", error);
    process.exit(1);
  }
};

// Execute
console.log("\n" + "=".repeat(50));
console.log("🚀 HTTP to HTTPS Migration Script");
console.log("=".repeat(50) + "\n");

runMigration();
