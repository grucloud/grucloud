const assert = require("assert");
const { pipe, tap, get, pick, map } = require("rubico");
const { defaultsDeep, isIn } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./OSISCommon");

const buildArn = () =>
  pipe([
    get("PipelineArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ PipelineName }) => {
    assert(PipelineName);
  }),
  pick(["PipelineName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
    ({ VpcEndpoints: { VpcOptions }, ...other }) => ({ VpcOptions, ...other }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OSIS.html
exports.OSISPipeline = () => ({
  type: "Pipeline",
  package: "osis",
  client: "OSIS",
  propertiesDefault: {},
  omitProperties: [
    "LastUpdatedAt",
    "CreatedAt",
    "PipelineArn",
    "Status",
    "StatusReason",
    "IngestEndpointUrls",
  ],
  inferName: () =>
    pipe([
      get("PipelineName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("PipelineName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("PipelineArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      required: true,
      pathId: "VpcOptions.SubnetIds",
      dependencyIds: ({ lives, config }) => get("VpcOptions.SubnetIds"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      required: true,
      pathId: "VpcOptions.SecurityGroupIds",
      dependencyIds: ({ lives, config }) => get("VpcOptions.SecurityGroupIds"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OSIS.html#getPipeline-property
  getById: {
    method: "getPipeline",
    getField: "Pipeline",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OSIS.html#listPipelines-property
  getList: {
    method: "listPipelines",
    getParam: "Pipelines",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OSIS.html#createPipeline-property
  create: {
    method: "createPipeline",
    pickCreated: ({ payload }) => pipe([get("Pipeline")]),
    isInstanceUp: pipe([get("Status"), isIn(["ACTIVE"])]),
    isInstanceError: pipe([get("Status"), isIn(["CREATE_FAILED"])]),
    getErrorMessage: pipe([get("StatusReason.Description", "CREATE_FAILED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OSIS.html#updatePipeline-property
  update: {
    method: "updatePipeline",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OSIS.html#deletePipeline-property
  destroy: {
    method: "deletePipeline",
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
    dependencies: { securityGroups, subnets },
    config,
  }) =>
    pipe([
      tap((name) => {
        assert(securityGroups);
        assert(subnets);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        VpcOptions: {
          SecurityGroupIds: pipe([
            () => securityGroups,
            map((sg) => getField(sg, "GroupId")),
          ])(),
          Subnets: pipe([
            () => subnets,
            map((subnet) => getField(subnet, "SubnetId")),
          ])(),
        },
      }),
    ])(),
});
