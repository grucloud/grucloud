const assert = require("assert");
const { retryCall } = require("@grucloud/core").Retry;

module.exports = ({ provider }) => {
  const { config } = provider;
  assert(config.certificate);
  const { rootDomainName } = config.certificate;
  assert(rootDomainName);
  const resources = provider.resources();
  const certificate =
    resources.ACM.Certificate.exampleModuleAwsCertificateGrucloudOrg;
  assert(certificate);

  return {
    onDeployed: {
      init: async () => {
        return {};
      },
      actions: [
        {
          name: `ssl certificate ready`,
          command: async () => {
            await retryCall({
              name: `getting certificate status`,
              fn: () => certificate.getLive(),
              isExpectedResult: (sslCertificateLive) => {
                return sslCertificateLive.Status == "ISSUED";
              },
              config: { retryCount: 500, retryDelay: 5e3 },
            });
          },
        },
      ],
    },
  };
};
