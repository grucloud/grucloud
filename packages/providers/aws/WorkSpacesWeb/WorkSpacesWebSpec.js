const assert = require("assert");
const { pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const {
  WorkSpacesWebBrowserSettings,
} = require("./WorkSpacesWebBrowserSettings");
const {
  WorkSpacesWebIdentityProvider,
} = require("./WorkSpacesWebIdentityProvider");
const {
  WorkSpacesWebNetworkSettings,
} = require("./WorkSpacesWebNetworkSettings");
const { WorkSpacesWebPortal } = require("./WorkSpacesWebPortal");
const { WorkSpacesWebTrustStore } = require("./WorkSpacesWebTrustStore");
const {
  WorkSpacesWebUserAccessLoggingSettings,
} = require("./WorkSpacesWebUserAccessLoggingSettings");
const { WorkSpacesWebUserSettings } = require("./WorkSpacesWebUserSettings");

//  https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html

const GROUP = "WorkSpacesWeb";
const tagsKey = "tags";
// NOTE:  tags is lowercase and Key uppercase
const compare = compareAws({ tagsKey, key: "Key" });

module.exports = pipe([
  () => [
    WorkSpacesWebBrowserSettings({}),
    WorkSpacesWebIdentityProvider({}),
    WorkSpacesWebNetworkSettings({}),
    WorkSpacesWebPortal({}),
    WorkSpacesWebTrustStore({}),
    WorkSpacesWebUserAccessLoggingSettings({}),
    WorkSpacesWebUserSettings({}),
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
