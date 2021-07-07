const assert = require("assert");
const { pipe, tap, get, map, switchCase, not, fork } = require("rubico");
const { size } = require("rubico/x");

const {
  writeResources,
  ResourceVarName,
  configTpl,
  codeTpl,
  buildPropertyList,
} = require("../../../generatorUtils");

const pickProperties = ["CidrBlock", "DnsSupport", "DnsHostnames"];

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
            type: "Vpc",
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
