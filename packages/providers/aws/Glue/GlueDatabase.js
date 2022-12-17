const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, unless } = require("rubico/x");

const { buildTagsObject } = require("@grucloud/core/Common");
const { replaceAccountAndRegion } = require("../AwsCommon");
const { Tagger, assignTags } = require("./GlueCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ Name }) => {
    assert(Name);
  }),
  pick(["Name", "CatalogId"]),
]);

const assignArn = ({ config }) =>
  pipe([
    assign({
      Arn: pipe([
        ({ Name }) =>
          `arn:aws:glue:${
            config.region
          }:${config.accountId()}:database/${Name}`,
      ]),
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignArn({ config }),
    //assignTags({ endpoint, buildArn: buildArn() }),
  ]);

const filterPayload = ({ CatalogId, Tags, ...other }) =>
  pipe([
    () => ({ DatabaseInput: other, CatalogId, Tags }),
    tap((params) => {
      assert(true);
    }),
  ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html
exports.GlueDatabase = () => ({
  type: "Database",
  package: "glue",
  client: "Glue",
  propertiesDefault: {
    CreateTableDefaultPermissions: [
      {
        Permissions: ["ALL"],
        Principal: {
          DataLakePrincipalIdentifier: "IAM_ALLOWED_PRINCIPALS",
        },
      },
    ],
  },
  omitProperties: ["CreateTime", "CatalogId", "Arn"],
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
  // compare: compare({
  //   filterTarget: () => pipe([omit(["compare"])]),
  // }),
  ignoreErrorCodes: ["EntityNotFoundException"],
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        CatalogId: pipe([
          get("CatalogId"),
          replaceAccountAndRegion({ lives, providerConfig }),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#getDatabase-property
  getById: {
    method: "getDatabase",
    getField: "Database",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#getDatabases-property
  getList: {
    method: "getDatabases",
    getParam: "DatabaseList",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#createDatabase-property
  create: {
    filterPayload,
    method: "createDatabase",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#updateDatabase-property
  update: {
    method: "updateDatabase",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        () => payload,
        filterPayload,
        defaultsDeep({ Name: payload.name }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#deleteDatabase-property
  destroy: {
    method: "deleteDatabase",
    pickId,
  },
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ Name: name }), getById({})]),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        // error http 500 when Tags are set
        //Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
