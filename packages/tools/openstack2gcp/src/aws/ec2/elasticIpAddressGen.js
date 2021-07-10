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

const pickProperties = [""];

const writeElasticIpAddress = ({ resource, lives }) =>
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
            type: "ElasticIpAddress",
            resource,
            resourceVarName,
            propertyList,
          }),
        }),
      ]),
      () => {
        //console.log("default elasticIpAddress");
      },
    ]),
  ])();

exports.writeElasticIpAddresses = writeResources({
  type: "ElasticIpAddress",
  writeResource: writeElasticIpAddress,
});
