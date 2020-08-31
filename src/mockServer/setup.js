const { MockServer } = require("./MockServer");
const logger = require("../logger")({ prefix: "MockServer" });
const config = require("./config")();

const mockServer = MockServer(config);

before(async function () {
  await mockServer.start();
});
after(async function () {
  await mockServer.stop();
});
