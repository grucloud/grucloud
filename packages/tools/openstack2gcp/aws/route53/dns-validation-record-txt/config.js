const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectName: pkg.name,
  route53: {
    HostedZone: {
      grucloudOrg: {
        name: "grucloud.org.",
        properties: {
          Name: "grucloud.org.",
        },
      },
    },
    Record: {
      txtGrucloudOrg: {
        name: "txt.grucloud.org.",
        properties: {
          Name: "grucloud.org.",
          Type: "TXT",
          TTL: 60,
          ResourceRecords: [
            {
              Value:
                '"google-site-verification=q_tZuuK8OFGzYbrhd_VXoqtOTtruiAmH811iULb-m30"',
            },
          ],
        },
      },
    },
  },
});
