const {
  ElasticLoadBalancingV2,
} = require("@aws-sdk/client-elastic-load-balancing-v2");
const { createEndpoint } = require("../AwsCommon");

exports.createELB = createEndpoint(ElasticLoadBalancingV2);
