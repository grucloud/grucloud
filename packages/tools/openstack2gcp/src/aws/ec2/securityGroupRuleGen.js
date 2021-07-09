const assert = require("assert");
const { pipe, tap, get, eq, map, switchCase, fork, any } = require("rubico");

const {
  writeResources,
  ResourceVarName,
  configTpl,
  codeTpl,
  buildPropertyList,
  findDependencyNames,
} = require("../../../generatorUtils");

const pickProperties = ["IpPermissions"];

const writeSecurityGroupRule =
  ({ type }) =>
  ({ resource, lives }) =>
    pipe([
      () => resource,
      tap((params) => {
        assert(true);
      }),
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
              type,
              resource,
              resourceVarName,
              propertyList,
              dependencies: {
                securityGroup: findDependencyNames({
                  type: "SecurityGroup",
                  resource,
                  lives,
                }),
              },
            }),
          }),
        ]),
      ]),
    ])();

exports.writeSecurityGroupRule = ({ type }) =>
  writeResources({
    type,
    writeResource: writeSecurityGroupRule({ type }),
  });
