const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { isOurMinion, compareAws } = require("../AwsCommon");
const { FirehoseDeliveryStream } = require("./FirehoseDeliveryStream");

const GROUP = "Firehose";

const tagsKey = "Tags";

const compareFirehose = compareAws({ tagsKey });

module.exports = pipe([
  () => [
    //
    FirehoseDeliveryStream({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        isOurMinion,
        tagsKey,
        compare: compareFirehose({}),
      }),
    ])
  ),
]);
