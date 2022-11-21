const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amplify.html

const { AmplifyApp } = require("./AmplifyApp");
const { AmplifyBackendEnvironment } = require("./AmplifyBackendEnvironment");
const { AmplifyBranch } = require("./AmplifyBranch");
const { AmplifyDomainAssociation } = require("./AmplifyDomainAssociation");
const { AmplifyWebhook } = require("./AmplifyWebhook");

const GROUP = "Amplify";
const tagsKey = "tag";
const compare = compareAws({ tagsKey, key: "key" });

module.exports = pipe([
  () => [
    AmplifyApp({}),
    AmplifyBackendEnvironment({}),
    AmplifyBranch({}),
    AmplifyDomainAssociation({}),
    AmplifyWebhook({}),
  ],
  map(createAwsService),
  map(
    defaultsDeep({
      group: GROUP,
      tagsKey,
      compare: compare({}),
    })
  ),
]);
