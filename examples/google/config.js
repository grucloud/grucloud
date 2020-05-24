require("dotenv").config();

const config = {
  project: "starhackit",
  region: "europe-west4",
  zone: "europe-west4-a",
  applicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
};

module.exports = config;
