const createResources = ({ provider }) => {
  provider.EC2.makeInstance({
    name: "web-server-ec2-example",
    properties: () => ({
      InstanceType: "t3.micro",
      ImageId: "ami-02e136e904f3da870",
    }),
    dependencies: ({ resources }) => ({
      keyPair: resources.EC2.KeyPair["kp-ec2-example"],
      eip: resources.EC2.ElasticIpAddress["eip"],
    }),
  });
};

exports.createResources = createResources;
