const assert = require("assert");
const { pipe, map, tap } = require("rubico");

const { defaultsDeep } = require("rubico/x");

const AzTag = require("./AzTag");
const { compare } = require("./AzureCommon");

const ResourceManagementSpec = require("./resources/ResourceManagementSpec");
const VirtualNetworkSpec = require("./resources/VirtualNetworksSpec");
const ComputeSpec = require("./resources/ComputeSpec");
const LogAnalyticsSpec = require("./resources/LogAnalyticsSpec");
const AppServiceSpec = require("./resources/AppServiceSpec");

exports.fnSpecs = (config) => {
  const isOurMinion = AzTag.isOurMinion;

  //TODO refactor with callProp and flatten
  return pipe([
    () => [
      ...ResourceManagementSpec.fnSpecs({ config }),
      ...VirtualNetworkSpec.fnSpecs({ config }),
      ...ComputeSpec.fnSpecs({ config }),
      ...LogAnalyticsSpec.fnSpecs({ config }),
      ...AppServiceSpec.fnSpecs({ config }),
    ],
    map(defaultsDeep({ isOurMinion, compare: compare() })),
    tap((params) => {
      assert(true);
    }),
  ])();
};
