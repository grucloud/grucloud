const createResources = ({ provider }) => {
  provider.AutoScaling.makeAutoScalingGroup({
    name: "asg",
    properties: () => ({
      MinSize: 1,
      MaxSize: 2,
      DesiredCapacity: 1,
    }),
    dependencies: ({ resources }) => ({
      subnets: [
        resources.EC2.Subnet["PubSubnetAz1"],
        resources.EC2.Subnet["PubSubnetAz2"],
      ],
      launchTemplate: resources.EC2.LaunchTemplate["lt-ec2-micro"],
    }),
  });
};

exports.createResources = createResources;
