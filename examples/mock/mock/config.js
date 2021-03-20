const Axios = require("axios");
const assert = require("assert");
const urljoin = require("url-join");

const BASE_URL = "http://localhost:8089";

const createAxios = ({ url }) => {
  assert(url);
  return Axios.create({
    baseURL: urljoin(BASE_URL, url),
    headers: { "Content-Type": "application/json" },
  });
};

module.exports = ({ stage }) => ({ createAxios });
