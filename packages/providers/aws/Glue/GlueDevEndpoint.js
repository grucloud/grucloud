const assert = require("assert");
const { pipe, tap, get, pick, assign, map } = require("rubico");
const { defaultsDeep, isIn, when } = require("rubico/x");

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

const pickId = pipe([
  tap(({ EndpointName }) => {
    assert(EndpointName);
  }),
  pick(["EndpointName"]),
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
          `arn:aws:glue:${
            config.region
          }:${config.accountId()}:devEndpoint/${Name}`,
      ]),
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignArn({ config }),
    assignTags({ endpoint, buildArn: buildArn() }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html
exports.GlueDevEndpoint = () => ({
  type: "DevEndpoint",
  package: "glue",
  client: "Glue",
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "RoleArn",
    "SecurityGroupIds",
    "SubnetId",
    "YarnEndpointAddress",
    "PrivateAddress",
    "PublicAddress",
    "Status",
    "AvailabilityZone",
    "VpcId",
    "FailureReason",
    "LastUpdateStatus",
    "CreatedTimestamp",
    "LastModifiedTimestamp",
  ],
  inferName: () =>
    pipe([
      get("EndpointName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("EndpointName"),
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
  ignoreErrorCodes: ["ResourceNotFoundException", "InvalidInputException"],
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => get("RoleArn"),
    },
    subnet: {
      type: "Subnet",
      group: "EC2",
      dependencyId: ({ lives, config }) => get("SubnetId"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("SecurityGroupIds"),
    },
    // S3 Stuff
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#getDevEndpoint-property
  getById: {
    method: "getDevEndpoint",
    getField: "DevEndpoint",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#listDevEndpoints-property
  getList: {
    method: "listDevEndpoints",
    getParam: "DevEndpointNames",
    decorate: ({ getById }) =>
      pipe([(DevEndpointName) => ({ DevEndpointName }), getById]),
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#createDevEndpoint-property
  create: {
    method: "createDevEndpoint",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([get("Status"), isIn(["READY"])]),
    isInstanceError: pipe([get("Status"), isIn(["FAILED"])]),
    getErrorMessage: pipe([get("FailureReason", "FAILED")]),
    shouldRetryOnExceptionMessages: [
      "should be given assume role permissions for Glue Service",
      "is not authorized to perform",
      "S3 endpoint and NAT validation has failed for subnetId",
    ],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#updateDevEndpoint-property
  // TODO
  update: {
    method: "updateDevEndpoint",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        () => payload,
        // AddArguments DeleteArguments
        // AddPublicKeys DeletePublicKeys
        // CustomLibraries
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#deleteDevEndpoint-property
  destroy: {
    method: "deleteDevEndpoint",
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
    dependencies: { iamRole, securityGroups, subnet },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(iamRole);
      }),
      () => otherProps,
      defaultsDeep({
        RoleArn: getField(iamRole, "Arn"),
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
      when(
        () => securityGroups,
        defaultsDeep({
          SecurityGroups: pipe([
            () => securityGroups,
            map((sg) => getField(sg, "GroupId")),
          ])(),
        })
      ),
      when(
        () => subnet,
        defaultsDeep({
          SubnetId: getField(subnet, "SubnetId"),
        })
      ),
    ])(),
});
