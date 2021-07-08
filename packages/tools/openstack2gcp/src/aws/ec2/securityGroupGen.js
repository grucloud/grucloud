const { pipe, tap, get, eq, map, switchCase, fork, any } = require("rubico");
const { identity } = require("rubico/x");

const {
  writeResources,
  ResourceVarName,
  findLiveById,
  configTpl,
  codeTpl,
  buildPropertyList,
} = require("../../../generatorUtils");

const pickProperties = ["Size", "Device"];

const writeSecurityGroup = ({ resource, lives }) =>
  pipe([
    () => resource,
    switchCase([
      () => false,
      () => {},
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
            type: "SecurityGroup",
            resource,
            resourceVarName,
            propertyList,
          }),
        }),
      ]),
    ]),
  ])();

exports.writeSecurityGroups = writeResources({
  type: "SecurityGroup",
  writeResource: writeSecurityGroup,
});
