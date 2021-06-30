const pkg = require("./package.json");
module.exports = () => ({
  topLevelDomain: "grucloud.org",
  //subDomainName: "gcp-demo-static-website.",
  projectName: pkg.name,
  recordTxtValue:
    "google-site-verification=q_tZuuK8OFGzYbrhd_VXoqtOTtruiAmH811iULb-m30",
});
