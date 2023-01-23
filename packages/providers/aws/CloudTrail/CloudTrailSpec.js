const assert = require("assert");
const { tap, pipe, get, map, omit, lte, and, assign } = require("rubico");
const { defaultsDeep, isEmpty, first, size, when } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { compareAws, isOurMinion } = require("../AwsCommon");

const { CloudTrail } = require("./CloudTrail");
const { CloudTrailEventDataStore } = require("./CloudTrailEventDataStore");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudTrail.html
const GROUP = "CloudTrail";
const tagsKey = "TagsList";
const compare = compareAws({ tagsKey });

module.exports = pipe([
  () => [
    //
    CloudTrail({ compare }),
    CloudTrailEventDataStore({ compare }),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        tagsKey,
        compare: compare({}),
        isOurMinion,
      }),
    ])
  ),
]);
