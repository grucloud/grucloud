const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  eq,
  flatMap,
  assign,
} = require("rubico");
const { defaultsDeep, pluck, prepend } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "AppSyncType" });
const { tos } = require("@grucloud/core/tos");
const { createEndpoint, shouldRetryOnException } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { AwsClient } = require("../AwsClient");

const findId = get("live.arn");
const findName = pipe([
  tap((params) => {
    assert(true);
  }),
  get("live.name"),
]);

const pickId = pipe([
  tap((params) => {
    assert(true);
  }),
  ({ apiId, name }) => ({ apiId, typeName: name }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html
exports.AppSyncType = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const appSync = () => createEndpoint({ endpointName: "AppSync" })(config);

  const findDependencies = ({ live }) => [
    {
      type: "GraphqlApi",
      group: "AppSync",
      ids: [live.apiId],
    },
  ];

  const findNamespace = pipe([
    tap((params) => {
      assert(true);
    }),
    () => "",
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#listTypes-property
  const getList = ({ lives }) =>
    pipe([
      () =>
        lives.getByType({
          providerName: config.providerName,
          type: "GraphqlApi",
          group: "AppSync",
        }),
      pluck("live"),
      flatMap(({ apiId, tags }) =>
        tryCatch(
          pipe([
            () => ({ apiId, format: "JSON" }),
            appSync().listTypes,
            get("types"),
            map(
              pipe([
                defaultsDeep({ apiId }),
                assign({
                  definition: pipe([get("definition"), JSON.parse]),
                  tags: () => tags,
                }),
              ])
            ),
            tap((params) => {
              assert(true);
            }),
          ]),
          (error) =>
            pipe([
              tap(() => {
                logger.error(
                  `error getList listTypes: ${tos({ apiId, error })}`
                );
              }),
              () => ({
                error,
              }),
            ])()
        )()
      ),
    ])();

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#getType-property
  const getById = client.getById({
    pickId,
    extraParams: { format: "JSON" },
    method: "getType",
    getField: "resolver",
    ignoreErrorCodes: ["NotFoundException"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#createType-property
  const create = client.create({
    filterPayload: assign({
      definition: pipe([get("definition"), JSON.stringify]),
    }),
    pickCreated: (payload) => () => pipe([() => payload, pickId])(),
    method: "createType",
    getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#deleteType-property
  const destroy = client.destroy({
    pickId,
    method: "deleteType",
    getById,
    ignoreError: eq(get("code"), "NotFoundException"),
    config,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { definition, ...otherProps },
    dependencies: { graphqlApi },
  }) =>
    pipe([
      tap(() => {
        assert(graphqlApi, "missing 'graphqlApi' dependency");
        assert(definition, "missing 'definition'");
      }),
      () => otherProps,
      defaultsDeep({
        apiId: getField(graphqlApi, "apiId"),
        format: "JSON",
        definition,
      }),
    ])();

  return {
    spec,
    findId,
    findNamespace,
    findDependencies,
    getByName,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
  };
};
