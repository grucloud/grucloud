const Axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const { BASE_URL } = require("./config.common");

const createAxios = ({ url }) => {
  const axios = Axios.create({ baseURL: BASE_URL });
  const mock = new MockAdapter(axios);
  mock.onGet("").reply(404);
  return axios;
};

module.exports = () => ({
  createAxios,
});
