const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudHSMV2.html

//const { CloudHSMV2Cluster } = require("./CloudHSMV2Cluster");
//const { CloudHSMV2Hsm } = require("./CloudHSMV2Hsm");

const GROUP = "CloudHSMV2";

const compare = compareAws({});

module.exports = pipe([
  () => [
    // CloudHSMV2Cluster({})
    // CloudHSMV2Hsm({})
  ],
  map(createAwsService),
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
    })
  ),
]);
