const assert = require("assert");
const { pipe, tap, get, map, switchCase, not, pick } = require("rubico");
const { size } = require("rubico/x");

const {
  writeResources,
  ResourceVarName,
  configTpl,
} = require("../../../generatorUtils");

const pickProperties = ["CidrBlock", "DnsSupport", "DnsHostnames"];

const vpcCodeTpl = ({
  resourceVarName,
  resource: { name, namespace, live },
}) => `
const ${resourceVarName} = provider.ec2.makeVpc({
  name: config.${resourceVarName}.name,${
  namespace ? `\nnamespace: ${namespace}` : ""
}
  properties: () => config.${resourceVarName}.properties,
});
`;

// Vpc
const writeVpc = ({ resource, lives }) =>
  pipe([
    tap(() => {
      console.log(`writeVpc`, resource, size(lives));
    }),
    () => resource,
    switchCase([
      not(get("isDefault")),
      pipe([
        () => ResourceVarName(resource.name),
        (resourceVarName) => ({
          resourceVarName,
          config: configTpl({
            resourceVarName,
            resource,
            pickProperties,
          }),
          code: vpcCodeTpl({
            resourceVarName,
            resource,
          }),
        }),
      ]),
      () => undefined,
    ]),
    tap((xxx) => {
      assert(true);
    }),
  ])();

exports.writeVpcs = writeResources({
  group: "ec2",
  type: "Vpc",
  writeResource: writeVpc,
});
