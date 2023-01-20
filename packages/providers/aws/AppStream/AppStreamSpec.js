const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html
const { AppStreamAppBlock } = require("./AppStreamAppBlock");
const { AppStreamApplication } = require("./AppStreamApplication");
const { AppStreamDirectoryConfig } = require("./AppStreamDirectoryConfig");
const { AppStreamEntitlement } = require("./AppStreamEntitlement");
const { AppStreamFleet } = require("./AppStreamFleet");
const { AppStreamImageBuilder } = require("./AppStreamImageBuilder");
const { AppStreamStack } = require("./AppStreamStack");
const { AppStreamUser } = require("./AppStreamUser");
const {
  AppStreamUserStackAssociation,
} = require("./AppStreamUserStackAssociation");
const {
  AppStreamUsageReportSubscription,
} = require("./AppStreamUsageReportSubscription");

const GROUP = "AppStream";
const tagsKey = "Tags";

const compare = compareAws({ tagsKey, key: "Key" });

module.exports = pipe([
  () => [
    AppStreamAppBlock({ compare }),
    AppStreamApplication({ compare }),
    AppStreamDirectoryConfig({ compare }),
    AppStreamEntitlement({ compare }),
    AppStreamFleet({}),
    AppStreamImageBuilder({}),
    AppStreamStack({}),
    AppStreamUser({}),
    AppStreamUsageReportSubscription({}),
    AppStreamUserStackAssociation({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
        tagsKey,
      }),
    ])
  ),
]);
