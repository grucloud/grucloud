const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectName: pkg.name,
  ec2Instance: {
    name: "web-server-ec2-simple",
    properties: {
      InstanceType: "t2.micro",
      ImageId: "ami-093d2024466a862c1", // Amazon Linux 2
    },
  },
});
