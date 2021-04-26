const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectName: pkg.name,
  region: "eu-west-2",
  zone: () => "eu-west-2a",
  kops: {
    domainName: "grucloud.org",
    subDomainName: "kops.example.grucloud.org",
    groupName: "kops",
    userName: "kops",
  },
});
