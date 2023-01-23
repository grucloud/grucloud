const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const tagsKey = "tags";
const compare = compareAws({ tagsKey, key: "key" });

const { BatchComputeEnvironment } = require("./BatchComputeEnvironment");
const { BatchJobDefinition } = require("./BatchJobDefinition");
const { BatchJobQueue } = require("./BatchJobQueue");
const { BatchSchedulingPolicy } = require("./BatchSchedulingPolicy");

module.exports = pipe([
  () => [
    BatchComputeEnvironment({}),
    BatchJobDefinition({}),
    BatchJobQueue({}),
    BatchSchedulingPolicy({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: "Batch",
        compare: compare({}),
        tagsKey,
      }),
    ])
  ),
]);
