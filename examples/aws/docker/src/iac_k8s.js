const assert = require("assert");
const { K8sProvider } = require("@grucloud/provider-k8s");

exports.createStack = async ({ config }) => {
  return {
    stacks: [{ provider: K8sProvider({ config }) }],
  };
};
