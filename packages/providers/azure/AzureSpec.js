const assert = require("assert");
const { pipe, map, tap, flatMap } = require("rubico");

const { defaultsDeep, callProp } = require("rubico/x");

const AzTag = require("./AzTag");
const { compare } = require("./AzureCommon");

const ResourceManagementSpec = require("./resources/ResourceManagementSpec");
const VirtualNetworkSpec = require("./resources/VirtualNetworksSpec");
const ComputeSpec = require("./resources/ComputeSpec");
const LogAnalyticsSpec = require("./resources/LogAnalyticsSpec");
const AppServiceSpec = require("./resources/AppServiceSpec");

exports.fnSpecs = (config) =>
  pipe([
    () => [
      ResourceManagementSpec,
      VirtualNetworkSpec,
      ComputeSpec,
      LogAnalyticsSpec,
      AppServiceSpec,
    ],
    flatMap(callProp("fnSpecs", { config })),
    map(defaultsDeep({ isOurMinion: AzTag.isOurMinion, compare: compare() })),
  ])();
