const assert = require("assert");
const { map, pipe, tap, assign, eq, get, omit } = require("rubico");
const { defaultsDeep, size, when } = require("rubico/x");

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
      compare: compareAws({ filterTarget: () => pipe([omit(["ShardCount"])]) }),
      filterLive: () =>
        pipe([
          when(
            eq(get("StreamModeDetails.StreamMode"), "PROVISIONED"),
            pipe([assign({ ShardCount: pipe([get("Shards"), size]) })])
          ),
        ]),
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
