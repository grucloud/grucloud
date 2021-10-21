const createResources = ({ provider }) => {
  provider.EC2.makeKeyPair({
    name: "kp-ec2-example",
  });

  provider.EC2.makeElasticIpAddress({
    name: "eip",
  });

  provider.EC2.makeInstance({
    name: "web-server-ec2-example",
    properties: ({ config }) => ({
      InstanceType: "t2.micro",
      ImageId: "ami-056bfe7d8a7bdb9d0",
    }),
    dependencies: ({ resources }) => ({
      keyPair: resources.EC2.KeyPair.kpEc2Example,
      eip: resources.EC2.ElasticIpAddress.eip,
    }),
  });
};

exports.createResources = createResources;
