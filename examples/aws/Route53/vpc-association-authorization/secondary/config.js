const pkg = require("../package.json");

// https://www.npmjs.com/package/@aws-sdk/credential-providers#fromini
module.exports = () => ({
  projectName: pkg.name,
  credentials: { profile: "account_secondary" },
  includeGroups: ["EC2", "Route53", "Route53Domains"],
});
