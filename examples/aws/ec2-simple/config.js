const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectName: pkg.name,
  ec2Instance: {
    name: "web-server",
    properties: {
      InstanceType: "t2.micro",
      ImageId: "ami-00f6a0c18edb19300", // Ubuntu 18.04
      //ImageId: "ami-093d2024466a862c1", // Amazon Linux 2
    },
  },
});
