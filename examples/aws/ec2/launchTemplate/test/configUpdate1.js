module.exports = ({ stage }) => ({
  projectName: "example-grucloud-ec2-launch-template",
  EC2: {
    LaunchTemplate: {
      ltEc2Micro: {
        name: "lt-ec2-micro",
        properties: {
          LaunchTemplateData: {
            InstanceType: "t2.large",
          },
        },
      },
    },
  },
});
