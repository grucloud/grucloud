const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectName: pkg.name,
  kops: {
    domainName: "grucloud.org",
    subDomainName: "kops.example.grucloud.org",
    groupName: "kops",
    userName: "kops",
  },
});
