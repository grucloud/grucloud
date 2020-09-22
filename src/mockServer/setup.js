const { MockServer } = require("./MockServer");
const logger = require("../logger")({ prefix: "MockServer" });
const config = require("./config")();
const Axios = require("axios");

const mockServer = MockServer(config);

before(async function () {
  await mockServer.start();

  const axios = Axios.create({ baseURL: `http://localhost:${config.port}` });
  await axios.post("/ip", { name: "toto" });
});
after(async function () {
  await mockServer.stop();
});
