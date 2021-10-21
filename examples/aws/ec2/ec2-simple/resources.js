const createResources = ({ provider }) => {
  provider.EC2.makeInstance({
    name: "web-server-ec2-simple",
    properties: ({ config }) => ({
      InstanceType: "t2.micro",
      ImageId: "ami-093d2024466a862c1",
    }),
  });
};

exports.createResources = createResources;
