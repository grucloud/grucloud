const path = require("path");
module.exports = ({ stage }) => ({
  credentialFile: path.resolve(__dirname, "grucloud-test.json"),
});
