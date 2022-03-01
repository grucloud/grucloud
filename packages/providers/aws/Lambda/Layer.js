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
const { buildTagsObject } = require("@grucloud/core/Common");
const { AwsClient } = require("../AwsClient");

const {
  createEndpoint,
  shouldRetryOnException,
  tagsExtractFromDescription,
  tagsRemoveFromDescription,
  compareAws,
} = require("../AwsCommon");

const findId = get("live.LayerArn");
const findName = get("live.LayerName");
const pickId = pick(["LayerName"]);

const { fetchZip, createZipBuffer, computeHash256 } = require("./LambdaCommon");

exports.Layer = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const lambda = () => createEndpoint({ endpointName: "Lambda" })(config);

  const decorate = assign({
    Tags: tagsExtractFromDescription,
    Description: tagsRemoveFromDescription,
    Content: ({ LayerVersionArn }) =>
      pipe([
        tap((params) => {
          assert(LayerVersionArn);
        }),
        () => ({ Arn: LayerVersionArn }),
        lambda().getLayerVersionByArn,
        get("Content"),
        assign({
          Data: fetchZip(),
        }),
      ])(),
    Policy: tryCatch(
      pipe([
        tap(({ LayerName, Version }) => {
          assert(LayerName);
          assert(Version);
        }),
        ({ LayerName, Version }) => ({
          LayerName,
          VersionNumber: Version,
        }),
        lambda().getLayerVersionPolicy,
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
  });

  const getById = client.getById({
    pickId,
    method: "listLayerVersions",
    getField: "LayerVersions",
    ignoreErrorCodes: ["NotFoundException"],
    decorate: ({ LayerName }) =>
      pipe([
        tap((params) => {
          assert(LayerName);
        }),
        defaultsDeep({ LayerName }),
        decorate,
      ]),
  });

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
      map(decorate),
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

  // TODO update
  const update = client.update({
    pickId,
    method: "publishLayerVersion",
    getById,
    config,
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([() => payload, omit(["Tags"])])(),
  });

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
      () => ({
        localPath: path.resolve(programOptions.workingDirectory, name),
      }),
      createZipBuffer,
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
  compareAws({
    filterTarget: () =>
      pipe([
        assign({
          Content: pipe([
            get("Content"),
            assign({
              CodeSha256: pipe([get("ZipFile"), computeHash256]),
            }),
          ]),
        }),
        pick(["Content.CodeSha256", "Description", "CompatibleRuntimes"]),
      ]),
    filterLive: () =>
      pipe([pick(["CompatibleRuntimes", "Description", "Content.CodeSha256"])]),
  }),
  tap((diff) => {
    logger.debug(`compareLayer ${tos(diff)}`);
  }),
]);
