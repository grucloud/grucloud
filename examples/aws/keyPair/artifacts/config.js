module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-aws-ec2-keypair",
  ec2: {
    KeyPair: {
      kp: {
        name: "kp",
      },
    },
  },
});
