const CoreClient = require("../CoreClient");

const BASE_URL = "https://compute.googleapis.com/compute/v1/";

//TODO join url

module.exports = GoogleClient = ({ url, config, onResponse }) =>
  CoreClient({
    type: "google",
    onResponse,
    onHeaders: () => ({ "X-Auth-Token": process.env.TODO }),
    baseURL: `${BASE_URL}/${url}`,
  });
