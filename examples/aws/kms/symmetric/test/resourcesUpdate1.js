const createResources = ({ provider }) => {
  provider.KMS.makeKey({
    name: "secret-key-test",
    properties: () => ({ Enabled: false }),
  });
};

exports.createResources = createResources;
