const assert = require("assert");

module.exports = ({
  resources: { certificaterequestsCertManagerIoCustomResourceDefinition },
  provider,
}) => {
  assert(provider);
  return {
    onDeployed: {
      init: async () => {
        const certRequestCrd = await certificaterequestsCertManagerIoCustomResourceDefinition.getLive();
        return {};
      },
      actions: [
        {
          name: "CertificateRequest",
          command: async ({ host }) => {},
        },
      ],
    },
    onDestroyed: {
      init: () => {
        //console.log("ec2 onDestroyed");
      },
    },
  };
};
