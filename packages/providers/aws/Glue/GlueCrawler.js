const assert = require("assert");
const { pipe, tap, get, pick, assign, eq, map } = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");

const { buildTagsObject, omitIfEmpty } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
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
  pick(["Name"]),
]);

const assignArn = ({ config }) =>
  pipe([
    assign({
      Arn: pipe([
        ({ Name }) =>
          `arn:aws:glue:${config.region}:${config.accountId()}:crawler/${Name}`,
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
    omitIfEmpty([
      "Classifiers",
      "Targets.CatalogTargets",
      "Targets.DeltaTargets",
      "Targets.DynamoDBTargets",
      "Targets.JdbcTargets",
      "Targets.MongoDBTargets",
      "Targets.S3Targets[].Exclusions",
    ]),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html
exports.GlueCrawler = () => ({
  type: "Crawler",
  package: "glue",
  client: "Glue",
  propertiesDefault: {
    LakeFormationConfiguration: {
      AccountId: "",
      UseLakeFormationCredentials: false,
    },
    LineageConfiguration: {
      CrawlerLineageSettings: "DISABLE",
    },
    RecrawlPolicy: {
      RecrawlBehavior: "CRAWL_EVERYTHING",
    },
    SchemaChangePolicy: {
      DeleteBehavior: "DEPRECATE_IN_DATABASE",
      UpdateBehavior: "UPDATE_IN_DATABASE",
    },
  },
  omitProperties: [
    "Arn",
    "DatabaseName",
    "CreationTime",
    "CrawlElapsedTime",
    "LastUpdated",
    "State",
    "Version",
    "Role",
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
  // compare: compare({
  //   filterTarget: () => pipe([omit(["compare"])]),
  // }),
  ignoreErrorCodes: ["EntityNotFoundException"],
  dependencies: {
    database: {
      type: "Database",
      group: "Glue",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("DatabaseName"),
          lives.getByName({
            type: "Database",
            group: "Glue",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("Role"),
          callProp("replace", "service-role/", ""),
          lives.getByName({
            type: "Role",
            group: "IAM",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
    s3Buckets: {
      type: "Bucket",
      group: "S3",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("Targets.S3Targets"),
          map(
            pipe([
              get("Path"),
              callProp("replace", "s3://", ""),
              lives.getById({
                type: "Bucket",
                group: "S3",
                providerName: config.providerName,
              }),
              get("id"),
            ])
          ),
        ]),
    },
  },
  // filterLive: ({ lives, providerConfig }) =>
  //   pipe([
  //     assign({
  //       CatalogId: pipe([
  //         get("CatalogId"),
  //         replaceAccountAndRegion({ lives, providerConfig }),
  //       ]),
  //     }),
  //   ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#getCrawler-property
  getById: {
    method: "getCrawler",
    getField: "Crawler",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#getCrawlers-property
  getList: {
    method: "getCrawlers",
    getParam: "Crawlers",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#createCrawler-property
  create: {
    method: "createCrawler",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([eq(get("State"), "READY")]),
    shouldRetryOnExceptionMessages: ["Service is unable to assume role"],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#updateCrawler-property
  update: {
    method: "updateCrawler",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#deleteCrawler-property
  destroy: {
    method: "deleteCrawler",
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
    dependencies: { iamRole, database },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(database);
        assert(iamRole);
      }),
      () => otherProps,
      defaultsDeep({
        // error http 500 when Tags are set
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
        DatabaseName: getField(database, "Name"),
        Role: getField(iamRole, "Arn"),
      }),
    ])(),
});
