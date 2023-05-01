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

const findName = () =>
  pipe([
    get("name"),
    tap((name) => {
      assert(name);
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

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html
exports.AppSyncGraphqlApi = ({ spec, config }) => {
  const appSync = createAppSync(config);
  const client = AwsClient({ spec, config })(appSync);
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#getGraphqlApi-property
  const getById = client.getById({
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
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#listGraphqlApis-property
  const getList = client.getList({
    method: "listGraphqlApis",
    getParam: "graphqlApis",
    decorate: () => getById({}),
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#createGraphqlApi-property
  const create = client.create({
    method: "createGraphqlApi",
    filterPayload: pipe([omit(["schema", "schemaFile", "apiKeys"])]),
    pickCreated: () => get("graphqlApi"),
    getById,
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
          updateSchema({ endpoint, programOptions, payload }),
        ])()
    ),
    client.update({
      pickId,
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
      method: "updateGraphqlApi",
      filterAll: () => omit(["schema"]),
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
    config,
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
    ])();

  return {
    spec,
    findId,
    getByName,
    getById,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
    tagResource: tagResource({ appSync, property: "arn" }),
    untagResource: untagResource({ appSync, property: "arn" }),
  };
};
