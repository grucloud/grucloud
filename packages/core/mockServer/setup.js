const Axios = require("axios");
const { MockServer } = require("./MockServer");
const config = require("./config")();

const mockServer = MockServer(config);

before(async function () {
  await mockServer.start();

  const axios = Axios.create({ baseURL: `http://localhost:${config.port}` });
  await axios.post("/ip", { name: "toto" });
});
after(async function () {
  await mockServer.stop();
});
