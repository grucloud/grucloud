const assert = require("assert");
const { pipe, tap, get, eq, map, switchCase, not } = require("rubico");
const { find, pluck, size } = require("rubico/x");

const {
  writeResources,
  ResourceVarName,
  findDependencyNames,
  configTpl,
} = require("../../../generatorUtils");

const pickProperties = ["CidrBlock", "AvailabilityZone", "MapPublicIpOnLaunch"];

const subnetCodeTpl = ({
  resourceVarName,
  dependencies: { vpc },
  resource: { name, live, namespace },
}) => `const ${resourceVarName} = provider.ec2.makeSubnet({
  name: config.${resourceVarName}.name,${
  namespace ? `\nnamespace: ${namespace}` : ""
}
  dependencies: { vpc: ${vpc} },
  attributes: () => config.${resourceVarName}.attributes,
  properties: () => config.${resourceVarName}.properties,
});
`;

const ResourceVarNameSubnet = (resource) => `${ResourceVarName(resource.name)}`;

const ResourceNameSubnet = (resource) =>
  ResourceVarNameSubnet(resource).replace(/_/g, "-");

const writeSubnet = ({ resource, lives }) =>
  pipe([
    () => resource,
    switchCase([
      not(get("isDefault")),
      pipe([
        tap(() => {}),
        () => ResourceVarNameSubnet(resource),
        (resourceVarName) => ({
          resourceVarName,
          config: configTpl({
            resourceVarName,
            resource,
            pickProperties,
          }),
          code: subnetCodeTpl({
            resource,
            resourceVarName,
            resourceName: ResourceNameSubnet(resource),
            dependencies: {
              vpc: findDependencyNames({
                type: "Vpc",
                resource,
                lives,
              }),
            },
          }),
        }),
      ]),
      () => {
        //console.log("default subnet");
      },
    ]),
  ])();

exports.writeSubnets = writeResources({
  type: "Subnet",
  writeResource: writeSubnet,
});
