const assert = require("assert");
const {
  pipe,
  tap,
  get,
  assign,
  tryCatch,
  omit,
  pick,
  fork,
} = require("rubico");
const { defaultsDeep, size, callProp } = require("rubico/x");

const AdmZip = require("adm-zip");
const path = require("path");
const os = require("os");

const { getByNameCore } = require("@grucloud/core/Common");

const logger = require("@grucloud/core/logger")({
  prefix: "Layer",
});

const { compareAws, throwIfNotAwsError } = require("../AwsCommon");
const { sortStatements } = require("../IAM/AwsIamCommon");
const { fetchZip, createZipBuffer, computeHash256 } = require("./LambdaCommon");

const createTempDir = () => os.tmpdir();

const pickId = pick(["LayerName"]);

const decorate = ({ endpoint }) =>
  assign({
    Content: ({ LayerVersionArn }) =>
      pipe([
        tap((params) => {
          assert(LayerVersionArn);
        }),
        () => ({ Arn: LayerVersionArn }),
        endpoint().getLayerVersionByArn,
        get("Content"),
        assign({
          Data: pipe([get("Location"), fetchZip()]),
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
        endpoint().getLayerVersionPolicy,
        get("Policy"),
        sortStatements,
      ]),
      throwIfNotAwsError("ResourceNotFoundException")
    ),
  });

//CloudWatch Synthetics
const managedByOther = ({ lives, config }) =>
  pipe([get("LayerName"), callProp("startsWith", "cwsyn")]);

exports.LambdaLayer = () => ({
  type: "Layer",
  package: "lambda",
  client: "Lambda",
  propertiesDefault: {},
  omitProperties: [],
  managedByOther,
  inferName: () =>
    pipe([
      get("LayerName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("LayerName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("LayerVersionArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  compare: compareLayer,
  displayResource: () =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      //TODO check
      omit(["Content.Data", "Content.ZipFile"]),
    ]),
  filterLive:
    ({ resource, programOptions }) =>
    (live) =>
      pipe([
        tap(() => {
          assert(resource.name);
          assert(live.Content.Data);
        }),
        () => live,
        pick(["LayerName", "Description", "CompatibleRuntimes", "LicenseInfo"]),
        tap(
          pipe([
            fork({
              zip: () => new AdmZip(Buffer.from(live.Content.Data, "base64")),
              zipFile: () =>
                path.resolve(createTempDir(), `${resource.name}.zip`),
            }),
            tap(({ zipFile }) => {
              logger.debug(`zip written to`, zipFile);
            }),
            ({ zip, zipFile }) => zip.writeZip(zipFile),
          ])
        ),
        tap(
          pipe([
            () => new AdmZip(Buffer.from(live.Content.Data, "base64")),
            (zip) =>
              zip.extractAllTo(
                path.resolve(programOptions.workingDirectory, resource.name),
                true
              ),
          ])
        ),
      ])(),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#listLayerVersions-property
  getById: {
    pickId,
    method: "listLayerVersions",
    getField: "LayerVersions",
    ignoreErrorCodes: ["NotFoundException"],
    decorate: ({ live: { LayerName }, endpoint }) =>
      pipe([defaultsDeep({ LayerName }), decorate({ endpoint })]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#listLayers-property
  getList: {
    method: "listLayers",
    getParam: "Layers",
    decorate: ({ endpoint }) =>
      pipe([
        ({ LatestMatchingVersion, ...other }) => ({
          ...LatestMatchingVersion,
          ...other,
        }),
        decorate({ endpoint }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#publishLayerVersion-property
  create: {
    filterPayload: (payload) => pipe([() => payload])(),
    method: "publishLayerVersion",
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#updateLayer-property
  update: {
    pickId,
    method: "publishLayerVersion",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#deleteLayer-property
  destroy: {
    pickId: ({ Version, LayerName }) => ({ VersionNumber: Version, LayerName }),
    method: "deleteLayerVersion",
  },
  getByName: getByNameCore,
  // tagger: ({ config }) =>
  //   Tagger({
  //     buildArn: buildArn({ config }),
  //   }),
  configDefault: ({
    name,
    properties: { Tags, ...otherProps },
    namespace,
    programOptions,
    config,
  }) =>
    pipe([
      () => ({
        localPath: path.resolve(programOptions.workingDirectory, name),
      }),
      createZipBuffer,
      (ZipFile) =>
        pipe([
          tap((params) => {
            assert(ZipFile);
          }),
          () => otherProps,
          defaultsDeep({
            LayerName: name,
            Content: { ZipFile },
          }),
        ])(),
    ])(),
});

const compareLayer = pipe([
  compareAws({})({
    filterTarget: () =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        assign({
          Content: pipe([
            get("Content"),
            assign({
              CodeSha256: pipe([get("ZipFile"), computeHash256]),
              CodeSize: pipe([get("ZipFile"), size]),
            }),
            tap(({ CodeSize }) => {
              //console.log("CodeSize target ", CodeSize);
            }),
          ]),
        }),
        pick([
          //"Content.CodeSha256", TODO aws returns a wrong CodeSha256
          "Content.CodeSize",
          "Description",
          "CompatibleRuntimes",
        ]),
        tap((params) => {
          assert(true);
        }),
      ]),
    filterLive: () =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        pick([
          "CompatibleRuntimes",
          "Description",
          // "Content.CodeSha256",  TODO aws returns a wrong CodeSha256
          "Content.CodeSize",
        ]),
        tap(({ Content: { CodeSize } }) => {
          //console.log("CodeSize live  ", CodeSize);
        }),
      ]),
  }),
  tap((diff) => {
    //logger.debug(`compareLayer ${tos(diff)}`);
  }),
]);
