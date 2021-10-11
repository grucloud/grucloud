const assert = require("assert");
const fs = require("fs").promises;
const path = require("path");
const { assign, pipe, tap, get, eq, pick, omit, tryCatch } = require("rubico");
const { defaultsDeep, callProp, when } = require("rubico/x");

const { retryCall } = require("@grucloud/core/Retry");
const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const { createEndpoint, shouldRetryOnException } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");

const findName = get("live.name");
const findId = get("live.apiId");
const pickId = pick(["apiId"]);

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
  const client = AwsClient({ spec, config });
  const appSync = () => createEndpoint({ endpointName: "AppSync" })(config);

  const findDependencies = ({ live }) => [];

  const findNamespace = pipe([
    tap((params) => {
      assert(true);
    }),
    () => "",
  ]);

  const getIntrospectionSchema = tryCatch(
    pipe([
      pick(["apiId"]),
      defaultsDeep({ format: "SDL", includeDirectives: true }),
      appSync().getIntrospectionSchema,
      get("schema"),
      callProp("toString"),
    ]),
    (error) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => ({
          error,
        }),
      ])()
  );

  const getById = client.getById({
    pickId,
    method: "getGraphqlApi",
    getField: "graphqlApi",
    ignoreErrorCodes: ["NotFoundException"],
    decorate: () =>
      pipe([
        assign({
          schema: getIntrospectionSchema,
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
        () => ({ apiId, definition }),
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#createGraphqlApi-property
  const create = client.create({
    method: "createGraphqlApi",
    filterPayload: pipe([omit(["schema", "schemaFile"])]),
    pickCreated: () => pipe([get("graphqlApi"), pickId]),
    pickId,
    getById,
    config,
    postCreate: ({ name, payload, programOptions }) =>
      tap.if(
        () => payload.schema,
        pipe([
          tap(({ apiId }) => {
            assert(apiId);
          }),
          ({ apiId }) => ({ apiId, definition: payload.schema }),
          updateSchema({ payload, programOptions }),
        ])
      ),
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
          omit(["schema", "schemaFile", "tags"]),
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
    ignoreError: eq(get("code"), "NotFoundException"),
    config,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { tags, schemaFile, ...otherProps },
    dependencies: {},
    programOptions,
  }) =>
    pipe([
      () => otherProps,
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
    shouldRetryOnException,
  };
};
