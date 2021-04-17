const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectName: pkg.name,
  keyPair: { name: "kp" },
  eip: { name: "eip" },
  ec2Instance: {
    name: "web-server",
    properties: () => ({
      InstanceType: "t2.micro",
    }),
  },
});
