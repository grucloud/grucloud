const assert = require("assert");
const { tap, pipe, map, get, eq, switchCase } = require("rubico");
const { defaultsDeep, callProp, last } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const {
  ApplicationAutoScalingPolicy,
} = require("./ApplicationAutoScalingPolicy");

const {
  ApplicationAutoScalingTarget,
} = require("./ApplicationAutoScalingTarget");

const GROUP = "ApplicationAutoScaling";
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const findDependencyId =
  ({ type, group, ServiceNamespace }) =>
  ({ lives, config }) =>
    pipe([
      switchCase([
        eq(get("ServiceNamespace"), ServiceNamespace),
        pipe([
          get("ResourceId"),
          callProp("split", "/"),
          last,
          lives.getByName({
            type,
            group,
            providerName: config.providerName,
          }),
          get("id"),
        ]),
        () => undefined,
      ]),
    ]);

module.exports = pipe([
  () => [
    {
      type: "Policy",
      Client: ApplicationAutoScalingPolicy,
      propertiesDefault: {},
      omitProperties: ["Alarms", "PolicyARN", "CreationTime"],
      inferName: () =>
        pipe([
          ({ ResourceId, ScalableDimension, PolicyName }) =>
            `${ResourceId}::${ScalableDimension}::${PolicyName}`,
        ]),
      dependencies: {
        target: {
          type: "Target",
          group: "ApplicationAutoScaling",
          dependencyId: () =>
            pipe([
              ({ ResourceId, ScalableDimension }) =>
                `${ResourceId}::${ScalableDimension}`,
            ]),
        },
      },
    },
    {
      type: "Target",
      Client: ApplicationAutoScalingTarget,
      propertiesDefault: {},
      omitProperties: ["RoleARN", "CreationTime", "SuspendedState"],
      inferName: () =>
        pipe([
          ({ ResourceId, ScalableDimension }) =>
            `${ResourceId}::${ScalableDimension}`,
        ]),
      dependencies: {
        role: {
          type: "Role",
          group: "IAM",
          dependencyId: () => get("RoleARN"),
        },
        dynamoDbTable: {
          type: "Table",
          group: "DynamoDB",
          dependencyId: findDependencyId({
            type: "Table",
            group: "DynamoDB",
            ServiceNamespace: "dynamodb",
          }),
        },
        ecsService: {
          type: "Service",
          group: "ECS",
          dependencyId: findDependencyId({
            type: "Service",
            group: "ECS",
            ServiceNamespace: "ecs",
          }),
        },
      },
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
      tagsKey,
    })
  ),
]);
