const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

const GROUP = "S3Control";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const { S3ControlAccessPoint } = require("./S3ControlAccessPoint");

const {
  S3ControlMultiRegionAccessPoint,
} = require("./S3ControlMultiRegionAccessPoint");
// const { S3ControlObjectLambdaAccessPoint } = require("./S3ControlObjectLambdaAccessPoint");
// const { S3ControlStorageLensConfiguration } = require("./S3ControlStorageLensConfiguration");

module.exports = pipe([
  () => [
    //
    S3ControlAccessPoint({ compare }),
    //S3ControlMultiRegionAccessPoint({ compare }),
    //S3ControlObjectLambdaAccessPoint({ compare }),
    //S3ControlStorageLensConfiguration({ compare }),
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
