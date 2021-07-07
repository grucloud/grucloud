const assert = require("assert");
const { pipe, tap, get, map, switchCase, not, pick } = require("rubico");
const { size } = require("rubico/x");

const {
  writeResources,
  ResourceVarName,
  configTpl,
  codeTpl,
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
