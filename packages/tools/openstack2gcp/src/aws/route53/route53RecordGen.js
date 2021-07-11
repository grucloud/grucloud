const assert = require("assert");
const { pipe, tap, get, fork, map, switchCase, not } = require("rubico");
const { pluck, includes } = require("rubico/x");

const {
  writeResources,
  ResourceVarName,
  configTpl,
  codeTpl,
  buildPropertyList,
  findDependencyNames,
} = require("../../../generatorUtils");

const pickProperties = ["Name", "Type", "TTL", "ResourceRecords"];

const writeRecord = ({ resource, lives }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    () => resource,
    switchCase([
      not(get("cannotBeDeleted")),
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
            group: "route53",
            type: "Record",
            resource,
            resourceVarName,
            propertyList,
            dependencies: {
              hostedZone: findDependencyNames({
                type: "HostedZone",
                resource,
                lives,
              }),
            },
          }),
        }),
      ]),
      () => undefined,
    ]),
  ])();

exports.writeRecords = writeResources({
  type: "Record",
  writeResource: writeRecord,
});
