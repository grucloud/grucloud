module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-aws-ec2",
  ec2: {
    Vpc: {
      vpcDefault: {
        name: "vpc-default",
      },
    },
    KeyPair: {
      kpEc2Example: {
        name: "kp-ec2-example",
        properties: {
          KeyPairId: "key-01649297a7b8c0e5a",
          KeyFingerprint:
            "cf:cb:84:1c:e4:7e:82:07:31:fa:dc:f0:72:55:bb:c9:f0:59:3f:71",
          KeyName: "kp-ec2-example",
        },
      },
    },
    ElasticIpAddress: {
      eip: {
        name: "eip",
      },
    },
    SecurityGroup: {
      sgDefaultVpcDefault: {
        name: "sg-default-vpc-default",
      },
    },
    Instance: {
      webServerEc2Example: {
        name: "web-server-ec2-example",
        properties: {
          InstanceType: "t2.micro",
          ImageId: "ami-084a1f89b0bb0f729",
          Placement: {
            AvailabilityZone: "eu-west-2a",
          },
        },
      },
    },
  },
});
