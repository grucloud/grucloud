const assert = require("assert");
const { pipe, tap, get, pick, assign, map } = require("rubico");
const { defaultsDeep, when, identity, keys, first } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./ShieldCommon");

const shieldDependencies = {
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

const buildShieldDependencies = pipe([
  () => shieldDependencies,
  map(({ type, group }) => ({
    type,
    group,
    dependencyId: ({ lives, config }) =>
      pipe([
        get("ResourceArn"),
        tap((ResourceArn) => {
          assert(ResourceArn);
        }),
        lives.getById({ type, group, providerName: config.providerName }),
        get("id"),
      ]),
  })),
]);

const buildArn = () =>
  pipe([
    get("ProtectionArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ ProtectionId }) => {
    assert(ProtectionId);
  }),
  pick(["ProtectionId"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    ({ Id, ...other }) => ({ ProtectionId: Id, ...other }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Shield.html
exports.ShieldProtection = pipe([
  () => ({
    type: "Protection",
    package: "shield",
    client: "Shield",
    propertiesDefault: {},
    omitProperties: [
      "ProtectionId",
      "ApplicationLayerAutomaticResponseConfiguration",
      "ResourceArn",
      "HealthCheckIds",
    ],
    inferName: () =>
      pipe([
        get("Name"),
        tap((Name) => {
          assert(Name);
        }),
      ]),
    findName: () =>
      pipe([
        get("Name"),
        tap((name) => {
          assert(name);
        }),
      ]),
    findId: () =>
      pipe([
        get("ProtectionId"),
        tap((id) => {
          assert(id);
        }),
      ]),
    dependencies: {
      route53HealthChecks: {
        type: "HealthCheck",
        group: "Route53",
        list: true,
        dependencyIds: ({ lives, config }) => pipe([get("HealthCheckIds")]),
      },
      ...buildShieldDependencies(),
    },
    ignoreErrorCodes: ["ResourceNotFoundException"],
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Shield.html#describeProtection-property
    getById: {
      method: "describeProtection",
      getField: "Protection",
      pickId,
      decorate,
    },
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Shield.html#listProtections-property
    getList: {
      method: "listProtections",
      getParam: "Protections",
      decorate: ({ getById }) =>
        pipe([({ Id }) => ({ ProtectionId: Id }), getById]),
    },
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Shield.html#createProtection-property
    create: {
      method: "createProtection",
      pickCreated: ({ payload }) => pipe([identity]),
    },
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Shield.html#deleteProtection-property
    destroy: {
      method: "deleteProtection",
      pickId,
    },
    getByName: getByNameCore,
    tagger: ({ config }) =>
      Tagger({
        buildArn: buildArn({ config }),
      }),
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { route53HealthChecks, ...otherDependencies },
      config,
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        }),
        when(
          () => route53HealthChecks,
          assign({
            HealthCheckIds: pipe([
              () => route53HealthChecks,
              map((healthCheck) => getField(healthCheck, "Id")),
            ]),
          })
        ),
        assign({
          ResourceArn: pipe([
            tap((params) => {
              assert(true);
            }),
            () => otherDependencies,
            keys,
            first,
            (depKey) =>
              getField(
                otherDependencies[depKey],
                shieldDependencies[depKey].arnKey || "Arn"
              ),
          ]),
        }),
      ])(),
  }),
  tap((params) => {
    assert(true);
  }),
]);
