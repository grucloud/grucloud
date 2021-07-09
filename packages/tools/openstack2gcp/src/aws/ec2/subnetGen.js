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

const pickProperties = [
  "CidrBlock",
  "Ipv6CidrBlock",
  "AvailabilityZone",
  "MapPublicIpOnLaunch",
  "CustomerOwnedIpv4Pool",
  "MapCustomerOwnedIpOnLaunch",
  "MapPublicIpOnLaunch",
];

const writeSubnet = ({ resource, lives }) =>
  pipe([
    () => resource,
    tap((params) => {
      assert(true);
    }),
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
            propertyList,
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
