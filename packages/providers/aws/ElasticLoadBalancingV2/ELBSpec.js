const assert = require("assert");
const { pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws, isOurMinion } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const { ElasticLoadBalancingV2LoadBalancer } = require("./ELBLoadBalancer");
const { ElasticLoadBalancingV2TargetGroup } = require("./ELBTargetGroup");
const { ElasticLoadBalancingV2Listener } = require("./ELBListener");
const { ElasticLoadBalancingV2Rule } = require("./ELBRule");

const GROUP = "ElasticLoadBalancingV2";

const compare = compareAws({});

module.exports = pipe([
  () => [
    ElasticLoadBalancingV2Listener({ compare }),
    ElasticLoadBalancingV2LoadBalancer({ compare }),
    ElasticLoadBalancingV2Rule({ compare }),
    ElasticLoadBalancingV2TargetGroup({ compare }),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({ group: GROUP, compare: compare({}), isOurMinion }),
    ])
  ),
]);
