const pkg = require("./package.json");
const path = require("path");

module.exports = () => ({
  includeGroups: ["ACM", "CloudFront", "Route53", "Route53Domains", "S3"],
  region: "us-east-1",
  zone: () => "us-east-1a",
  projectName: pkg.name,
  rootDomainName: "grucloud.org",
  DomainName: "cloudfront.aws.test.grucloud.org",
  websiteDir: path.resolve(__dirname, "./svelte-app/public/"),
});
