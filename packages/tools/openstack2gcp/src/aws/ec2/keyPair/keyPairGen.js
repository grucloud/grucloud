const assert = require("assert");
const { pipe, tap, get, eq, map, switchCase, not } = require("rubico");
const { find, pluck, size, includes } = require("rubico/x");

const {
  writeResources,
  ResourceVarName,
  findDependencyNames,
} = require("../../../../generatorUtils");
const { keyPairCodeTpl } = require("./keyPairCodeTpl");
const { keyPairConfigTpl } = require("./keyPairConfigTpl");

const writeKeyPair = ({ resource, lives }) =>
  pipe([
    () => ResourceVarName(resource.name),
    (resourceVarName) => ({
      resourceVarName,
      config: keyPairConfigTpl({
        resourceVarName,
        resource,
      }),
      code: keyPairCodeTpl({
        resource,
        resourceVarName,
        resourceName: ResourceVarName(resource.name),
      }),
    }),
  ])();

exports.writeKeyPairs = writeResources({
  type: "KeyPair",
  writeResource: writeKeyPair,
});
