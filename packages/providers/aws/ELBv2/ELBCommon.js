const { pipe, tap } = require("rubico");

const {
  ElasticLoadBalancingV2,
} = require("@aws-sdk/client-elastic-load-balancing-v2");
const { createEndpoint } = require("../AwsCommon");

exports.createELB = createEndpoint(ElasticLoadBalancingV2);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#addTags-property
exports.tagResource =
  ({ elb }) =>
  ({ id }) =>
    pipe([(Tags) => ({ ResourceArns: [id], Tags }), elb().addTags]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#removeTags-property
exports.untagResource =
  ({ elb }) =>
  ({ id }) =>
    pipe([(TagKeys) => ({ ResourceArns: [id], TagKeys }), elb().removeTags]);
