const assert = require("assert");
const { pipe, tap, get, fork, map, switchCase, not } = require("rubico");
const { pluck, includes } = require("rubico/x");

const {
  writeResources,
  ResourceVarName,
  findDependencyNames,
  configTpl,
  codeTpl,
  buildPropertyList,
} = require("../../../generatorUtils");

const pickProperties = ["Name"];

const writeHostedZone = ({ resource, lives }) =>
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
        type: "HostedZone",
        resource,
        resourceVarName,
        propertyList,
      }),
    }),
  ])();

exports.writeHostedZones = writeResources({
  type: "HostedZone",
  writeResource: writeHostedZone,
});
