require("dotenv").config();

const config = {
  project: "starhackit",
  region: "us-central1",
  zone: "us-central1-a",
  applicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
};

module.exports = config;
