module.exports = ({ stage }) => ({
  projectName: "kms-symmetric",
  kms: {
    Key: {
      eksKey: {
        name: "eks-key",
      },
      secretKeyTest: {
        name: "secret-key-test",
      },
    },
  },
});
