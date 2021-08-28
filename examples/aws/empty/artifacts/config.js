module.exports = ({ stage }) => ({
  projectName: "example-grucloud-infra-aws",
  ecr: {
    Registry: {
      default: {
        name: "default",
      },
    },
  },
});
