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

const { retryCall } = require("@grucloud/core/Retry");
const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { AwsClient } = require("../AwsClient");
const {
  createAppSync,
  ignoreErrorCodes,
  tagResource,
  untagResource,
} = require("./AppSyncCommon");
const findName = get("live.name");
const findId = get("live.apiId");
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

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html
exports.AppSyncGraphqlApi = ({ spec, config }) => {
  const appSync = createAppSync(config);
  const client = AwsClient({ spec, config })(appSync);

  const findDependencies = ({ live }) => [
    {
      type: "Role",
      group: "IAM",
      ids: [pipe([() => live, get("logConfig.cloudWatchLogsRoleArn")])()],
    },
  ];

  const findNamespace = pipe([() => ""]);

  const getIntrospectionSchema = tryCatch(
    pipe([
      pick(["apiId"]),
      defaultsDeep({ format: "SDL", includeDirectives: true }),
      (params) => appSync().getIntrospectionSchema(params),
      tap((params) => {
        assert(true);
      }),
      get("schema"),
      Buffer.from,
      callProp("toString"),
      tap((params) => {
        assert(true);
      }),
    ]),
    (error) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => "",
      ])()
  );

  const getById = client.getById({
    pickId,
    method: "getGraphqlApi",
    getField: "graphqlApi",
    ignoreErrorCodes,
    decorate: () =>
      pipe([
        assign({
          schema: getIntrospectionSchema,
          apiKeys: pipe([pickId, appSync().listApiKeys, get("apiKeys")]),
        }),
      ]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#listGraphqlApis-property
  const getList = client.getList({
    method: "listGraphqlApis",
    getParam: "graphqlApis",
    decorate: () => getById,
  });

  const getByName = getByNameCore({ getList, findName });

  const updateSchema =
    ({ programOptions, payload }) =>
    ({ apiId, definition }) =>
      pipe([
        tap(() => {
          assert(apiId);
          assert(definition);
        }),
        () => ({ apiId, definition: Buffer.from(definition) }),
        appSync().startSchemaCreation,
        () =>
          retryCall({
            name: `getSchemaCreationStatus: ${apiId}`,
            fn: pipe([() => ({ apiId }), appSync().getSchemaCreationStatus]),
            isExpectedResult: eq(get("status"), "SUCCESS"),
            config,
          }),
        () => ({ apiId }),
        getIntrospectionSchema,
        (content) =>
          fs.writeFile(
            resolveSchemaFile({
              programOptions,
              schemaFile: payload.schemaFile,
            }),
            content
          ),
      ])();

  const createApiKeys = ({ apiId, apiKeys = [] }) =>
    pipe([
      () => apiKeys,
      map(
        tryCatch(
          pipe([defaultsDeep({ apiId }), appSync().createApiKey]),
          (error) => {
            throw error;
          }
        )
      ),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#createGraphqlApi-property
  const create = client.create({
    method: "createGraphqlApi",
    filterPayload: pipe([omit(["schema", "schemaFile", "apiKeys"])]),
    pickCreated: () => get("graphqlApi"),
    getById,
    postCreate:
      ({ name, payload, programOptions }) =>
      ({ apiId }) =>
        pipe([
          tap(() => {
            assert(apiId);
            assert(payload.schema);
          }),
          () => createApiKeys({ apiId, apiKeys: payload.apiKeys }),
          () => ({ apiId, definition: payload.schema }),
          updateSchema({ payload, programOptions }),
        ])(),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#updateGraphqlApi-property
  const update = pipe([
    tap((params) => {
      assert(true);
    }),
    tap.if(
      get("diff.liveDiff.updated.schema"),
      ({ id, diff, payload, programOptions }) =>
        pipe([
          // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#startSchemaCreation-property
          () => ({
            apiId: id,
            definition: diff.liveDiff.updated.schema,
          }),
          updateSchema({ programOptions, payload }),
        ])()
    ),
    client.update({
      pickId,
      filterParams: ({ pickId, payload, diff, live }) =>
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
      method: "updateGraphqlApi",
      filterAll: omit(["schema"]),
      getById,
      config,
    }),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#deleteGraphqlApi-property
  const destroy = client.destroy({
    pickId,
    method: "deleteGraphqlApi",
    getById,
    ignoreErrorCodes,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { tags, schemaFile, ...otherProps },
    dependencies: { cloudWatchLogsRole },
    programOptions,
  }) =>
    pipe([
      () => ({}),
      defaultsDeep(otherProps),
      when(
        () => cloudWatchLogsRole,
        assign({
          logConfig: () => ({
            fieldLogLevel: "NONE",
            excludeVerboseContent: true,
            cloudWatchLogsRoleArn: getField(cloudWatchLogsRole, "Arn"),
          }),
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
      tap((params) => {
        assert(true);
      }),
    ])();

  return {
    spec,
    findId,
    findNamespace,
    findDependencies,
    getByName,
    getById,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
    tagResource: tagResource({ appSync }),
    untagResource: untagResource({ appSync }),
  };
};
