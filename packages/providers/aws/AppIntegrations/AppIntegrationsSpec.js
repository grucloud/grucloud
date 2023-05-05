const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppIntegrations.html

const {
  AppIntegrationsEventIntegration,
} = require("./AppIntegrationsEventIntegration");

const {
  AppIntegrationsDataIntegration,
} = require("./AppIntegrationsDataIntegration");

const GROUP = "AppIntegrations";

const tagsKey = "tags";
const compare = compareAws({ tagsKey, key: "key" });

module.exports = pipe([
  () => [
    AppIntegrationsEventIntegration({ compare }),
    AppIntegrationsDataIntegration({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        tagsKey,
        compare: compare({}),
      }),
    ])
  ),
]);
