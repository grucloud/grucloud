const assert = require("assert");
const { pipe, tap, get, eq, map, switchCase, not } = require("rubico");
const { find, pluck, size } = require("rubico/x");

const {
  writeResources,
  ResourceVarName,
  findDependencyNames,
} = require("../../../../generatorUtils");
const { subnetCodeTpl } = require("./subnetCodeTpl");
const { subnetConfigTpl } = require("./subnetConfigTpl");

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
          config: subnetConfigTpl({
            resourceVarName,
            resource,
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
