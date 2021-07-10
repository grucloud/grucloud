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
    () => resource,
    switchCase([
      //not(get("isDefault")),
      () => true,
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
            propertyList,
          }),
        }),
      ]),
      () => undefined,
    ]),
  ])();

exports.writeVpcs = writeResources({
  group: "ec2",
  type: "Vpc",
  writeResource: writeVpc,
});
