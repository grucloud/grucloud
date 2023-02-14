const assert = require("assert");
const {
  map,
  pipe,
  tap,
  get,
  assign,
  tryCatch,
  pick,
  eq,
  omit,
  any,
} = require("rubico");
const {
  defaultsDeep,
  callProp,
  when,
  first,
  append,
  isIn,
} = require("rubico/x");
const path = require("path");
const { fetchZip, createZipBuffer, computeHash256 } = require("./LambdaCommon");
const { retryCall } = require("@grucloud/core/Retry");

const logger = require("@grucloud/core/logger")({
  prefix: "Function",
});

const { buildTagsObject, omitIfEmpty } = require("@grucloud/core/Common");
const { compareAws } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const { createLambda, tagResource, untagResource } = require("./LambdaCommon");

const compareLambda = compareAws({});
const findId = () => get("Configuration.FunctionArn");
const findName = () => get("Configuration.FunctionName");

const pickId = pipe([
  ({ Configuration: { FunctionArn } }) => ({
    FunctionName: FunctionArn,
  }),
]);

const removeVersion = pipe([
  callProp("split", ":"),
  callProp("slice", 0, -1),
  callProp("join", ":"),
]);
exports.removeVersion = removeVersion;

const managedByOther =
  ({ lives, config }) =>
  (live) =>
    pipe([
      lives.getByType({
        type: "Stack",
        group: "CloudFormation",
        providerName: config.providerName,
      }),
      any(
        pipe([
          get("name"),
          append("-AWS"),
          (stackName) => live.Configuration.FunctionName.includes(stackName),
        ])
      ),
    ])();

