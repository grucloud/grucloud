const { pipe, tap, get } = require("rubico");
const { pluck, unless, isEmpty } = require("rubico/x");
const { buildTags } = require("../AwsCommon");

const { createEndpoint } = require("../AwsCommon");

const { createTagger } = require("../AwsTagger");
const {
  AutoScalingAutoScalingGroup,
} = require("../Autoscaling/AutoScalingAutoScalingGroup");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "resourceArn",
  TagsKey: "tags",
  UnTagsKey: "tagKeys",
});

exports.createECS = createEndpoint("ecs", "ECS");

exports.buildTagsEcs = ({ name, config, namespace, tags }) =>
  buildTags({
    name,
    config,
    namespace,
    UserTags: tags,
    key: "key",
    value: "value",
  });

exports.dependencyTargetGroups = {
  type: "TargetGroup",
  group: "ElasticLoadBalancingV2",
  list: true,
  dependencyIds: ({ lives, config }) =>
    pipe([get("loadBalancers"), pluck("targetGroupArn")]),
};

exports.destroyAutoScalingGroupById = ({ lives, config }) =>
  pipe([
    lives.getById({
      providerName: config.providerName,
      type: "AutoScalingGroup",
      group: "AutoScaling",
    }),
    get("name"),
    unless(
      isEmpty,
      pipe([
        (AutoScalingGroupName) => ({ live: { AutoScalingGroupName } }),
        AutoScalingAutoScalingGroup({
          spec: { type: "AutoScalingGroup", group: "AutoScaling" },
          config,
        }).destroy,
      ])
    ),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#tagResource-property
exports.tagResource =
  ({ ecs }) =>
  ({ id }) =>
    pipe([(tags) => ({ resourceArn: id, tags }), ecs().tagResource]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#untagResource-property
exports.untagResource =
  ({ ecs }) =>
  ({ id }) =>
    pipe([(tagKeys) => ({ resourceArn: id, tagKeys }), ecs().untagResource]);
