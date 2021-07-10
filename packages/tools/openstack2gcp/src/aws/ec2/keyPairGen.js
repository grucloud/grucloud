const assert = require("assert");
const { pipe, tap, get, eq, fork, switchCase, not } = require("rubico");

const {
  writeResources,
  ResourceVarName,
  configTpl,
  codeTpl,
  buildPropertyList,
} = require("../../../generatorUtils");

const writeKeyPair = ({ resource, lives }) =>
  pipe([
    fork({
      resourceVarName: () => ResourceVarName(resource.name),
      propertyList: () => buildPropertyList({ resource, pickProperties: [] }),
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
        type: "KeyPair",
        createPrefix: "use",
        resource,
        resourceVarName,
        propertyList,
      }),
    }),
  ])();

exports.writeKeyPairs = writeResources({
  type: "KeyPair",
  writeResource: writeKeyPair,
});
