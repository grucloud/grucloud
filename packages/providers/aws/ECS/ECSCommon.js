const assert = require("assert");
const { pipe, tap, get } = require("rubico");
const { pluck, unless, isEmpty, first, last, callProp } = require("rubico/x");
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

exports.dependencyTaskDefinition = {
  type: "TaskDefinition",
  group: "ECS",
  dependencyId: ({ lives, config }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      get("taskDefinition"),
      unless(
        isEmpty,
        pipe([
          callProp("split", "/"),
          last,
          callProp("split", ":"),
          first,
          tap((name) => {
            assert(name);
          }),
          lives.getByName({
            type: "TaskDefinition",
            group: "ECS",
            providerName: config.config,
          }),
          get("id"),
        ])
      ),
    ]),
};
