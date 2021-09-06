module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-aws-route53-dns-validation-record-txt",
  Route53Domains: {
    Domain: {
      grucloudOrg: {
        name: "grucloud.org",
      },
    },
  },
  Route53: {
    HostedZone: {
      grucloudOrg: {
        name: "grucloud.org.",
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
