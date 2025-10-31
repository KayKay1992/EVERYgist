const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error(
      "MongoDB connection failed: MONGO_URI is not set in environment"
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      // Fail fast if cluster/host is unreachable
      serverSelectionTimeoutMS: 5000,
    });
    const { host, name } = mongoose.connection;
    console.log(`MongoDB connected successfully`);
  } catch (error) {
    const message = error?.message || String(error);
    console.error("MongoDB connection failed:", message);
    if (message.includes("ENOTFOUND")) {
      console.error(
        "Hint: Check MONGO_URI host and URL-encode special characters in username/password (use %40 for @ in passwords)."
      );
    }
    process.exit(1);
  }
};

module.exports = connectDB;
