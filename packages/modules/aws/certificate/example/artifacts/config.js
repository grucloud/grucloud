module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-module-aws-certificate",
  ACM: {
    Certificate: {
      exampleModuleAwsCertificateGrucloudOrg: {
        name: "example-module-aws-certificate.grucloud.org",
        properties: {
          DomainName: "example-module-aws-certificate.grucloud.org",
        },
      },
    },
  },
  Route53Domains: {
    Domain: {
      grucloudOrg: {
        name: "grucloud.org",
      },
    },
  },
  Route53: {
    HostedZone: {
      exampleModuleAwsCertificateGrucloudOrg: {
        name: "example-module-aws-certificate.grucloud.org.",
      },
    },
    Record: {
      certificateValidationExampleModuleAwsCertificateGrucloudOrg: {
        name: "certificate-validation-example-module-aws-certificate.grucloud.org.",
      },
    },
  },
});
