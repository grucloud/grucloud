const { pipe, tap, get, eq, map, switchCase, fork, any } = require("rubico");

const {
  writeResources,
  ResourceVarName,
  configTpl,
  codeTpl,
  buildPropertyList,
  findDependencyNames,
} = require("../../../generatorUtils");

const pickProperties = ["Description"];

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
    ]),
  ])();

exports.writeSecurityGroups = writeResources({
  type: "SecurityGroup",
  writeResource: writeSecurityGroup,
});
