const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FMS.html
const { FMSAdminAccount } = require("./FMSAdminAccount");
const { FMSNotificationChannel } = require("./FMSNotificationChannel");
const { FMSPolicy } = require("./FMSPolicy");
const { FMSProtocolsList } = require("./FMSProtocolsList");

const GROUP = "FMS";
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

module.exports = pipe([
  () => [
    //
    FMSAdminAccount({}),
    FMSNotificationChannel({}),
    FMSPolicy({}),
    FMSProtocolsList({}),
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
