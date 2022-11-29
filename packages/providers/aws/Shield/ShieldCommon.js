const assert = require("assert");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceARN",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

exports.shieldDependencies = {
  cloudFrontDistribution: {
    type: "Distribution",
    group: "CloudFront",
    arnKey: "ARN",
  },
  ec2ElasticIpAddress: {
    type: "ElasticIpAddress",
    group: "EC2",
    arnKey: "Arn",
  },
  elbv2LoadBalancer: {
    type: "LoadBalancer",
    group: "ElasticLoadBalancingV2",
    arnKey: "LoadBalancerArn",
  },
  globalAccelerator: {
    type: "Accelerator",
    group: "GlobalAccelerator",
    arnKey: "AcceleratorArn",
  },
  route53HostedZone: {
    type: "HostedZone",
    group: "Route53",
    arnKey: "Arn",
  },
};
