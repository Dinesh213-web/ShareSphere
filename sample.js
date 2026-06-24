const mongoose = require("mongoose");
const dns = require("dns");
require("dotenv").config({ quiet: true });

const { DNS_SERVERS, MONGO_URI } = process.env;

if (DNS_SERVERS) {
  dns.setServers(DNS_SERVERS.split(",").map((server) => server.trim()));
} else if (dns.getServers().every((server) => server.startsWith("127."))) {
  dns.setServers(["8.8.8.8", "4.2.2.2"]);
}

async function main() {
  if (!MONGO_URI) {
    throw new Error("Missing MONGO_URI in .env");
  }

  await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log("MongoDB connected");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("MongoDB connection failed:", err.message);
  process.exitCode = 1;
});
