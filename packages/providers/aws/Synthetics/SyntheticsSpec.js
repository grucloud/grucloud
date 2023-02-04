const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Synthetics.html

const { SyntheticsCanary } = require("./SyntheticsCanary");
//const { SyntheticsTable } = require("./SyntheticsTable");

const GROUP = "Synthetics";

const compare = compareAws({});

module.exports = pipe([
  () => [
    //
    SyntheticsCanary({ compare }),
    //SyntheticsTable({ compare }),
  ],
  map(createAwsService),
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
    })
  ),
]);
