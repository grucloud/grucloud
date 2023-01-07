const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Xray.html

const { XRayEncryptionConfig } = require("./XRayEncryptionConfig");
const { XRayGroup } = require("./XRayGroup");
const { XRaySamplingRule } = require("./XRaySamplingRule");

const GROUP = "XRay";

const compare = compareAws({});

module.exports = pipe([
  () => [
    XRayEncryptionConfig({ compare }),
    XRayGroup({ compare }),
    XRaySamplingRule({ compare }),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
      }),
    ])
  ),
]);
