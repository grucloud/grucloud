const { MockServer } = require("../MockServer");
const port = 5645;

describe("MockServer", function () {
  const routes = ["/compute/", "/address/"];
  const mockServer = MockServer({ port, routes });

  before(async function () {
    await mockServer.stop();
    await mockServer.start();
  });

  after(async function () {
    await mockServer.stop();
  });
});
