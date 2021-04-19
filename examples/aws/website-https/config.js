const pkg = require("./package.json");
const path = require("path");

module.exports = () => ({
  region: "us-east-1",
  zone: () => "us-east-1a",
  projectName: pkg.name,
  rootDomainName: "grucloud.org",
  DomainName: "cloudfront.aws.test.grucloud.org",
  websiteDir: path.resolve(__dirname, "./svelte-app/public/"),
});
