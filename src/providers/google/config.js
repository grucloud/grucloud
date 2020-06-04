require("dotenv").config();
//TODO create new project such as grucloud-e2e
module.exports = {
  project: "starhackit",
  region: "europe-west4",
  zone: "europe-west4-a",
  applicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
};
