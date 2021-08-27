module.exports = ({ stage }) => ({
  projectName: "ec2-simple",
  ec2: {
    Instance: {
      webServerEc2Simple: {
        name: "web-server-ec2-simple",
        properties: {
          InstanceType: "t2.micro",
          ImageId: "ami-093d2024466a862c1",
        },
      },
    },
  },
});
