const assert = require("assert");
const { pipe, map, tap, get, assign } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const { AppConfigApplication } = require("./AppConfigApplication");
const { AppConfigDeployment } = require("./AppConfigDeployment");
const {
  AppConfigDeploymentStrategy,
} = require("./AppConfigDeploymentStrategy");
const {
  AppConfigConfigurationProfile,
} = require("./AppConfigConfigurationProfile");
const { AppConfigEnvironment } = require("./AppConfigEnvironment");
const { AppConfigExtension } = require("./AppConfigExtension");
const {
  AppConfigExtensionAssociation,
} = require("./AppConfigExtensionAssociation");

const {
  AppConfigHostedConfigurationVersion,
} = require("./AppConfigHostedConfigurationVersion");

const compareAppConfig = compareAws({});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html

module.exports = pipe([
  () => [
    AppConfigApplication(),
    AppConfigConfigurationProfile(),
    AppConfigDeployment(),
    AppConfigDeploymentStrategy(),
    AppConfigEnvironment(),
    AppConfigExtension({}),
    AppConfigExtensionAssociation({}),
    AppConfigHostedConfigurationVersion({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: "AppConfig",
        compare: compareAppConfig(),
      }),
    ])
  ),
]);
