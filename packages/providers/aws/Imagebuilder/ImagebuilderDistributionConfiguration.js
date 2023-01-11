const assert = require("assert");
const { pipe, tap, get, assign, map, flatMap } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

const { Tagger } = require("./ImagebuilderCommon");
const { replaceAccountAndRegion } = require("../AwsCommon");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ arn }) => {
    assert(arn);
  }),
  ({ arn }) => ({ distributionConfigurationArn: arn }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html
exports.ImagebuilderDistributionConfiguration = () => ({
  type: "DistributionConfiguration",
  package: "imagebuilder",
  client: "Imagebuilder",
  propertiesDefault: {},
  inferName: () =>
    pipe([
      get("name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  omitProperties: [
    "owner",
    "arn",
    "state",
    "kmsKeyId",
    "dateCreated",
    "dateUpdated",
  ],
  dependencies: {
    iamRoles: {
      type: "Role",
      group: "IAM",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("distributions"),
          map(get("s3ExportConfiguration.roleName")),
        ]),
    },
    kmsKeys: {
      type: "Key",
      group: "KMS",
      list: true,
      excludeDefaultDependencies: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("distributions"),
          map(get("amiDistributionConfiguration.kmsKeyId")),
        ]),
    },
    // TODO licenseConfigurationArns
    targetAccounts: {
      type: "Account",
      group: "Organisations",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("distributions"),
          flatMap(get("amiDistributionConfiguration.targetAccountIds")),
        ]),
    },
    s3Buckets: {
      type: "Bucket",
      group: "S3",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("distributions"),
          map(get("s3ExportConfiguration.s3Bucket")),
        ]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        distributions: pipe([
          get("distributions"),
          map(
            pipe([
              assign({
                region: pipe([
                  get("region"),
                  replaceAccountAndRegion({ lives, providerConfig }),
                ]),
              }),
              when(
                get("licenseConfigurationArns"),
                assign({
                  licenseConfigurationArns: pipe([
                    get("licenseConfigurationArns"),
                    map(
                      pipe([
                        replaceWithName({
                          groupType: "licenseManager::licenseConfiguration",
                          path: "id",
                          pathLive: "live.id",
                          providerConfig,
                          lives,
                        }),
                      ])
                    ),
                  ]),
                })
              ),
              when(
                get("launchTemplateConfigurations"),
                assign({
                  launchTemplateConfigurations: pipe([
                    get("launchTemplateConfigurations"),
                    map(
                      assign({
                        launchTemplateId: pipe([
                          get("launchTemplateId"),
                          replaceWithName({
                            groupType: "EC2::LaunchTemplate",
                            path: "id",
                            pathLive: "live.id",
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
                get("amiDistributionConfiguration"),
                assign({
                  amiDistributionConfiguration: pipe([
                    get("amiDistributionConfiguration"),
                    when(
                      get("targetAccountIds"),
                      assign({
                        targetAccountIds: pipe([
                          get("targetAccountIds"),
                          map(
                            replaceWithName({
                              groupType: "KMS::Key",
                              path: "id",
                              pathLive: "live.id",
                              providerConfig,
                              lives,
                            })
                          ),
                        ]),
                      })
                    ),
                    when(
                      get("kmsKeyId"),
                      assign({
                        kmsKeyId: pipe([
                          get("kmsKeyId"),
                          replaceWithName({
                            groupType: "KMS::Key",
                            path: "id",
                            pathLive: "live.id",
                            providerConfig,
                            lives,
                          }),
                        ]),
                      })
                    ),
                  ]),
                })
              ),
            ])
          ),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#getDistributionConfiguration-property
  getById: {
    method: "getDistributionConfiguration",
    getField: "distributionConfiguration",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#listDistributionConfigurations-property
  getList: {
    method: "listDistributionConfigurations",
    getParam: "distributionConfigurationSummaryList",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#createDistributionConfiguration-property
  create: {
    method: "createDistributionConfiguration",
    pickCreated: ({ payload }) =>
      pipe([
        ({ distributionConfigurationArn }) => ({
          arn: distributionConfigurationArn,
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#updateDistributionConfiguration-property
  update: {
    method: "updateDistributionConfiguration",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#deleteDistributionConfiguration-property
  destroy: {
    method: "deleteDistributionConfiguration",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
    ])(),
});
