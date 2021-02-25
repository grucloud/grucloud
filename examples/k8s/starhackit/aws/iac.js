const assert = require("assert");
const { createStack: createStackK8s } = require("../iac");
const { createStack: createStackEks } = require("../../../aws/eks/iac");

exports.createStack = async ({ config }) => {
  const k8sStack = await createStackK8s({ config });
  const eksStack = await createStackEks({ config });

  return {
    sequencial: true,
    providers: [eksStack.provider, k8sStack.provider],
    resources: {},
  };
};
