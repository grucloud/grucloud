const assert = require("assert");
const {
  pipe,
  tap,
  get,
  map,
  pick,
  assign,
  filter,
  eq,
  switchCase,
  omit,
  set,
  flatMap,
  not,
  and,
} = require("rubico");
const {
  isString,
  filterOut,
  unless,
  size,
  defaultsDeep,
  isEmpty,
  find,
  when,
  first,
  last,
  pluck,
  callProp,
  includes,
  isIn,
} = require("rubico/x");
const {
  getByNameCore,
  buildGetId,
  replaceWithName,
  omitIfEmpty,
} = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { retryCall } = require("@grucloud/core/Retry");

const {
  replaceRegion,
  getNewCallerReference,
  buildTags,
  createEndpoint,
  replaceAccountAndRegion,
} = require("../AwsCommon");

const logger = require("@grucloud/core/logger")({
  prefix: "CloudFrontDistribution",
});

const { tagResource, untagResource } = require("./CloudFrontCommon");

const buildArn = () =>
  pipe([
    get("ARN"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const replaceWithBucketName = ({ providerConfig, lives }) =>
  replaceWithName({
    groupType: "S3::Bucket",
    providerConfig,
    lives,
  });

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    tap(({ ARN }) => {
      assert(ARN);
    }),
    ({ DistributionConfig, ...other }) => ({ ...DistributionConfig, ...other }),
    omitIfEmpty(["ContinuousDeploymentPolicyId"]),
    assign({
      Tags: pipe([
        ({ ARN }) => ({
          Resource: ARN,
        }),
        endpoint().listTagsForResource,
        get("Tags.Items"),
      ]),
    }),
    assign({
      ETag: pipe([endpoint().getDistributionConfig, get("ETag")]),
    }),
  ]);

const pickId = pipe([
  tap(({ ETag, Id }) => {
    assert(ETag);
    assert(Id);
  }),
  ({ ETag, Id }) => ({ IfMatch: ETag, Id }),
]);

const isInstanceUp = pipe([
  tap(({ Status }) => {
    assert(Status);
  }),
  eq(get("Status"), "Deployed"),
]);

const findId = () =>
  pipe([
    get("ARN"),
    tap((id) => {
      assert(id);
    }),
  ]);

const findName = () =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    get("Origins.Items"),
    first,
    get("Id"),
    tap((Id) => {
      assert(Id);
      logger.debug(`Distribution findName ${Id}`);
    }),
  ]);

const filterLiveCacheBehavior = ({ providerConfig, lives }) =>
  pipe([
    when(
      get("TrustedKeyGroups"),
      assign({
        TrustedKeyGroups: pipe([
          get("TrustedKeyGroups"),
          omit(["Quantity"]),
          when(
            get("Items"),
            assign({
              Items: pipe([
                get("Items"),
                map(
                  replaceWithName({
                    groupType: "CloudFront::KeyGroup",
                    path: "id",
                    providerConfig,
                    lives,
                  })
                ),
              ]),
            })
          ),
        ]),
      })
    ),
    when(
      get("CachePolicyId"),
      assign({
        CachePolicyId: pipe([
          get("CachePolicyId"),
          replaceWithName({
            groupType: "CloudFront::CachePolicy",
            path: "id",
            providerConfig,
            lives,
          }),
        ]),
      })
    ),
    when(
      get("OriginRequestPolicyId"),
      assign({
        OriginRequestPolicyId: pipe([
          get("OriginRequestPolicyId"),
          replaceWithName({
            groupType: "CloudFront::OriginRequestPolicy",
            path: "id",
            providerConfig,
            lives,
          }),
        ]),
      })
    ),
    when(
      get("ResponseHeadersPolicyId"),
      assign({
        ResponseHeadersPolicyId: pipe([
          get("ResponseHeadersPolicyId"),
          replaceWithName({
            groupType: "CloudFront::ResponseHeadersPolicy",
            path: "id",
            providerConfig,
            lives,
          }),
        ]),
      })
    ),
    when(
      get("FunctionAssociations"),
      assign({
        FunctionAssociations: pipe([
          get("FunctionAssociations"),
          assign({
            Items: pipe([
              get("Items"),
              map(
                pipe([
                  assign({
                    FunctionARN: pipe([
                      get("FunctionARN"),
                      replaceAccountAndRegion({ providerConfig, lives }),
                    ]),
                  }),
                ])
              ),
            ]),
          }),
        ]),
      })
    ),
    when(
      get("LambdaFunctionAssociations"),
      assign({
        LambdaFunctionAssociations: pipe([
          get("LambdaFunctionAssociations"),
          assign({
            Items: pipe([
              get("Items"),
              map(
                pipe([
                  assign({
                    LambdaFunctionARN: pipe([
                      get("LambdaFunctionARN"),
                      replaceAccountAndRegion({ providerConfig, lives }),
                    ]),
                  }),
                ])
              ),
            ]),
          }),
        ]),
      })
    ),
    assign({
      TargetOriginId: pipe([
        get("TargetOriginId"),
        replaceRegion({ providerConfig }),
      ]),
    }),
  ]);

