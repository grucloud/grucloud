const assert = require("assert");

const { pipe, tap, get, fork, map, switchCase, not } = require("rubico");

const {
  writeResources,
  ResourceVarName,
  findDependencyNames,
  configTpl,
  codeTpl,
  buildPropertyList,
} = require("../../../generatorUtils");

const pickProperties = ["RoleName", "Path", "AssumeRolePolicyDocument"];

const writeIamRole = ({ resource, lives }) =>
  pipe([
    fork({
      resourceVarName: () => ResourceVarName(resource.name),
      propertyList: () => buildPropertyList({ resource, pickProperties }),
      dependencies: () => ({
        policies: findDependencyNames({
          group: "iam",
          type: "Policy",
          resource,
          lives,
        }),
      }),
    }),
    tap((params) => {
      assert(true);
    }),
    ({ resourceVarName, propertyList, dependencies }) => ({
      resourceVarName,
      config: configTpl({
        resourceVarName,
        resource,
        propertyList,
      }),
      code: codeTpl({
        group: "iam",
        type: "Role",
        resource,
        resourceVarName,
        propertyList,
        dependencies,
      }),
    }),
  ])();

exports.writeIamRoles = writeResources({
  type: "Role",
  writeResource: writeIamRole,
});
