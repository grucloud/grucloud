const path = require("path");

module.exports = () => ({
  projectId: "grucloud-test",
  hostedZoneName: "grucloud.org",
  bucketName: "gcp-demo-static-website.grucloud.org",
  websiteDir: path.resolve(__dirname, "./websites/simple"),
});
