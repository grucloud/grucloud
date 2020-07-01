const { MockServer } = require("./MockServer");
const logger = require("./logger")({ prefix: "MockServer" });
const config = require("./config")();

const mockServer = MockServer(config);
mockServer
  .start()
  .then(() => {
    logger.info(`Mock server started on port ${config.port}`);
  })
  .catch((error) => {
    console.log(error);
  });
