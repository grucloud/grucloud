const createResources = ({ provider }) => {
  provider.AutoScaling.makeAutoScalingGroup({
    name: "asg",
    properties: () => ({
      MinSize: 1,
      MaxSize: 2,
      DesiredCapacity: 1,
      DefaultCooldown: 300,
      HealthCheckType: "EC2",
      HealthCheckGracePeriod: 300,
    }),
    dependencies: ({ resources }) => ({
      subnets: [
        resources.EC2.Subnet.pubSubnetAz1,
        resources.EC2.Subnet.pubSubnetAz2,
      ],
      launchTemplate: resources.EC2.LaunchTemplate.ltEc2Micro,
    }),
  });
};

exports.createResources = createResources;
