const assert = require("assert");
const {
  pipe,
  assign,
  map,
  omit,
  tap,
  pick,
  get,
  fork,
  filter,
} = require("rubico");
const { defaultsDeep, when, includes, pluck } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const AdmZip = require("adm-zip");
const path = require("path");
const os = require("os");

const { omitIfEmpty, replaceWithName } = require("@grucloud/core/Common");
const {
  compareAws,
  replaceEnv,
  buildDependenciesFromEnv,
  replaceAccountAndRegion,
} = require("../AwsCommon");

const {
  Function,
  compareFunction,
  buildEventInvokeConfigDependencies,
  removeVersion,
} = require("./Function");

const { LambdaAlias } = require("./LambdaAlias");

const { Layer, compareLayer } = require("./Layer");
const { LambdaPermission } = require("./LambdaPermission");

const { LambdaEventSourceMapping } = require("./LambdaEventSourceMapping");

const logger = require("@grucloud/core/logger")({ prefix: "Lambda" });

const GROUP = "Lambda";
const compare = compareAws({});

const createTempDir = () => os.tmpdir();

module.exports = pipe([
  () => [
    createAwsService(LambdaAlias({})),
    {
      type: "Layer",
      Client: Layer,
      inferName: () => get("LayerName"),
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
            pick([
              "LayerName",
              "Description",
              "CompatibleRuntimes",
              "LicenseInfo",
            ]),
            tap(
              pipe([
                fork({
                  zip: () =>
                    new AdmZip(Buffer.from(live.Content.Data, "base64")),
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
                    path.resolve(
                      programOptions.workingDirectory,
                      resource.name
                    ),
                    true
                  ),
              ])
            ),
          ])(),
    },
    createAwsService(LambdaEventSourceMapping({ compare })),
    {
      type: "Function",
      Client: Function,
      compare: compareFunction,
      inferName: () => get("Configuration.FunctionName"),
      displayResource: () => pipe([omit(["Configuration.Code.ZipFile"])]),
      ignoreResource: () =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          get("name"),
          includes("AWSCDK"),
        ]),
      omitProperties: [
        "Code",
        "Configuration.Code",
        "Configuration.CodeSize",
        "Configuration.FunctionArn",
        "Configuration.LastModified",
        "Configuration.LastUpdateStatus",
        "Configuration.LastUpdateStatusReason",
        "Configuration.LastUpdateStatusReasonCode",
        "Configuration.Layers",
        "Configuration.MasterArn",
        "Configuration.RevisionId",
        "Configuration.Role",
        "Configuration.SigningJobArn",
        "Configuration.State",
        "Configuration.StateReason",
        "Configuration.StateReasonCode",
        "Configuration.Version",
        "Configuration.VpcConfig",
        "Configuration.SigningProfileVersionArn",
        "Configuration.SigningJobArn",
        "Configuration.RuntimeVersionConfig",
        "Policy",
        "FunctionUrlConfig.CreationTime",
        "FunctionUrlConfig.LastModifiedTime",
        "FunctionUrlConfig.FunctionArn",
        "FunctionUrlConfig.FunctionUrl",
        "FunctionUrlConfig.DomainName",
      ],
      propertiesDefault: {
        Publish: true,
        Configuration: {
          Architectures: ["x86_64"],
          Description: "",
          MemorySize: 128,
          Timeout: 3,
          PackageType: "Zip",
          TracingConfig: { Mode: "PassThrough" },
          EphemeralStorage: { Size: 512 },
          SnapStart: {
            ApplyOn: "None",
            OptimizationStatus: "Off",
          },
        },
      },
      filterLive:
        ({ resource, programOptions, lives, providerConfig }) =>
        (live) =>
          pipe([
            tap(() => {
              assert(resource.name);
              assert(live.Code.Data);
            }),
            () => live,
            when(
              get("EventInvokeConfig"),
              assign({
                EventInvokeConfig: pipe([
                  get("EventInvokeConfig"),
                  assign({
                    DestinationConfig: pipe([
                      get("DestinationConfig"),
                      when(
                        get("OnSuccess"),
                        assign({
                          OnSuccess: pipe([
                            get("OnSuccess"),
                            assign({
                              Destination: pipe([
                                get("Destination"),
                                replaceAccountAndRegion({
                                  lives,
                                  providerConfig,
                                }),
                              ]),
                            }),
                          ]),
                        })
                      ),
                      when(
                        get("OnFailure"),
                        assign({
                          OnFailure: pipe([
                            get("OnFailure"),
                            assign({
                              Destination: pipe([
                                get("Destination"),
                                replaceAccountAndRegion({
                                  lives,
                                  providerConfig,
                                }),
                              ]),
                            }),
                          ]),
                        })
                      ),
                    ]),
                  }),
                ]),
              })
            ),
            assign({
              Configuration: pipe([
                get("Configuration"),
                omit(["CodeSha256"]),
                when(
                  get("Layers"),
                  assign({
                    Layers: pipe([
                      get("Layers"),
                      map(replaceAccountAndRegion({ lives, providerConfig })),
                    ]),
                  })
                ),
                when(
                  get("FileSystemConfigs"),
                  assign({
                    FileSystemConfigs: pipe([
                      get("FileSystemConfigs"),
                      map(
                        assign({
                          Arn: pipe([
                            get("Arn"),
                            replaceWithName({
                              groupType: "EFS::AccessPoint",
                              path: "id",
                              providerConfig,
                              lives,
                            }),
                          ]),
                        })
                      ),
                    ]),
                  })
                ),
                when(
                  get("Environment"),
                  assign({
                    Environment: pipe([
                      get("Environment"),
                      assign({
                        Variables: pipe([
                          get("Variables"),
                          map(replaceEnv({ lives, providerConfig })),
                        ]),
                      }),
                    ]),
                  })
                ),
              ]),
            }),
            omitIfEmpty(["FunctionUrlConfig"]),
            tap(
              pipe([
                () => new AdmZip(Buffer.from(live.Code.Data, "base64")),
                (zip) =>
                  zip.extractAllTo(
                    path.resolve(
                      programOptions.workingDirectory,
                      resource.name
                    ),
                    true
                  ),
              ])
            ),
          ])(),
      // TODO SigningJobArn
      dependencies: {
        ...buildEventInvokeConfigDependencies(),
        layers: {
          type: "Layer",
          group: "Lambda",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("Configuration.Layers"),
              pluck("Arn"),
              (layersArn) =>
                pipe([
                  lives.getByType({
                    providerName: config.providerName,
                    type: "Layer",
                    group: "Lambda",
                  }),
                  filter(
                    pipe([
                      get("live.LayerVersionArn"),
                      removeVersion,
                      (layerVersionArn) =>
                        pipe([
                          () => layersArn,
                          map(removeVersion),
                          includes(layerVersionArn),
                        ])(),
                    ])
                  ),
                ])(),
              pluck("id"),
            ]),
        },
        role: {
          type: "Role",
          group: "IAM",
          dependencyId: () => get("Configuration.Role"),
        },
        kmsKey: {
          type: "Key",
          group: "KMS",
          dependencyId: () => get("Configuration.KMSKeyArn"),
        },
        subnets: {
          type: "Subnet",
          group: "EC2",
          list: true,
          dependencyIds: () => get("Configuration.VpcConfig.SubnetIds"),
        },
        securityGroups: {
          type: "SecurityGroup",
          group: "EC2",
          list: true,
          dependencyIds: () => get("Configuration.VpcConfig.SecurityGroupIds"),
        },
        s3Buckets: {
          type: "Bucket",
          group: "S3",
          parent: true,
          list: true,
          ignoreOnDestroy: true,
        },
        efsAccessPoints: {
          type: "AccessPoint",
          group: "EFS",
          list: true,
          dependencyIds: () =>
            pipe([get("Configuration.FileSystemConfigs"), pluck("Arn")]),
        },
        ...buildDependenciesFromEnv({
          pathEnvironment: "Configuration.Environment.Variables",
        }),
      },
    },
    createAwsService(LambdaPermission({})),
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
    })
  ),
]);
