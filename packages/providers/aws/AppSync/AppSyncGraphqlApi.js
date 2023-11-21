const assert = require("assert");
const fs = require("fs").promises;
const path = require("path");
const {
  map,
  assign,
  pipe,
  tap,
  get,
  eq,
  pick,
  omit,
  tryCatch,
} = require("rubico");
const { defaultsDeep, callProp, when } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { retryCall } = require("@grucloud/core/Retry");

const { replaceRegionAll } = require("../AwsCommon");
const { Tagger, ignoreErrorCodes } = require("./AppSyncCommon");

const findName = () =>
  pipe([
    get("name"),
    tap((name) => {
      assert(name);
    }),
  ]);

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const findId = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ apiId }) => {
    assert(apiId);
  }),
  pick(["apiId"]),
]);

const resolveSchemaFile = ({ programOptions, schemaFile }) =>
  pipe([
    tap(() => {
      assert(schemaFile);
      assert(programOptions.workingDirectory);
    }),
    () => path.resolve(programOptions.workingDirectory, schemaFile),
  ])();

const getIntrospectionSchema = ({ endpoint }) =>
  tryCatch(
    pipe([
      pick(["apiId"]),
      defaultsDeep({ format: "SDL", includeDirectives: true }),
      endpoint().getIntrospectionSchema,
      get("schema"),
      Buffer.from,
      callProp("toString"),
    ]),
    (error) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => "",
      ])()
  );

const createApiKeys =
  ({ endpoint }) =>
  ({ apiId, apiKeys = [] }) =>
    pipe([
      () => apiKeys,
      map(
        tryCatch(
          pipe([
            //
            defaultsDeep({ apiId }),
            endpoint().createApiKey,
          ]),
          (error) => {
            throw error;
          }
        )
      ),
    ])();

const updateSchema =
  ({ endpoint, programOptions, payload, config }) =>
  ({ apiId, definition }) =>
    pipe([
      tap(() => {
        assert(endpoint);
        assert(programOptions);
        assert(apiId);
        assert(definition);
      }),
      () => ({ apiId, definition: Buffer.from(definition) }),
      endpoint().startSchemaCreation,
      () =>
        retryCall({
          name: `getSchemaCreationStatus: ${apiId}`,
          fn: pipe([() => ({ apiId }), endpoint().getSchemaCreationStatus]),
          isExpectedResult: eq(get("status"), "SUCCESS"),
          config,
        }),
      () => ({ apiId }),
      getIntrospectionSchema({ endpoint }),
      //TODO do not write if empty
      (content) =>
        fs.writeFile(
          resolveSchemaFile({
            programOptions,
            schemaFile: payload.schemaFile,
          }),
          content
        ),
    ])();

const writeGraphqlSchema =
  ({ programOptions, commandOptions }) =>
  ({ lives, resource }) =>
    pipe([
      tap((params) => {
        assert(programOptions);
        assert(lives);
        assert(resource);
      }),
      () => resource,
      get("live.schema"),
      (content) =>
        tryCatch(
          pipe([
            () =>
              graphqlSchemaFilePath({
                programOptions,
                commandOptions,
                resource,
              }),
            tap((filePath) => {
              console.log("Writing graphql schema:", filePath);
            }),
            (filePath) => fs.writeFile(filePath, content),
          ]),
          (error) => {
            console.error("Error writing graphql schema", error);
            throw error;
          }
        )(),
    ])();

const graphqlSchemaFilePath = ({ programOptions, commandOptions, resource }) =>
  path.resolve(programOptions.workingDirectory, `${resource.name}.graphql`);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html
