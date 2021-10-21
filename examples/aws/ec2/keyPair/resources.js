const createResources = ({ provider }) => {
  provider.EC2.makeKeyPair({
    name: "kp",
  });
};

exports.createResources = createResources;
