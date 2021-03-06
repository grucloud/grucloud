const assert = require("assert");
const { createStack: createStackK8s } = require("../iac");
const { createStack: createStackEks } = require("../../../aws/eks/iac");

exports.createStack = async ({ config }) => {
  const eksStack = await createStackEks({ config });
  const k8sStack = await createStackK8s({
    config,
    resources: eksStack.resources,
  });

  return [eksStack, k8sStack];
};
