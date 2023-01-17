const assert = require("assert");
const { pipe, tap, get, assign, pick } = require("rubico");
const { defaultsDeep, first, pluck, when } = require("rubico/x");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./AppStreamCommon");

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

const decorate =
  ({ endpoint, config }) =>
  (live) =>
    pipe([
      () => live,
      JSON.stringify,
      JSON.parse,
      omitIfEmpty(["StackErrors", "AccessEndpoints"]),
      assignTags({ endpoint, buildArn: buildArn() }),
      assign({
        FleetName: pipe([
          tap(({ Name }) => {
            assert(Name);
          }),
          ({ Name }) => ({
            StackName: Name,
          }),
          endpoint().listAssociatedFleets,
          get("Names"),
          first,
        ]),
      }),
    ])();

const disassociateFleet = ({ endpoint }) =>
  tap(
    pipe([
      when(
        get("FleetName"),
        pipe([
          ({ FleetName, Name }) => ({
            FleetName: FleetName,
            StackName: Name,
          }),
          endpoint().disassociateFleet,
        ])
      ),
    ])
  );

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html
exports.AppStreamStack = () => ({
  type: "Stack",
  package: "appstream",
  client: "AppStream",
  propertiesDefault: {
    UserSettings: [
      {
        Action: "CLIPBOARD_COPY_FROM_LOCAL_DEVICE",
        Permission: "ENABLED",
      },
      {
        Action: "CLIPBOARD_COPY_TO_LOCAL_DEVICE",
        Permission: "ENABLED",
      },
      {
        Action: "FILE_UPLOAD",
        Permission: "ENABLED",
      },
      {
        Action: "FILE_DOWNLOAD",
        Permission: "ENABLED",
      },
      {
        Action: "PRINTING_TO_LOCAL_DEVICE",
        Permission: "ENABLED",
      },
      {
        Action: "DOMAIN_PASSWORD_SIGNIN",
        Permission: "ENABLED",
      },
      {
        Action: "DOMAIN_SMART_CARD_SIGNIN",
        Permission: "DISABLED",
      },
    ],
  },
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
      get("Name"),
      tap((id) => {
        assert(id);
      }),
    ]),
  omitProperties: [
    "Arn",
    "CreatedTime",
    "ApplicationSettings.S3BucketName",
    "StorageConnectors[].ResourceIdentifier",
  ],
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependsOnTypeOnly: true,
    },
    fleet: {
      type: "Fleet",
      group: "AppStream",
      dependencyId: ({ lives, config }) => pipe([get("FleetName")]),
    },
    vpcEndpoints: {
      type: "VpcEndpoint",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("AccessEndpoints"), pluck("VpceId")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#describeStacks-property
  getById: {
    method: "describeStacks",
    getField: "Stacks",
    pickId: pipe([
      tap(({ Name }) => {
        assert(Name);
      }),
      ({ Name }) => ({ Names: [Name] }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#describeStacks-property
  getList: {
    method: "describeStacks",
    getParam: "Stacks",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#createStack-property
  create: {
    method: "createStack",
    pickCreated: ({ payload }) => pipe([get("Stack")]),
    shouldRetryOnExceptionMessages: [
      "AppStream 2.0 encountered an error because your service role",
    ],
    postCreate:
      ({ endpoint, payload, resolvedDependencies: { fleet } }) =>
      (live) =>
        pipe([
          when(
            () => fleet,
            pipe([
              () => ({
                FleetName: fleet.config.Name,
                StackName: live.Name,
              }),
              tap(({ FleetName, StackName }) => {
                assert(FleetName);
                assert(StackName);
              }),
              endpoint().associateFleet,
            ])
          ),
        ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#updateStack-property
  update: {
    method: "updateStack",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#deleteStack-property
  destroy: {
    preDestroy: disassociateFleet,
    method: "deleteStack",
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
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
