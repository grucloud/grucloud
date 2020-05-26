require("dotenv").config();

const config = {
  google: {
    project: "starhackit",
    region: "europe-west4",
    zone: "europe-west4-a",
    applicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  },
  aws: {
    region: "eu-west-2",
  },
};

module.exports = config;
