const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectName: pkg.name,
  keyPair: { name: `kp-ec2-example` },
  eip: { name: "eip" },
  ec2Instance: {
    name: "web-server-ec2-example",
    properties: () => ({
      InstanceType: "t2.micro",
    }),
  },
});
