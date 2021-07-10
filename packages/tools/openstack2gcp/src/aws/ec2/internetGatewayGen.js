const { pipe, tap, get, eq, map, switchCase, fork, any } = require("rubico");
const { identity } = require("rubico/x");

const {
  writeResources,
  ResourceVarName,
  configTpl,
  codeTpl,
  buildPropertyList,
  findDependencyNames,
} = require("../../../generatorUtils");

const pickProperties = [];

const writeInternetGateway = ({ resource, lives }) =>
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
            type: "InternetGateway",
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

exports.writeInternetGateways = writeResources({
  type: "InternetGateway",
  writeResource: writeInternetGateway,
});
