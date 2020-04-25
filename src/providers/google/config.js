require("dotenv").config();

module.exports = {
  project: "starhackit",
  region: "us-central1",
  zone: "us-central1-a",
  serviceAccountKey: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
};
