const assert = require("assert");
const { pipe, tap, get, eq, fork, switchCase, not } = require("rubico");

const {
  writeResources,
  ResourceVarName,
  findDependencyNames,
  configTpl,
  codeTpl,
  buildPropertyList,
} = require("../../../generatorUtils");

const pickProperties = ["CidrBlock", "AvailabilityZone", "MapPublicIpOnLaunch"];

const writeSubnet = ({ resource, lives }) =>
  pipe([
    () => resource,
    switchCase([
      not(get("isDefault")),
      pipe([
        tap(() => {}),
        fork({
          resourceVarName: () => ResourceVarName(resource.name),
          propertyList: () => buildPropertyList({ resource, pickProperties }),
        }),
        ({ resourceVarName, propertyList }) => ({
          resourceVarName,
          config: configTpl({
            resourceVarName,
            resource,
            propertyList,
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
