const createResources = ({ provider }) => {
  provider.KMS.makeKey({
    name: "secret-key-test",
  });
};

exports.createResources = createResources;
