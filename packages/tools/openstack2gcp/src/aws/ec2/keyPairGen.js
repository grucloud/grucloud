const assert = require("assert");
const { pipe, tap, get, eq, map, switchCase, not } = require("rubico");

const {
  writeResources,
  ResourceVarName,
  findDependencyNames,
  configTpl,
} = require("../../../generatorUtils");

const keyPairCodeTpl = ({
  resourceVarName,
  resource: { name, namespace },
}) => `const ${resourceVarName} = provider.ec2.useKeyPair({
  name: config.${resourceVarName}.name,${
  namespace ? `\nnamespace: ${namespace}` : ""
}
});
`;

const keyPairConfigTpl = ({
  resourceVarName,
  resource: { name, live },
}) => `${resourceVarName}: {
  name: "${name}",
},`;

const writeKeyPair = ({ resource, lives }) =>
  pipe([
    () => ResourceVarName(resource.name),
    (resourceVarName) => ({
      resourceVarName,
      config: keyPairConfigTpl({
        resourceVarName,
        resource,
      }),
      code: keyPairCodeTpl({
        resource,
        resourceVarName,
        resourceName: ResourceVarName(resource.name),
      }),
    }),
  ])();

exports.writeKeyPairs = writeResources({
  type: "KeyPair",
  writeResource: writeKeyPair,
});
