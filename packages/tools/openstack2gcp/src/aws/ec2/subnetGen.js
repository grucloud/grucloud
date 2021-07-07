const assert = require("assert");
const { pipe, tap, get, eq, map, switchCase, not } = require("rubico");

const {
  writeResources,
  ResourceVarName,
  findDependencyNames,
  configTpl,
  codeTpl,
} = require("../../../generatorUtils");

const pickProperties = ["CidrBlock", "AvailabilityZone", "MapPublicIpOnLaunch"];

const writeSubnet = ({ resource, lives }) =>
  pipe([
    () => resource,
    switchCase([
      not(get("isDefault")),
      pipe([
        tap(() => {}),
        () => ResourceVarName(resource.name),
        (resourceVarName) => ({
          resourceVarName,
          config: configTpl({
            resourceVarName,
            resource,
            pickProperties,
          }),
          code: codeTpl({
            group: "ec2",
            type: "Subnet",
            resource,
            resourceVarName,
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