const setQuantity = (key) =>
  set(`${key}.Quantity`, pipe([get(`${key}.Items`, []), size]));

const assignCacheBehaviourQuantity = pipe([
  setQuantity("TrustedKeyGroups"),
  setQuantity("TrustedSigners"),
  setQuantity("FunctionAssociations"),
  setQuantity("LambdaFunctionAssociations"),
]);

const replaceDomainName = ({ lives, providerConfig }) =>
  pipe([
    get("DomainName"),
    replaceWithName({
      groupType: "MediaPackage::OriginEndpoint",
      path: "live.DomainName",
      pathLive: "live.DomainName",
      providerConfig,
      lives,
      withSuffix: true,
    }),
    when(
      isString,
      replaceWithName({
        groupType: "APIGateway::RestApi",
        path: "live.endpoint",
        pathLive: "live.endpoint",
        providerConfig,
        lives,
      })
    ),
    when(
      isString,
      replaceWithName({
        groupType: "ApiGatewayV2::Api",
        path: "live.Endpoint",
        pathLive: "live.Endpoint",
        providerConfig,
        lives,
      })
    ),
    when(
      isString,
      replaceWithName({
        groupType: "Lambda::Function",
        path: "live.FunctionUrlConfig.DomainName",
        pathLive: "live.FunctionUrlConfig.DomainName",
        providerConfig,
        lives,
      })
    ),
    when(isString, replaceAccountAndRegion({ providerConfig, lives })),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html
exports.CloudFrontDistribution = ({ compare }) => ({
  type: "Distribution",
  package: "cloudfront",
  client: "CloudFront",
  inferName: () =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      get("Origins.Items"),
      first,
      get("Id"),
      tap((Id) => {
        assert(Id);
        logger.debug(`CloudFrontDistribution inferName ${Id}`);
      }),
    ]),
  findName,
  findId,
  ignoreErrorCodes: [
    "NoSuchResource",
    "InvalidIfMatchVersion",
    "NoSuchDistribution",
  ],
  dependencies: {
    apiGatewayRestApi: {
      type: "RestApi",
      group: "APIGateway",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("Origins.Items"),
          pluck("DomainName"),
          map((DomainName) =>
            pipe([
              lives.getByType({
                type: "RestApi",
                group: "APIGateway",
                providerName: config.providerName,
              }),
              find(pipe([get("live.endpoint"), includes(DomainName)])),
              get("id"),
            ])()
          ),
        ]),
    },
    apiGatewayV2Apis: {
      type: "Api",
      group: "ApiGatewayV2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("Origins.Items"),
          pluck("DomainName"),
          map((DomainName) =>
            pipe([
              lives.getByType({
                type: "Api",
                group: "ApiGatewayV2",
                providerName: config.providerName,
              }),
              find(pipe([get("live.Endpoint"), includes(DomainName)])),
              get("id"),
            ])()
          ),
        ]),
    },
    buckets: {
      type: "Bucket",
      group: "S3",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("Origins.Items", []),
          pluck("DomainName"),
          map((domainName) =>
            pipe([
              lives.getByType({
                type: "Bucket",
                group: "S3",
                providerName: config.providerName,
              }),
              find(({ id }) => pipe([() => domainName, includes(id)])()),
              get("id"),
            ])()
          ),
        ]),
    },
    cachePolicy: {
      type: "CachePolicy",
      group: "CloudFront",
      dependencyId: ({ lives, config }) =>
        get("DefaultCacheBehavior.CachePolicyId"),
    },
    certificate: {
      type: "Certificate",
      group: "ACM",
      dependencyId: ({ lives, config }) =>
        get("ViewerCertificate.ACMCertificateArn"),
    },
    functions: {
      type: "Function",
      group: "CloudFront",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("DefaultCacheBehavior.FunctionAssociations.Items", []),
          pluck("FunctionARN"),
        ]),
    },
    lambdaFunctions: {
      type: "Function",
      group: "Lambda",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("DefaultCacheBehavior.LambdaFunctionAssociations.Items", []),
          pluck("LambdaFunctionARN"),
          map((LambdaFunctionARN) =>
            pipe([
              lives.getByType({
                type: "Function",
                group: "Lambda",
                providerName: config.providerName,
              }),
              tap((params) => {
                assert(LambdaFunctionARN);
              }),
              find(
                pipe([
                  get("live.Configuration.FunctionArn"),
                  isIn(LambdaFunctionARN),
                ])
              ),
              get("id"),
            ])()
          ),
        ]),
    },
    lambdaFunctionsOrigin: {
      type: "Function",
      group: "Lambda",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("Origins.Items", []),
          pluck("DomainName"),
          map((domainName) =>
            pipe([
              lives.getByType({
                type: "Function",
                group: "Lambda",
                providerName: config.providerName,
              }),
              find(eq(get("live.FunctionUrlConfig.DomainName"), domainName)),
              get("id"),
            ])()
          ),
        ]),
    },
    keyGroups: {
      type: "KeyGroup",
      group: "CloudFront",
      list: true,
      dependencyIds: ({ lives, config }) =>
        get("DefaultCacheBehavior.TrustedKeyGroups.Items"),
    },
    mediaPackageOriginEndpoints: {
      type: "OriginEndpoint",
      group: "MediaPackage",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("Origins.Items"),
          pluck("DomainName"),
          map((DomainName) =>
            pipe([
              lives.getByType({
                type: "OriginEndpoint",
                group: "MediaPackage",
                providerName: config.providerName,
              }),
              find(pipe([get("live.DomainName"), includes(DomainName)])),
              get("id"),
            ])()
          ),
        ]),
    },
    originAccessIdentities: {
      type: "OriginAccessIdentity",
      group: "CloudFront",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("Origins.Items", []),
          pluck("S3OriginConfig"),
          pluck("OriginAccessIdentity"),
          filterOut(isEmpty),
          map(
            pipe([
              callProp("split", "/"),
              last,
              lives.getById({
                type: "OriginAccessIdentity",
                group: "CloudFront",
                providerName: config.providerName,
              }),
              get("id"),
            ])
          ),
        ]),
    },
    originRequestPolicy: {
      type: "OriginRequestPolicy",
      group: "CloudFront",
      dependencyId: ({ lives, config }) =>
        get("DefaultCacheBehavior.OriginRequestPolicyId"),
    },
    responseHeadersPolicy: {
      type: "ResponseHeadersPolicy",
      group: "CloudFront",
      dependencyId: ({ lives, config }) =>
        get("DefaultCacheBehavior.ResponseHeadersPolicyId"),
    },
    webAcl: {
      type: "WebACLCloudFront",
      group: "WAFv2",
      dependencyId: ({ lives, config }) => get("WebACLId"),
    },
  },
  propertiesDefault: {
    Enabled: true,
    WebACLId: "",
    OriginGroups: { Quantity: 0, Items: [] },
    CacheBehaviors: { Quantity: 0, Items: [] },
    CustomErrorResponses: { Quantity: 0, Items: [] },
    //ViewerCertificate: { CloudFrontDefaultCertificate: false },
    DefaultCacheBehavior: {
      FunctionAssociations: { Quantity: 0, Items: [] },
      LambdaFunctionAssociations: { Quantity: 0, Items: [] },
      TrustedKeyGroups: { Quantity: 0, Items: [] },
      TrustedSigners: { Quantity: 0, Items: [] },
    },
    Logging: {
      Enabled: false,
      IncludeCookies: false,
      Bucket: "",
      Prefix: "",
    },
    Restrictions: {
      GeoRestriction: { Quantity: 0, Items: [], RestrictionType: "none" },
    },
    HttpVersion: "http2",
    IsIPV6Enabled: true,
    Staging: false,
  },
  compare: compare({
    filterTarget: () =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        omit(["CallerReference"]),
      ]),
    filterAll: () => pipe([omitIfEmpty(["WebACLId"])]),
  }),
  omitProperties: [
    "Id",
    "ETag",
    "InProgressInvalidationBatches",
    "ARN",
    "Status",
    "LastModifiedTime",
    "DomainName",
    "CallerReference",
    "AliasICPRecordals",
    "Origins.Quantity",
    "ViewerCertificate.ACMCertificateArn",
    "ViewerCertificate.Certificate",
    "DefaultCacheBehavior.TrustedKeyGroups.Quantity",
    "DefaultCacheBehavior.TrustedSigners.Quantity",
    "DefaultCacheBehavior.FunctionAssociations.Quantity",
    "DefaultCacheBehavior.LambdaFunctionAssociations.Quantity",
    "CacheBehaviors.Items[].TrustedKeyGroups.Quantity",
    "CacheBehaviors.Items[].TrustedSigners.Quantity",
    "CacheBehaviors.Items[].FunctionAssociations.Quantity",
    "CacheBehaviors.Items[].LambdaFunctionAssociations.Quantity",
    "ActiveTrustedKeyGroups",
    "ActiveTrustedSigners",
    "AliasICPRecordals",
  ],
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      tap((params) => {
        assert(providerConfig);
      }),
      switchCase([
        //
        pipe([get("Aliases.Items"), isEmpty]),
        omit(["Aliases"]),
        assign({
          Aliases: pipe([
            get("Aliases"),
            assign({
              Items: pipe([
                get("Items", []),
                map((certificateName) =>
                  pipe([
                    () => lives,
                    filter(eq(get("groupType"), "ACM::Certificate")),
                    find(eq(get("name"), certificateName)),
                    switchCase([
                      isEmpty,
                      () => certificateName,
                      (resource) =>
                        pipe([
                          () => resource,
                          buildGetId({ path: "name", providerConfig }),
                          (getId) => () => getId,
                        ])(),
                    ]),
                  ])()
                ),
              ]),
            }),
          ]),
        }),
      ]),
      assign({
        Comment: pipe([
          get("Comment"),
          replaceWithBucketName({ providerConfig, lives }),
        ]),
        DefaultCacheBehavior: pipe([
          get("DefaultCacheBehavior"),
          filterLiveCacheBehavior({ providerConfig, lives }),
        ]),
        CacheBehaviors: pipe([
          get("CacheBehaviors"),
          assign({
            Items: pipe([
              get("Items"),
              map(filterLiveCacheBehavior({ providerConfig, lives })),
            ]),
          }),
        ]),
        Origins: pipe([
          get("Origins"),
          assign({
            Items: pipe([
              get("Items"),
              map(
                pipe([
                  assign({
                    Id: pipe([get("Id"), replaceRegion({ providerConfig })]),
                    CustomHeaders: pipe([
                      get("CustomHeaders"),
                      omitIfEmpty(["Items"]),
                    ]),
                    DomainName: replaceDomainName({ lives, providerConfig }),
                  }),
                  when(
                    get("S3OriginConfig"),
                    assign({
                      S3OriginConfig: pipe([
                        get("S3OriginConfig"),
                        when(
                          get("OriginAccessIdentity"),
                          assign({
                            OriginAccessIdentity: pipe([
                              get("OriginAccessIdentity"),
                              replaceWithName({
                                groupType: "CloudFront::OriginAccessIdentity",
                                path: "id",
                                providerConfig,
                                lives,
                                withSuffix: true,
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
      }),
    ]),
  getById: {
    pickId: pipe([
      tap(({ Id }) => {
        assert(Id);
      }),
      pick(["Id"]),
    ]),
    method: "getDistribution",
    getField: "Distribution",
    decorate,
  },
  getList: {
    method: "listDistributions",
    getParam: "DistributionList.Items",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#createDistributionWithTags-property
  create: {
    method: "createDistributionWithTags",
    filterPayload: ({ Tags, ...payload }) => ({
      DistributionConfigWithTags: {
        DistributionConfig: payload,
        Tags: { Items: Tags },
      },
    }),
    isInstanceUp,
    shouldRetryOnExceptionCodes: ["InvalidViewerCertificate"],
    shouldRetryOnExceptionMessages: [
      "The function execution role must be assumable with edgelambda.amazonaws.com as well as lambda.amazonaws.com principals",
    ],
    pickCreated: () =>
      pipe([
        get("Distribution"),
        tap(({ Id }) => {
          assert(Id);
        }),
      ]),
  },
  update: {
    method: "updateDistribution",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        tap((params) => {
          assert(live.ETag);
        }),
        () => payload,
        assign({
          WebACLId: get("WebACLId", ""),
          CallerReference: () => live.CallerReference,
        }),
        (DistributionConfig) => ({ DistributionConfig }),
        defaultsDeep(pickId(live)),
      ])(),
    isInstanceUp,
  },
  destroy: {
    pickId,
    preDestroy:
      ({ endpoint, name, getById }) =>
      (live) =>
        pipe([
          tap((params) => {
            assert(getById);
            assert(live.Id);
            assert(live.ETag);
          }),
          () => live,
          unless(
            eq(get("Enabled"), false),
            pipe([
              omit(["Origin"]),
              // Lambda was unable to delete arn:aws:lambda:us-east-1:0000000000:function:CloudfrontLeApigwCdkStack-LambdaEdge6A7A1843-sWx5QByO0zMJ:1 because it is a replicated function. Please see our documentation for Deleting Lambda@Edge Functions and Replicas.
              set(
                "DefaultCacheBehavior.LambdaFunctionAssociations.Quantity",
                0
              ),
              omit(["DefaultCacheBehavior.LambdaFunctionAssociations.Items"]),
              (DistributionConfig) => ({
                DistributionConfig: {
                  ...DistributionConfig,
                  Enabled: false,
                },
              }),
              defaultsDeep(pickId(live)),
              endpoint().updateDistribution,
              tap(() =>
                retryCall({
                  name: `distribution isUpById`,
                  fn: pipe([() => live, getById]),
                  config: { retryCount: 6 * 60, retryDelay: 10e3 },
                  isExpectedResult: isInstanceUp,
                })
              ),
              defaultsDeep({ Id: live.Id }),
            ])
          ),
        ])(),
    method: "deleteDistribution",
    isExpectedResult: () => true,
    shouldRetryOnExceptionCodes: ["DistributionNotDisabled"],
  },
  getByName: getByNameCore,
  tagger: ({ config }) => ({
    tagResource: tagResource({ buildArn: buildArn(config) }),
    untagResource: untagResource({ buildArn: buildArn(config) }),
  }),
  configDefault: (configDefault = ({
    name,
    properties: { Tags, ...otherProps },
    namespace,
    dependencies: { certificate, webAcl },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        CallerReference: getNewCallerReference(),
        Enabled: true,
        Tags: buildTags({ name, namespace, config, UserTags: Tags }),
      }),
      when(
        () => certificate,
        defaultsDeep({
          ViewerCertificate: {
            ACMCertificateArn: getField(certificate, "CertificateArn"),
            SSLSupportMethod: "sni-only",
            MinimumProtocolVersion: "TLSv1.2_2019",
            Certificate: getField(certificate, "CertificateArn"),
            CertificateSource: "acm",
            CloudFrontDefaultCertificate: false,
          },
        })
      ),
      setQuantity("Aliases"),
      setQuantity("Origins"),
      when(
        get("CacheBehaviors"),
        assign({
          CacheBehaviors: pipe([
            get("CacheBehaviors"),
            assign({
              Items: pipe([get("Items"), map(assignCacheBehaviourQuantity)]),
            }),
          ]),
        })
      ),
      assign({
        DefaultCacheBehavior: pipe([
          get("DefaultCacheBehavior"),
          assignCacheBehaviourQuantity,
        ]),
      }),
      setQuantity("Restrictions.GeoRestriction"),
      when(() => webAcl, defaultsDeep({ WebACLId: getField(webAcl, "ARN") })),
    ])()),
  onDeployed: ({ resultCreate, lives, config }) =>
    pipe([
      tap(() => {
        logger.info(`onDeployed`);
        //logger.debug(`onDeployed ${JSON.stringify({ resultCreate })}`);
        assert(resultCreate);
        assert(lives);
        assert(config);
      }),
      lives.getByType({
        providerName: config.providerName,
        type: "Distribution",
        group: "CloudFront",
      }),
      tap((distributions) => {
        logger.info(`onDeployed ${JSON.stringify({ distributions })}`);
      }),
      map((distribution) =>
        pipe([
          () => distribution,
          get("live.Origins.Items"),
          flatMap(({ Id, OriginPath }) =>
            findS3ObjectUpdated({ plans: resultCreate.results, Id, OriginPath })
          ),
          tap((Items) => {
            logger.info(`distribution Items ${JSON.stringify({ Items })}`);
          }),
          tap.if(
            not(isEmpty),
            pipe([
              (Items) => ({
                DistributionId: distribution.Id,
                InvalidationBatch: {
                  CallerReference: getNewCallerReference(),
                  Paths: {
                    Quantity: Items.length,
                    Items,
                  },
                },
              }),
              tap((params) => {
                logger.info(
                  `createInvalidation params ${JSON.stringify({ params })}`
                );
              }),
              createEndpoint("cloudfront", "CloudFront")(config)
                .createInvalidation,
              tap((result) => {
                logger.info(
                  `createInvalidation done ${JSON.stringify({ result })}`
                );
              }),
            ])
          ),
        ])()
      ),
    ])(),
});

const findS3ObjectUpdated = ({ plans = [], Id, OriginPath }) =>
  pipe([
    tap(() => {
      assert(Id, "Id");
      logger.debug(
        `findS3ObjectUpdated ${JSON.stringify({
          Id,
          OriginPath,
          plansSize: plans.length,
        })}`
      );
    }),
    () => plans,
    filter(
      and([
        eq(get("resource.type"), "S3Object"),
        eq(get("action"), "UPDATE"),
        eq((plan) => `S3-${plan.output.Bucket}`, Id),
      ])
    ),
    pluck("live.Key"),
    map((key) => `${OriginPath}/${key}`),
    tap((results) => {
      logger.debug(`findS3ObjectUpdated ${JSON.stringify({ results })}`);
    }),
  ])();
