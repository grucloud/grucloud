const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DAX.html

const { DAXCluster } = require("./DAXCluster");
const { DAXParameterGroup } = require("./DAXParameterGroup");
const { DAXSubnetGroup } = require("./DAXSubnetGroup");

const GROUP = "DAX";

const compare = compareAws({});

module.exports = pipe([
  () => [
    //
    DAXCluster({ compare }),
    DAXParameterGroup({}),
    DAXSubnetGroup({}),
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
