const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { isOurMinion, compareAws } = require("../AwsCommon");
const { KinesisStream } = require("./KinesisStream");

const GROUP = "Kinesis";

const tagsKey = "Tags";

const compareKinesis = compareAws({ tagsKey });

module.exports = pipe([
  () => [
    {
      type: "Stream",
      Client: KinesisStream,
      omitProperties: [
        "StreamARN",
        "StreamCreationTimestamp",
        "StreamStatus",
        "HasMoreShards",
        "Shards",
        "EnhancedMonitoring", // TODO
      ],
      propertiesDefault: { EncryptionType: "NONE", RetentionPeriodHours: 24 },
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      isOurMinion,
      tagsKey,
      compare: compareKinesis({}),
    })
  ),
]);
