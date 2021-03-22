const Axios = require("axios");
const MockAdapter = require("axios-mock-adapter");

const createAxios = () => {
  const axios = Axios.create({ baseURL: "http://mock:1234" });
  const mock = new MockAdapter(axios);
  mock.onGet("").networkError();
  return axios;
};
module.exports = () => ({
  createAxios,
});
