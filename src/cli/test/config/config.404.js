const Axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const BASE_URL = "http://localhost:8089";

const createAxios = ({ url }) => {
  const axios = Axios.create({ baseURL: BASE_URL });
  const mock = new MockAdapter(axios);
  mock.reset();
  mock.onGet("").reply(404);
  return axios;
};
module.exports = () => ({
  createAxios,
});
