const assert = require("assert");
const { pipe, map } = require("rubico");

const { defaultsDeep } = require("rubico/x");

const AzTag = require("./AzTag");
const { compare } = require("./AzureCommon");

const ResourceManagementSpec = require("./resources/ResourceManagementSpec");
const VirtualNetworkSpec = require("./resources/VirtualNetworksSpec");
const ComputeSpec = require("./resources/ComputeSpec");

exports.fnSpecs = (config) => {
  const isOurMinion = AzTag.isOurMinion;

  return pipe([
    () => [
      ...ResourceManagementSpec.fnSpecs({ config }),
      ...VirtualNetworkSpec.fnSpecs({ config }),
      ...ComputeSpec.fnSpecs({ config }),
    ],
    map(defaultsDeep({ isOurMinion, compare })),
  ])();
};
