const assert = require("assert");
const {
  pipe,
  tap,
  get,
  eq,
  map,
  fork,
  switchCase,
  filter,
  and,
  tryCatch,
  not,
  assign,
} = require("rubico");
const { size } = require("rubico/x");

const {
  writeResources,
  ResourceVarName,
} = require("../../../../generatorUtils");
const { vpcCodeTpl } = require("./vpcCodeTpl");
const { vpcConfigTpl } = require("./vpcConfigTpl");

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
          config: vpcConfigTpl({
            resourceVarName,
            resource,
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
