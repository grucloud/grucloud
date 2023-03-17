const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");
const {
  CodeStarNotificationsNotificationRule,
} = require("./CodeStarNotificationsNotificationRule");

const GROUP = "CodeStarNotifications";
const tagsKey = "tags";
const compare = compareAws({ tagsKey, key: "key" });

module.exports = pipe([
  () => [
    //
    CodeStarNotificationsNotificationRule({}),
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
