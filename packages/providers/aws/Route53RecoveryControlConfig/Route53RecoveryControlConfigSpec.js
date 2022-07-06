const assert = require("assert");
const { tap, pipe, map, assign, eq, get, fork, omit, and } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { isOurMinion, compareAws } = require("../AwsCommon");
// const {
//   Route53RecoveryControlConfigCluster,
// } = require("./Route53RecoveryControlConfigCluster");

const GROUP = "Route53RecoveryControlConfig";

const compareRoute53RecoveryControlConfig = compareAws({});

module.exports = pipe([
  () => [
    // {
    //   type: "Cell",
    //   Client: Route53RecoveryControlConfigCluster,
    //   omitProperties: [],
    // },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      isOurMinion,
      compare: compareRoute53RecoveryControlConfig({}),
    })
  ),
]);
