const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Appflow.html

//const { AppflowFlow } = require("./AppflowFlow");
//const { AppflowConnectorProfile } = require("./AppflowConnectorProfile");

const GROUP = "Appflow";

const compare = compareAws({});

module.exports = pipe([
  () => [
    // AppflowFlow({})
    // AppflowConnectorProfile({})
  ],
  map(createAwsService),
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
    })
  ),
]);
