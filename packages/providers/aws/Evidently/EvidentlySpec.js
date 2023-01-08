const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html
const { EvidentlyExperiment } = require("./EvidentlyExperiment");
const { EvidentlyFeature } = require("./EvidentlyFeature");
const { EvidentlyLaunch } = require("./EvidentlyLaunch");
const { EvidentlyProject } = require("./EvidentlyProject");
const { EvidentlySegment } = require("./EvidentlySegment");

const GROUP = "Evidently";
const tagsKey = "tags";
const compare = compareAws({ tagsKey, key: "key" });

module.exports = pipe([
  () => [
    EvidentlyExperiment({}),
    EvidentlyFeature({}),
    EvidentlyLaunch({}),
    EvidentlyProject({}),
    EvidentlySegment({}),
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
