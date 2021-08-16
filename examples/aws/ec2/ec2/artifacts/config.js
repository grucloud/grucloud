module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-aws-ec2",
  ec2: {
    KeyPair: {
      kpEc2Example: {
        name: "kp-ec2-example",
      },
    },
    ElasticIpAddress: {
      eip: {
        name: "eip",
      },
    },
    Instance: {
      webServerEc2Example: {
        name: "web-server-ec2-example",
        properties: {
          InstanceType: "t2.micro",
          ImageId: "ami-084a1f89b0bb0f729",
        },
      },
    },
  },
});
