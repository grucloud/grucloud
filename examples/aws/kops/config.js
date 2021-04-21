const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectName: pkg.name,
  kops: {
    groupName: "kops",
    userName: "kops",
    domainName: "grucloud.org",
    subDomainName: "kops.example.grucloud.org",
    s3BucketName: "kops-grucloud-test-example",
  },
});
