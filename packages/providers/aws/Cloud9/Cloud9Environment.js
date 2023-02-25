const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, and } = require("rubico");
const { defaultsDeep, when, identity, find } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./Cloud9Common");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ environmentId }) => {
    assert(environmentId);
  }),
  pick(["environmentId"]),
]);

const toEnvironmentId = ({ id, ...other }) => ({ environmentId: id, ...other });

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    toEnvironmentId,
  ]);

const findEC2Instance =
  ({ lives }) =>
  ({ environmentId }) =>
    pipe([
      tap(() => {
        assert(environmentId);
        assert(lives);
      }),
      () => lives,
      find(
        and([
          eq(get("groupType"), "EC2::Instance"),
          pipe([
            get("live.Tags"),
            find(eq(get("Key"), "aws:cloud9:environment")),
            eq(get("Value"), environmentId),
          ]),
        ])
      ),
    ])();
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Cloud9.html
exports.Cloud9Environment = () => ({
  type: "Environment",
  package: "cloud9",
  client: "Cloud9",
  propertiesDefault: {},
  omitProperties: [
    "subnetId",
    "ownerArn",
    "arn",
    "environmentId",
    "lifecycle",
    "type",
    "managedCredentialsStatus",
  ],
  inferName: () =>
    pipe([
      get("name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    iamUser: {
      type: "User",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("ownerArn"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
    subnet: {
      type: "Subnet",
      group: "EC2",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("subnetId"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      tap(({ environmentId }) => {
        assert(lives);
        assert(environmentId);
      }),
      assign({
        instanceType: pipe([
          findEC2Instance({ lives }),
          get("live.InstanceType", "t2.micro"),
        ]),
        subnetId: pipe([findEC2Instance({ lives }), get("live.SubnetId")]),
      }),
    ]),
  ignoreErrorCodes: [404],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Cloud9.html#describeEnvironments-property
  getById: {
    method: "describeEnvironments",
    getField: "environments",
    pickId: pipe([
      tap(({ environmentId }) => {
        assert(environmentId);
      }),
      ({ environmentId }) => ({ environmentIds: [environmentId] }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Cloud9.html#listEnvironments-property
  getList: {
    method: "listEnvironments",
    getParam: "environmentIds",
    decorate: ({ getById }) =>
      pipe([(environmentId) => ({ environmentId }), getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Cloud9.html#createEnvironmentEC2-property
  create: {
    method: "createEnvironmentEC2",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: eq(get("lifecycle.status"), "CREATED"),
    isInstanceError: eq(get("lifecycle.status"), "CREATE_FAILED"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Cloud9.html#updateEnvironment-property
  update: {
    method: "updateEnvironment",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Cloud9.html#deleteEnvironment-property
  destroy: {
    method: "deleteEnvironment",
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
    properties: { tags, ...otherProps },
    dependencies: { iamUser },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTags({ config, namespace, UserTags: tags }),
      }),
      when(() => iamUser, defaultsDeep({ ownerArn: getField(iamUser, "Arn") })),
    ])(),
});
