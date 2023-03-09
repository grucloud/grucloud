const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

// const {
//   KinesisAnalyticsV2Application,
// } = require("./KinesisAnalyticsV2Application");

// const {
//   KinesisAnalyticsV2ApplicationSnapshot,
// } = require("./KinesisAnalyticsV2ApplicationSnapshot");

const GROUP = "KinesisAnalyticsV2";

const tagsKey = "Tags";

const compare = compareAws({ tagsKey });

module.exports = pipe([
  () => [
    //
    // KinesisAnalyticsV2Application({ compare }),
    // KinesisAnalyticsV2ApplicationSnapshot({ compare }),
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
