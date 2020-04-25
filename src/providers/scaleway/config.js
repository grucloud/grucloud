require("dotenv").config();

module.exports = {
  zone: "fr-par-1",
  organization: process.env.SCALEWAY_ORGANISATION_ID,
  secretKey: process.env.SCALEWAY_SECRET_KEY,
};
