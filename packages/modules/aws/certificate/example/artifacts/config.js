module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-module-aws-certificate",
  acm: {
    Certificate: {
      exampleModuleAwsCertificateGrucloudOrg: {
        name: "example-module-aws-certificate.grucloud.org",
        properties: {
          DomainName: "example-module-aws-certificate.grucloud.org",
          SubjectAlternativeNames: [
            "example-module-aws-certificate.grucloud.org",
          ],
        },
      },
    },
  },
  route53Domain: {
    Domain: {
      grucloudOrg: {
        name: "grucloud.org",
      },
    },
  },
  route53: {
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
