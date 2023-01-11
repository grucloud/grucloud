const assert = require("assert");
const { pipe, map, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");
const {
  AppRunnerAutoScalingConfiguration,
} = require("./AppRunnerAutoScalingConfiguration");

const { AppRunnerConnection } = require("./AppRunnerConnection");
const { AppRunnerCustomDomain } = require("./AppRunnerCustomDomain");

const {
  AppRunnerObservabilityConfiguration,
} = require("./AppRunnerObservabilityConfiguration");
const { AppRunnerService } = require("./AppRunnerService");
const { AppRunnerVpcConnector } = require("./AppRunnerVpcConnector");
const {
  AppRunnerVpcIngressConnection,
} = require("./AppRunnerVpcIngressConnection");

const GROUP = "AppRunner";

const compare = compareAws({});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html

module.exports = pipe([
  () => [
    AppRunnerAutoScalingConfiguration({}),
    AppRunnerCustomDomain({}),
    AppRunnerConnection({}),
    AppRunnerObservabilityConfiguration({}),
    AppRunnerService({}),
    AppRunnerVpcConnector({}),
    AppRunnerVpcIngressConnection({}),
  ],
  map(
    pipe([createAwsService, defaultsDeep({ group: GROUP, compare: compare() })])
  ),
]);
