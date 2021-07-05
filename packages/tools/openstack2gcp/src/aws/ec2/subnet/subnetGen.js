const assert = require("assert");
const { pipe, tap, get, eq, map, switchCase, not } = require("rubico");
const { find, pluck, size } = require("rubico/x");

const {
  writeResources,
  findLiveById,
  ResourceVarName,
} = require("../../../../generatorUtils");
const { subnetCodeTpl } = require("./subnetCodeTpl");

const findSubnetDependencyNames = ({ type, resource, lives }) =>
  pipe([
    () => resource.dependencies,
    find(eq(get("type"), type)),
    get("ids"),
    map(findLiveById({ type, lives })),
    pluck("name"),
    map(ResourceVarName),
    tap((xxx) => {
      assert(true);
    }),
  ])();

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
          code: subnetCodeTpl({
            resource,
            resourceVarName,
            resourceName: ResourceNameSubnet(resource),
            dependencies: {
              vpc: findSubnetDependencyNames({
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
