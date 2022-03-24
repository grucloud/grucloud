const assert = require("assert");
const { pipe, tap, get, assign, tryCatch, omit, pick } = require("rubico");
const { first, defaultsDeep } = require("rubico/x");
const path = require("path");

const logger = require("@grucloud/core/logger")({
  prefix: "Layer",
});

const { tos } = require("@grucloud/core/tos");
const { AwsClient } = require("../AwsClient");

const {
  tagsRemoveFromDescription,
  compareAws,
  throwIfNotAwsError,
} = require("../AwsCommon");

const {
  createLambda,
  fetchZip,
  createZipBuffer,
  computeHash256,
} = require("./LambdaCommon");

const findId = get("live.LayerVersionArn");
const findName = get("live.LayerName");
const pickId = pick(["LayerName"]);

exports.Layer = ({ spec, config }) => {
  const lambda = createLambda(config);
  const client = AwsClient({ spec, config })(lambda);

  const decorate = assign({
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
        (params) => lambda().getLayerVersionPolicy(params),
        get("Policy"),
      ]),
      throwIfNotAwsError("ResourceNotFoundException")
    ),
  });

  const getById = client.getById({
    pickId,
    method: "listLayerVersions",
    getField: "LayerVersions",
    ignoreErrorCodes: ["NotFoundException"],
    decorate: ({ live: { LayerName } }) =>
      pipe([defaultsDeep({ LayerName }), decorate]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#listLayers-property
  const getList = client.getList({
    method: "listLayers",
    getParam: "Layers",
    decorate: () =>
      pipe([
        ({ LatestMatchingVersion, ...other }) => ({
          ...LatestMatchingVersion,
          ...other,
        }),
        decorate,
      ]),
  });

  const getByName = ({ name }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${name}`);
      }),
      () => ({ LayerName: name }),
      getList,
      first,
      tap((result) => {
        logger.debug(`getByName result: ${tos(result)}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#publishLayerVersion-property

  const create = client.create({
    filterPayload: (payload) => pipe([() => payload])(),
    method: "publishLayerVersion",
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    getById,
  });

  const update = client.update({
    pickId,
    method: "publishLayerVersion",
    getById,
    config,
    filterParams: ({ pickId, payload, diff, live }) => pipe([() => payload])(),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#deleteLayerVersion-property
  const destroy = client.destroy({
    pickId: ({ Version, LayerName }) => ({ VersionNumber: Version, LayerName }),
    method: "deleteLayerVersion",
    //TODO error codes ?
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
  };
};

exports.compareLayer = pipe([
  compareAws({})({
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
