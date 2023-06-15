const assert = require("assert");
const { pipe, tap, get, pick, assign, map } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./GlueCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const assignArn = ({ config }) =>
  pipe([
    tap(({ Name }) => {
      assert(Name);
      assert(config);
    }),
    assign({
      Arn: pipe([
        ({ Name }) =>
          `arn:${config.partition}:glue:${
            config.region
          }:${config.accountId()}:connection/${Name}`,
      ]),
    }),
  ]);

const pickId = pipe([
  tap(({ Name }) => {
    assert(Name);
  }),
  pick(["Name"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignArn({ config }),
    assignTags({ endpoint, buildArn: buildArn() }),
  ]);

const filterPayload = pipe([
  ({ CatalogId, Tags, ...ConnectionInput }) => ({
    CatalogId,
    Tags,
    ConnectionInput,
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html
exports.GlueConnection = () => ({
  type: "Connection",
  package: "glue",
  client: "Glue",
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "CreationTime",
    "LastUpdatedTime",
    "LastUpdatedBy",
    "ConnectionProperties.ENCRYPTED_PASSWORD",
    "ConnectionProperties.ENCRYPTED_KAFKA_CLIENT_KEYSTORE_PASSWORD",
    "PhysicalConnectionRequirements.AvailabilityZone",
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
      get("Arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["EntityNotFoundException"],
  environmentVariables: [
    { path: "ConnectionProperties.PASSWORD", suffix: "PASSWORD" },
    {
      path: "ConnectionProperties.KAFKA_CLIENT_KEY_PASSWORD",
      suffix: "KAFKA_CLIENT_KEY_PASSWORD",
    },
  ],
  dependencies: {
    subnet: {
      type: "Subnet",
      group: "EC2",
      dependencyId: ({ lives, config }) =>
        get("PhysicalConnectionRequirements.SubnetId"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        get("PhysicalConnectionRequirements.SecurityGroupIdList"),
    },
    secret: {
      type: "Secret",
      group: "SecretsManager",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        get("ConnectionProperties.SECRET_ID"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#getConnection-property
  getById: {
    method: "getConnection",
    getField: "Connection",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#getConnections-property
  getList: {
    method: "getConnections",
    getParam: "ConnectionList",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#createConnection-property
  create: {
    filterPayload,
    method: "createConnection",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#updateConnection-property
  update: {
    method: "updateConnection",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        () => payload,
        ({ CatalogId, Name, Tags, ...ConnectionInput }) => ({
          Name,
          CatalogId,
          ConnectionInput,
        }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#deleteConnection-property
  destroy: {
    method: "deleteConnection",
    pickId: pipe([
      tap(({ Name }) => {
        assert(Name);
      }),
      ({ Name }) => ({ ConnectionName: Name }),
    ]),
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
    dependencies: { secret, securityGroups, subnet },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
      when(
        () => secret,
        defaultsDeep({
          ConnectionProperties: {
            SECRET_ID: getField(secret, "ARN"),
          },
        })
      ),
      when(
        () => securityGroups,
        defaultsDeep({
          PhysicalConnectionRequirements: {
            SecurityGroupIdList: pipe([
              () => securityGroups,
              map((sg) => getField(sg, "GroupId")),
            ])(),
          },
        })
      ),
      when(
        () => subnet,
        defaultsDeep({
          PhysicalConnectionRequirements: {
            SubnetId: getField(subnet, "SubnetId"),
          },
        })
      ),
    ])(),
});
