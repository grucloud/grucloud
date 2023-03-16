const assert = require("assert");
const { pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

// const {
//   WorkSpacesWebBrowserSettings,
// } = require("./WorkSpacesWebBrowserSettings");
// const {
//   WorkSpacesWebNetworkSettings,
// } = require("./WorkSpacesWebNetworkSettings");
// const { WorkSpacesWebPortal } = require("./WorkSpacesWebPortal");
// const {
//   WorkSpacesWebBrowserSettings,
// } = require("./WorkSpacesWebBrowserSettings");
// const { WorkSpacesWebTrustStore } = require("./WorkSpacesWebTrustStore");
// const { WorkSpacesWebUserSettings } = require("./WorkSpacesWebUserSettings");

//  https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html
const GROUP = "WorkSpacesWeb";
const tagsKey = "tags";

const compare = compareAws({ tagsKey, key: "Key" });

module.exports = pipe([
  () => [
    // WorkSpacesWebBrowserSettings({}),
    // WorkSpacesWebNetworkSettings({}),
    // WorkSpacesWebPortal({}),
    // WorkSpacesWebTrustStore({}),
    // WorkSpacesWebUserSettings({}),
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
