const assert = require("assert");
const {
  map,
  pipe,
  tap,
  get,
  eq,
  not,
  assign,
  tryCatch,
  or,
  omit,
  switchCase,
} = require("rubico");
const {
  callProp,
  first,
  last,
  identity,
  defaultsDeep,
  isEmpty,
  size,
  includes,
  unless,
} = require("rubico/x");
const crypto = require("crypto");
const path = require("path");

const { detailedDiff } = require("deep-object-diff");

const logger = require("@grucloud/core/logger")({
  prefix: "Layer",
});

const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { buildTagsObject } = require("@grucloud/core/Common");

const {
  createEndpoint,
  shouldRetryOnException,
  tagsExtractFromDescription,
  tagsRemoveFromDescription,
} = require("../AwsCommon");

const findId = get("live.LayerArn");
const findName = get("live.LayerName");

const { fetchZip, createZipBuffer } = require("./LambdaCommon");

exports.Layer = ({ spec, config }) => {
  const lambda = () => createEndpoint({ endpointName: "Lambda" })(config);

  const listLayers = ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`listLayers ${tos(params)}`);
      }),
      () => lambda().listLayers(params),
      get("Layers"),
      tap((params) => {
        assert(true);
      }),
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
      (items = []) => ({
        total: size(items),
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList: #total: ${total}`);
      }),
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

  const isUpByName = pipe([getByName, not(isEmpty)]);

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
  const destroy = ({ name, live }) =>
    pipe([
      tap(() => {
        logger.info(`deleteLayerVersion ${JSON.stringify({ name })}`);
      }),
      () => live,
      get("Version"),
      (VersionNumber) => ({ LayerName: name, VersionNumber }),
      (params) => lambda().deleteLayerVersion(params),
      tap(() => {
        logger.info(`destroyed layer${JSON.stringify({ name })}`);
      }),
    ])();

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
    getList,
    configDefault,
    shouldRetryOnException,
  };
};

const filterTarget = ({ target }) => pipe([() => target, omit(["Tags"])])();
const filterLive = ({ live }) => pipe([() => live, omit(["Tags"])])();

const computeHash256 = ({ target }) =>
  pipe([
    () => crypto.createHash("sha256"),
    (hash256) =>
      pipe([
        () => hash256.update(target.Content.ZipFile),
        () => hash256.digest("base64"),
      ])(),
  ])();

const isEqualHash256 = ({ target, live }) =>
  pipe([
    () => computeHash256({ target }),
    eq(identity, live.Content.CodeSha256),
  ])();

exports.compareLayer = pipe([
  assign({
    target: filterTarget,
    live: filterLive,
  }),
  ({ target, live }) => ({
    targetDiff: pipe([
      () => detailedDiff(target, live),
      omit(["added", "deleted"]),
      unless(
        () => isEqualHash256({ target, live }),
        assign({ updated: () => ({ CodeSha256: live.Content.CodeSha256 }) })
      ),
      tap((params) => {
        assert(true);
      }),
    ])(),
    liveDiff: pipe([
      () => detailedDiff(target, live),
      omit(["added", "deleted"]),
      tap((params) => {
        assert(true);
      }),
      unless(
        () => isEqualHash256({ target, live }),
        assign({ updated: () => ({ CodeSha256: computeHash256({ target }) }) })
      ),
    ])(),
  }),
  tap((diff) => {
    logger.debug(`compareLayer ${tos(diff)}`);
  }),
]);
