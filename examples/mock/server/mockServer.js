const { MockServer } = require("@grucloud/core");

const routes = ["/volume", "/ip", "/security_group", "/server"];
const port = 8089;
const mockServer = MockServer({ port, routes });
mockServer
  .start()
  .then(() => {
    console.log(`Mock server started on port ${port}`);
  })
  .catch((error) => {
    console.log(error);
  });