exports.Function = ({ spec, config }) => {
  const lambda = createLambda(config);
  const client = AwsClient({ spec, config })(lambda);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#getFunction-property
  const getById = client.getById({
    pickId,
    method: "getFunction",
    ignoreErrorCodes: ["ResourceNotFoundException"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#listFunctions-property
  const getList = client.getList({
    method: "listFunctions",
    getParam: "Functions",
    decorate: () =>
      pipe([
        pick(["FunctionName"]),
        lambda().getFunction,
        pick(["Configuration", "Code", "Tags"]),
        assign({
          FunctionUrlConfig: tryCatch(
            pipe([
              get("Configuration"),
              pick(["FunctionName"]),
              lambda().getFunctionUrlConfig,
              // For Cloudfront Distribution
              assign({
                DomainName: pipe([
                  get("FunctionUrl"),
                  callProp("replace", "https://", ""),
                  callProp("replace", "/", ""),
                ]),
              }),
            ]),
            (error, params) => {
              //assert(params);
              //throw error;
              return;
            }
          ),
          Code: pipe([
            get("Code"),
            assign({
              Data: pipe([fetchZip()]),
            }),
          ]),
          //TODO
          // CodeSigningConfigArn: pipe([
          //   get("Configuration"),
          //   pick(["FunctionName"]),
          //   lambda().getFunctionCodeSigningConfig,
          //   get("CodeSigningConfigArn"),
          // ]),
          // ReservedConcurrentExecutions: pipe([
          //   get("Configuration"),
          //   pick(["FunctionName"]),
          //   lambda().getFunctionConcurrency,
          //   get("ReservedConcurrentExecutions"),
          // ]),
        }),
        omitIfEmpty(["Policy"]),
        tap((params) => {
          assert(true);
        }),
      ]),
  });

  const getByName = pipe([
    ({ name }) => ({ Configuration: { FunctionArn: name } }),
    getById({}),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#createFunction-property
  const create = client.create({
    method: "createFunction",
    filterPayload: ({ Configuration, Tags }) =>
      pipe([
        tap(() => {
          assert(Configuration);
        }),
        () => ({ ...Configuration, Tags }),
      ])(),
    pickCreated: () =>
      pipe([
        tap(({ FunctionArn }) => {
          assert(FunctionArn);
        }),
        ({ FunctionArn }) => ({ Configuration: { FunctionArn } }),
      ]),
    isInstanceUp: pipe([get("Configuration.State"), isIn(["Active"])]),
    isInstanceError: pipe([get("Configuration.State"), isIn(["Failed"])]),
    getErrorMessage: get("Configuration.StateReason", "failed"),
    shouldRetryOnExceptionMessages: [
      "Lambda was unable to configure access to your environment variables because the KMS key is invalid for CreateGrant.",
      "The role defined for the function cannot be assumed by Lambda",
      "EFS file system",
      "The provided execution role does not have permissions to call CreateNetworkInterface on EC2",
    ],
    getById,
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#createFunctionUrlConfig-property
    postCreate: ({
      endpoint,
      payload: {
        Configuration: { FunctionName },
        FunctionUrlConfig,
      },
    }) =>
      pipe([
        tap((params) => {
          assert(endpoint);
          assert(FunctionName);
        }),
        when(
          () => FunctionUrlConfig,
          pipe([
            () => FunctionUrlConfig,
            defaultsDeep({ FunctionName }),
            endpoint().createFunctionUrlConfig,
          ])
        ),
      ]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#updateFunctionConfiguration-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#updateFunctionCode-property
  const update = ({ name, payload, diff, live }) =>
    pipe([
      tap(() => {
        logger.info(`update function: ${name}`);
        assert(diff);
      }),
      () => ({
        FunctionName: payload.Configuration.FunctionName,
        ZipFile: payload.Configuration.Code.ZipFile,
        Publish: true,
      }),
      // updateFunctionConfiguration
      lambda().updateFunctionCode,
      () =>
        retryCall({
          name: `update function code ${name}`,
          fn: pipe([
            () => payload,
            tap((params) => {
              assert(true);
            }),
            get("Configuration"),
            pick(["FunctionName"]),
            tap((params) => {
              assert(true);
            }),
            lambda().getFunction,
            tap((params) => {
              assert(true);
            }),
            eq(get("Configuration.LastUpdateStatus"), "Successful"),
          ]),
        }),
      // updateFunctionConfiguration
      when(
        () => get("liveDiff.updated.Configuration")(diff),
        pipe([
          () => payload,
          get("Configuration"),
          lambda().updateFunctionConfiguration,
          tap(() => {
            logger.info(`updated function done ${name}`);
          }),
        ])
      ),
      // updateFunctionUrlConfig
      when(
        () => get("liveDiff.updated.FunctionUrlConfig")(diff),
        pipe([
          tap((params) => {
            assert(true);
          }),
          () => ({
            FunctionName: payload.Configuration.FunctionName,
            ...payload.FunctionUrlConfig,
          }),
          lambda().updateFunctionUrlConfig,
        ])
      ),
      tap(() => {
        logger.info(`updated function done ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#deleteFunction-property
  const destroy = client.destroy({
    preDestroy: () =>
      tap(
        pipe([
          when(
            get("FunctionUrlConfig"),
            pipe([
              get("Configuration"),
              pick(["FunctionName"]),
              lambda().deleteFunctionUrlConfig,
            ])
          ),
        ])
      ),
    pickId,
    method: "deleteFunction",
    getById,
    ignoreErrorCodes: ["ResourceNotFoundException"],
    shouldRetryOnExceptionMessages: [
      "Please see our documentation for Deleting Lambda@Edge Functions and Replicas",
    ],
    configIsDown: { retryCount: 40 * 12, retryDelay: 5e3 },
  });

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { role, layers = [], kmsKey, subnets, securityGroups },
    programOptions,
    config,
  }) =>
    pipe([
      tap(() => {
        assert(programOptions);
        assert(role, "missing role dependencies");
        assert(Array.isArray(layers), "layers must be an array");
      }),
      () => ({
        localPath: path.resolve(programOptions.workingDirectory, name),
      }),
      createZipBuffer,
      (ZipFile) =>
        pipe([
          () => otherProps,
          defaultsDeep({
            Tags: buildTagsObject({
              config,
              namespace,
              name,
              userTags: Tags,
            }),
            Configuration: {
              FunctionName: name,
              Role: getField(role, "Arn"),
              Layers: pipe([
                () => layers,
                map((layer) => getField(layer, "LayerVersionArn")),
              ])(),
              Code: { ZipFile },
            },
          }),
          when(
            () => kmsKey,
            defaultsDeep({ KMSKeyArn: getField(kmsKey, "Arn") })
          ),
          when(
            () => subnets,
            defaultsDeep({
              Configuration: {
                VpcConfig: {
                  SubnetIds: pipe([
                    () => subnets,
                    map((subnet) => getField(subnet, "SubnetId")),
                  ])(),
                },
              },
            })
          ),
          when(
            () => securityGroups,
            defaultsDeep({
              Configuration: {
                VpcConfig: {
                  SecurityGroupIds: pipe([
                    () => securityGroups,
                    map((sg) => getField(sg, "GroupId")),
                  ])(),
                },
              },
            })
          ),
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
    getById,
    getList,
    configDefault,
    managedByOther,
    tagResource: tagResource({ lambda }),
    untagResource: untagResource({ lambda }),
  };
};

const filterFunctionUrlConfig = pipe([
  get("FunctionUrlConfig"),
  omit([
    "CreationTime",
    "LastModifiedTime",
    "FunctionArn",
    "FunctionUrl",
    "DomainName",
  ]),
]);

exports.filterFunctionUrlConfig = filterFunctionUrlConfig;

exports.compareFunction = pipe([
  tap((params) => {
    assert(true);
  }),
  compareLambda({
    filterTarget: () => (target) =>
      pipe([
        () => target,
        tap((params) => {
          assert(target);
        }),
        defaultsDeep({
          Configuration: {
            CodeSha256: pipe([
              () => target,
              get("Configuration.Code.ZipFile"),
              computeHash256,
            ])(),
          },
        }),
      ])(),
  }),
  tap((diff) => {
    assert(true);
  }),
]);
