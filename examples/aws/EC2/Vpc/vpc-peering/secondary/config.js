const pkg = require("../package.json");

// https://www.npmjs.com/package/@aws-sdk/credential-providers#fromini
module.exports = () => ({
  projectName: pkg.name,
  credentials: { profile: "regionB" },
  regionPrimary: "us-east-1",
  noGlobalEndpoint: true, // No IAM
  includeGroups: ["EC2"],
});
