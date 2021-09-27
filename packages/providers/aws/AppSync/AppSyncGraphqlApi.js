const assert = require("assert");
const { assign, pipe, tap, get, eq, pick, omit } = require("rubico");
const { defaultsDeep, callProp, when } = require("rubico/x");

const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const { createEndpoint, shouldRetryOnException } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");

const findName = get("live.name");
const findId = get("live.apiId");
const pickId = pick(["apiId"]);

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

  const getById = client.getById({
    pickId,
    method: "getGraphqlApi",
    getField: "graphqlApi",
    ignoreErrorCodes: ["NotFoundException"],
    decorate: () =>
      pipe([
        assign({
          schema: pipe([
            pick(["apiId"]),
            defaultsDeep({ format: "SDL", includeDirectives: true }),
            appSync().getIntrospectionSchema,
            get("schema"),
            callProp("toString"),
          ]),
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#createGraphqlApi-property
  const create = client.create({
    method: "createGraphqlApi",
    pickCreated: () => pipe([get("graphqlApi"), pickId]),
    pickId,
    getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#updateGraphqlApi-property
  const update = pipe([
    tap((params) => {
      assert(true);
    }),
    tap.if(
      get("diff.liveDiff.updated.schema"),
      pipe([
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#startSchemaCreation-property
        ({ id, diff }) => ({
          apiId: id,
          definition: diff.liveDiff.updated.schema,
        }),
        appSync().startSchemaCreation,
        tap((params) => {
          assert(true);
        }),
      ])
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
          omit(["schema", "tags"]),
          defaultsDeep(pick(["apiId", "name"])(live)),
          tap((params) => {
            assert(true);
          }),
        ])(),
      method: "updateGraphqlApi",
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

  const configDefault = ({ name, namespace, properties, dependencies: {} }) =>
    pipe([
      () => properties,
      defaultsDeep({
        name,
        tags: buildTagsObject({ config, namespace, name }),
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
