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

const pickProperties = ({ resource }) =>
  pipe([
    tap(() => {
      assert(resource);
    }),
    () => resource,
    switchCase([
      get("cannotBeDeleted"),
      () => ["Arn", "name"],
      () => ["PolicyName", "PolicyDocument", "Path", "Description"],
    ]),
  ])();

const writeIamPolicy = ({ resource, lives }) =>
  pipe([
    fork({
      resourceVarName: () => ResourceVarName(resource.name),
      propertyList: () =>
        buildPropertyList({
          resource,
          pickProperties: pickProperties({ resource }),
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
        type: "Policy",
        resource,
        resourceVarName,
        propertyList,
        dependencies,
      }),
    }),
  ])();

exports.writeIamPolicies = writeResources({
  type: "Policy",
  writeResource: writeIamPolicy,
});