exports.AppSyncGraphqlApi = ({ compare }) => ({
  type: "GraphqlApi",
  package: "appsync",
  client: "AppSync",
  propertiesDefault: {},
  inferName: () => get("name"),
  omitProperties: [
    "apiId",
    "arn",
    "uris",
    "wafWebAclArn",
    "logConfig.cloudWatchLogsRoleArn",
  ],
  compare: compare({
    filterTarget: () => pipe([omit(["schemaFile"])]),
    filterLive: () =>
      pipe([
        assign({
          apiKeys: pipe([get("apiKeys"), map(pick(["description"]))]),
        }),
      ]),
  }),
  filterLive: (input) => (live) =>
    pipe([
      () => input,
      tap(writeGraphqlSchema(input)),
      () => live,
      pick([
        "name",
        "authenticationType",
        "openIDConnectConfig",
        //"userPoolConfig", no longer returned
        "xrayEnabled",
        "logConfig",
        "apiKeys",
        "additionalAuthenticationProviders",
      ]),
      assign({
        schemaFile: () => `${live.name}.graphql`,
        apiKeys: pipe([get("apiKeys"), map(pick(["description"]))]),
      }),
      when(
        get("additionalAuthenticationProviders"),
        assign({
          additionalAuthenticationProviders: pipe([
            get("additionalAuthenticationProviders"),
            map(
              assign({
                userPoolConfig: pipe([
                  get("userPoolConfig"),
                  assign({
                    awsRegion: pipe([
                      get("awsRegion"),
                      replaceRegionAll(input),
                    ]),
                    userPoolId: pipe([
                      get("userPoolId"),
                      replaceWithName({
                        groupType: "CognitoIdentityServiceProvider::UserPool",
                        path: "id",
                        ...input,
                      }),
                    ]),
                  }),
                ]),
              })
            ),
          ]),
        })
      ),
    ])(),
  dependencies: {
    cloudWatchLogsRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        get("logConfig.cloudWatchLogsRoleArn"),
    },
    userPools: {
      type: "UserPool",
      group: "CognitoIdentityServiceProvider",
      list: true,
      dependencyIds: () =>
        pipe([
          get("additionalAuthenticationProviders"),
          map(get("userPoolConfig.userPoolId")),
        ]),
    },
  },
  findName,
  findId,
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#getGraphqlApi-property
  getById: {
    pickId,
    method: "getGraphqlApi",
    getField: "graphqlApi",
    ignoreErrorCodes,
    decorate: ({ endpoint }) =>
      pipe([
        assign({
          //TODO
          schema: getIntrospectionSchema({ endpoint }),
          apiKeys: pipe([pickId, endpoint().listApiKeys, get("apiKeys")]),
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#listGraphqlApis-property
  getList: {
    method: "listGraphqlApis",
    getParam: "graphqlApis",
    decorate: ({ getById, endpoint }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#createGraphqlApi-property
  create: {
    method: "createGraphqlApi",
    filterPayload: pipe([omit(["schema", "schemaFile", "apiKeys"])]),
    pickCreated: () => get("graphqlApi"),
    postCreate:
      ({ name, payload, programOptions, endpoint, config }) =>
      ({ apiId }) =>
        pipe([
          tap(() => {
            assert(apiId);
            assert(payload);
            assert(payload.schema);
            assert(config);
          }),
          () => ({ apiId, apiKeys: payload.apiKeys }),
          createApiKeys({ endpoint }),
          () => ({ apiId, definition: payload.schema }),
          updateSchema({ endpoint, payload, programOptions, config }),
        ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#updateGraphqlApi-property
  update: {
    method: "updateGraphqlApi",
    preUpdate: ({ endpoint, payload, live, diff }) =>
      pipe([
        tap((params) => {
          assert(endpoint);
          assert(payload);
          assert(live);
          assert(diff);
        }),
        () => diff,
        tap.if(
          get("liveDiff.updated.schema"),
          ({ id, diff, payload, programOptions }) =>
            pipe([
              tap((params) => {
                assert(id);
              }),
              // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#startSchemaCreation-property
              () => ({
                apiId: id,
                definition: diff.liveDiff.updated.schema,
              }),
              updateSchema({ endpoint, programOptions, payload }),
            ])()
        ),
      ]),
    filterParams: ({ payload, diff, live }) =>
      pipe([
        tap((params) => {
          assert(payload);
          assert(live);
        }),
        () => payload,
        omit(["schema", "schemaFile", "tags", "apiKeys"]),
        defaultsDeep(pick(["apiId", "name"])(live)),
        tap((params) => {
          assert(true);
        }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#deleteGraphqlApi-property
  destroy: {
    pickId,
    method: "deleteGraphqlApi",
    ignoreErrorCodes,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, schemaFile, ...otherProps },
    dependencies: { cloudWatchLogsRole },
    config,
    programOptions,
  }) =>
    pipe([
      () => ({}),
      defaultsDeep(otherProps),
      when(
        () => cloudWatchLogsRole,
        defaultsDeep({
          logConfig: {
            cloudWatchLogsRoleArn: getField(cloudWatchLogsRole, "Arn"),
          },
        })
      ),
      defaultsDeep({
        name,
        tags: buildTagsObject({ config, namespace, name, userTags: tags }),
        schemaFile,
      }),
      assign({
        schema: pipe([
          () =>
            resolveSchemaFile({
              programOptions,
              schemaFile,
            }),
          (schemaFileFull) =>
            tryCatch(
              pipe([() => fs.readFile(schemaFileFull, "utf-8")]),
              (error) => {
                console.error(
                  `Problem reading or parsing ${schemaFileFull}, error:`,
                  error
                );
                throw error;
              }
            )(),
        ]),
      }),
      tap(({ schema }) => {
        assert(schema, `empty graphql schema`);
      }),
    ])(),
});
