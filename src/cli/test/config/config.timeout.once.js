const Axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const urljoin = require("url-join");

//TODO put ut config.common.js
const BASE_URL = "http://localhost:8089";

const createAxios = ({ url }) => {
  const axios = Axios.create({ baseURL: urljoin(BASE_URL, url) });
  const mock = new MockAdapter(axios, { onNoMatch: "passthrough" });
  mock
    .onGet(/.*/)
    .timeoutOnce()
    .onPost(/.*/)
    .timeoutOnce()
    .onDelete(/.*/)
    .timeoutOnce();
  return axios;
};

module.exports = {
  createAxios,
};
