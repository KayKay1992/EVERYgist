const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error(
      "MongoDB connection failed: MONGO_URI is not set in environment"
    );
    process.exit(1);
  }

  // Derive a safe log string without credentials
  const safeUri = (() => {
    try {
      const match = uri.match(/^mongodb\+srv:\/\/(.*)@([^/?]+)(.*)$/);
      return match
        ? `mongodb+srv://<user>:<secret>@${match[2]}${match[3]}`
        : "mongodb+srv://<redacted>";
    } catch {
      return "mongodb+srv://<redacted>";
    }
  })();

  try {
    await mongoose.connect(uri, {
      // Allow slower DNS/cluster spin-up
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      tls: true,
    });
    const { host, name } = mongoose.connection;
    console.log('MongoDB connected successfully');
  } catch (error) {
    const message = error?.message || String(error);
    console.error("MongoDB connection failed:", message);
    // Targeted hints for common issues
    if (
      message.includes("getaddrinfo ENOTFOUND") ||
      message.includes("ENOTFOUND")
    ) {
      console.error(
        "Hint: DNS could not resolve your cluster host. Verify the SRV host in your MONGO_URI and try adding your DNS/Network allows. On some Windows setups, temporarily switching networks or forcing IPv4 can help."
      );
    } else if (
      message.includes("ETIMEDOUT") ||
      message.includes("server selection timed out")
    ) {
      console.error(
        "Hint: Network timeout reaching Atlas. Ensure outbound access on ports 27017-27019 is allowed and that your Atlas cluster is in 'Available' state."
      );
    } else if (
      message.toLowerCase().includes("authentication") ||
      message.toLowerCase().includes("auth")
    ) {
      console.error(
        "Hint: Authentication failed. Confirm your username/password and that special characters are URL-encoded (e.g., @ -> %40). Also verify the user has access to the 'everygist' database."
      );
    }
    console.error(`MONGO_URI (sanitized): ${safeUri}`);
    process.exit(1);
  }
};

module.exports = connectDB;
