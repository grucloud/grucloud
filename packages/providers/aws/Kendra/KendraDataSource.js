const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  assign,
  map,
  and,
  or,
  not,
  filter,
  fork,
} = require("rubico");
const {
  defaultsDeep,
  isIn,
  first,
  pluck,
  callProp,
  when,
  isEmpty,
  unless,
  identity,
} = require("rubico/x");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./KendraCommon");

const assignArn = ({ config }) =>
  pipe([
    tap(({ IndexId, Id }) => {
      assert(IndexId);
      assert(Id);
    }),
    assign({
      Arn: pipe([
        ({ IndexId, Id }) =>
          `arn:aws:kendra:${
            config.region
          }:${config.accountId()}:index/${IndexId}/data-source/${Id}`,
      ]),
    }),
  ]);

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ Id, IndexId }) => {
    assert(Id);
    assert(IndexId);
  }),
  pick(["Id", "IndexId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignArn({ config }),
    assignTags({ buildArn: buildArn(config), endpoint }),
    omitIfEmpty(["Schedule", "Description"]),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kendra.html
exports.KendraDataSource = () => ({
  type: "DataSource",
  package: "kendra",
  client: "Kendra",
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "Id",
    "IndexId",
    "Endpoints",
    "RoleArn",
    "VpcConfiguration",
    "Status",
    "UpdatedAt",
    "CreatedAt",
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
      get("Id"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    index: {
      type: "Index",
      group: "Kendra",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("IndexId"),
          tap((IndexId) => {
            assert(IndexId);
          }),
        ]),
    },
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("RoleArn"),
          tap((RoleArn) => {
            assert(RoleArn);
          }),
        ]),
    },
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([get("Configuration.S3Configuration.BucketName")]),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("VpcConfiguration.SecurityGroupIds")]),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("VpcConfiguration.SubnetIds")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kendra.html#describeDataSource-property
  getById: {
    method: "describeDataSource",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kendra.html#listDataSources-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Index", group: "Kendra" },
          pickKey: pipe([
            tap(({ Id }) => {
              assert(Id);
            }),
            ({ Id }) => ({ IndexId: Id }),
          ]),
          method: "listDataSources",
          getParam: "SummaryItems",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap((params) => {
                assert(parent.Id);
              }),
              defaultsDeep({ IndexId: parent.Id }),
              getById({}),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kendra.html#createDataSource-property
  create: {
    method: "createDataSource",
    pickCreated: ({ payload }) => pipe([identity, defaultsDeep(payload)]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kendra.html#updateDataSource-property
  update: {
    method: "updateDataSource",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kendra.html#deleteDataSource-property
  destroy: {
    method: "deleteDataSource",
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
    dependencies: { index, iamRole, securityGroups, subnets },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(index);
        assert(iamRole);
      }),
      () => otherProps,
      defaultsDeep({
        IndexId: getField(index, "Id"),
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        RoleArn: getField(iamRole, "Arn"),
      }),
      when(
        () => securityGroups,
        defaultsDeep({
          VpcConfiguration: {
            SecurityGroupIds: pipe([
              () => securityGroups,
              map((securityGroup) => getField(securityGroup, "GroupId")),
            ])(),
          },
        })
      ),
      when(
        () => subnets,
        defaultsDeep({
          VpcConfiguration: {
            SubnetIds: pipe([
              () => subnets,
              map((subnet) => getField(subnet, "SubnetId")),
            ])(),
          },
        })
      ),
    ])(),
});
