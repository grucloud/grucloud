module.exports = ({ stage }) => ({
  projectName: "example-grucloud-autoscaling-group",
  AutoScaling: {
    AutoScalingGroup: {
      asg: {
        name: "asg",
        properties: {
          MinSize: 1,
          MaxSize: 2,
          DesiredCapacity: 2,
          DefaultCooldown: 300,
          HealthCheckType: "EC2",
          HealthCheckGracePeriod: 300,
        },
      },
    },
  },
});
