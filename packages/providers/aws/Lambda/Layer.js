const assert = require("assert");
const {
  map,
  pipe,
  tap,
  get,
  eq,
  assign,
  tryCatch,
  omit,
  switchCase,
  pick,
} = require("rubico");
const { first, defaultsDeep } = require("rubico/x");
const path = require("path");

const logger = require("@grucloud/core/logger")({
  prefix: "Layer",
});

const { tos } = require("@grucloud/core/tos");
const { buildTagsObject, compare } = require("@grucloud/core/Common");
const { AwsClient } = require("../AwsClient");

const {
  createEndpoint,
  shouldRetryOnException,
  tagsExtractFromDescription,
  tagsRemoveFromDescription,
} = require("../AwsCommon");

const findId = get("live.LayerArn");
const findName = get("live.LayerName");

const { fetchZip, createZipBuffer, computeHash256 } = require("./LambdaCommon");

exports.Layer = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const lambda = () => createEndpoint({ endpointName: "Lambda" })(config);

  const listLayers = ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`listLayers ${tos(params)}`);
      }),
      () => lambda().listLayers(params),
      get("Layers"),
      map(({ LatestMatchingVersion, ...other }) => ({
        ...LatestMatchingVersion,
        ...other,
      })),
      map(
        assign({
          Tags: tagsExtractFromDescription,
          Description: tagsRemoveFromDescription,
          Content: ({ LayerVersionArn }) =>
            pipe([
              () => lambda().getLayerVersionByArn({ Arn: LayerVersionArn }),
              get("Content"),
              assign({
                Data: fetchZip(),
              }),
            ])(),
          Policy: tryCatch(
            pipe([
              ({ LayerName, Version }) =>
                lambda().getLayerVersionPolicy({
                  LayerName,
                  VersionNumber: Version,
                }),
              tap((params) => {
                assert(true);
              }),
              get("Policy"),
            ]),
            (error) =>
              pipe([
                () => error,
                switchCase([
                  eq(get("code"), "ResourceNotFoundException"),
                  () => undefined,
                  () => {
                    throw error;
                  },
                ]),
              ])()
          ),
        })
      ),
      tap((results) => {
        logger.debug(`listLayers: result: ${tos(results)}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#listLayers-property
  const getList = () =>
    pipe([
      tap(() => {
        logger.info(`getList layer`);
      }),
      listLayers,
    ])();

  const getByName = ({ name }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${name}`);
      }),
      () => listLayers({ LayerName: name }),
      first,
      tap((result) => {
        logger.debug(`getByName result: ${tos(result)}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#publishLayerVersion-property
  const create = ({ name, payload }) =>
    pipe([
      tap(() => {
        logger.info(`create layer: ${name}`);
        logger.debug(tos(payload));
      }),
      () => payload,
      omit(["Tags"]),
      assign({
        Description: ({ Description }) =>
          `${Description} tags:${JSON.stringify(payload.Tags)}`,
      }),
      lambda().publishLayerVersion,
      tap((xxx) => {
        logger.info(`created layer ${name}`);
      }),
    ])();

  const update = ({ name, payload, diff, live }) =>
    pipe([
      tap(() => {
        logger.info(`update function: ${name}`);
        logger.debug(tos({ payload, diff, live }));
      }),
      () => payload,
      (params) => lambda().publishLayerVersion(params),
      tap(() => {
        logger.info(`updated function ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#deleteLayerVersion-property
  const destroy = client.destroy({
    pickId: ({ Version, LayerName }) => ({ VersionNumber: Version, LayerName }),
    method: "deleteLayerVersion",
    config,
  });

  const configDefault = ({
    name,
    properties: { Tags, ...otherProps },
    namespace,
    programOptions,
  }) =>
    pipe([
      () =>
        createZipBuffer({
          localPath: path.resolve(programOptions.workingDirectory, name),
        }),
      (ZipFile) =>
        pipe([
          () => otherProps,
          defaultsDeep({
            LayerName: name,
            Tags: buildTagsObject({ name, namespace, config, userTags: Tags }),
            Content: { ZipFile },
          }),
        ])(),
    ])();

  return {
    spec,
    findName,
    findId,
    create,
    update,
    destroy,
    getByName,
    //getById,
    getList,
    configDefault,
    shouldRetryOnException,
  };
};

exports.compareLayer = pipe([
  tap((params) => {
    assert(true);
  }),
  compare({
    filterAll: pipe([omit(["Tags"])]),
    filterTarget: pipe([
      tap((params) => {
        assert(true);
      }),
      assign({ CodeSha256: pipe([get("Content.ZipFile"), computeHash256]) }),
      pick(["Description", "CompatibleRuntimes"]),
    ]),
    filterLive: pipe([
      tap((params) => {
        assert(true);
      }),
      pick(["CompatibleRuntimes", "Description"]),
      tap((params) => {
        assert(true);
      }),
    ]),
  }),
  tap((diff) => {
    logger.debug(`compareLayer ${tos(diff)}`);
  }),
]);
