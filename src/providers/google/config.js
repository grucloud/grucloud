require("dotenv").config();

module.exports = {
  project: "starhackit",
  region: "us-central1",
  zone: "us-central1-a",
  applicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
};
