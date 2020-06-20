const { MockServer } = require("./MockServer");
const logger = require("./logger")({ prefix: "MockServer" });

const routes = ["/volume", "/ip", "/security_group", "/server"];
const port = 8089;
const mockServer = MockServer({ port, routes });
mockServer
  .start()
  .then(() => {
    logger.info(`Mock server started on port ${port}`);
  })
  .catch((error) => {
    console.log(error);
  });
