const assert = require("assert");
const {
  pipe,
  tap,
  get,
  map,
  flatMap,
  pick,
  fork,
  filter,
  not,
  switchCase,
  tryCatch,
} = require("rubico");
const {
  defaultsDeep,
  values,
  first,
  isEmpty,
  keys,
  unless,
  prepend,
} = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

//TODO dependencyId use lives.getById

const ignoreErrorCodes = ["WAFNonexistentItemException"];

const WebAclDependencies = {
  loadBalancer: {
    type: "LoadBalancer",
    group: "ElasticLoadBalancingV2",
    parent: true,
    dependencyId: ({ lives, config }) => get("ResourceArn"),
    buildArn: () => get("LoadBalancerArn"),
  },
  apiGatewayStage: {
    type: "Stage",
    group: "APIGateway",
    parent: true,
    dependencyId: ({ lives, config }) => get("ResourceArn"),
    buildArn:
      ({ config }) =>
      ({ restApiId, stageName }) =>
        `arn:${config.partition}:apigateway:${config.region}::/restapis/${restApiId}/stages/${stageName}`,
  },
  cognitoUserPool: {
    type: "UserPool",
    group: "CognitoIdentityServiceProvider",
    parent: true,
    dependencyId: ({ lives, config }) => get("ResourceArn"),
    buildArn: () => get("Arn"),
  },
  // apiGatewayV2Stage: {
  //   type: "Stage",
  //   group: "ApiGatewayV2",
  //   parent: true,
  //   buildArn:
  //     ({ config }) =>
  //     ({ ApiId, StageName }) =>
  //       `arn:${config.partition}:apigateway:${config.region}::/apis/${ApiId}/stages/${StageName}`,
  // },
  graphql: {
    type: "GraphqlApi",
    group: "AppSync",
    parent: true,
    dependencyId: ({ lives, config }) => get("ResourceArn"),
    buildArn: () => get("arn"),
  },
};

exports.WebAclDependencies = WebAclDependencies;

const findId = () =>
  pipe([
    ({ WebACLArn, ResourceArn }) =>
      `webacl-assoc::${WebACLArn}::${ResourceArn}`,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html
exports.WAFV2WebACLAssociation = () => ({
  type: "WebACLAssociation",
  package: "wafv2",
  client: "WAFV2",
  ignoreErrorCodes,
  omitProperties: ["ResourceArn", "WebACLArn"],
  inferName:
    ({ dependenciesSpec: { webAcl, ...otherDeps } }) =>
    () =>
      pipe([
        tap((params) => {
          assert(webAcl);
        }),
        () => otherDeps,
        values,
        first,
        tap((dep) => {
          assert(dep);
        }),
        prepend(`webacl-assoc::${webAcl}::`),
      ])(),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        fork({
          webACLName: pipe([
            get("WebACLArn"),
            lives.getById({
              type: "WebACL",
              group: "WAFv2",
              providerName: config.providerName,
            }),
            get("name", live.WebACLArn),
          ]),
          resourceName: pipe([
            () => WebAclDependencies,
            values,
            map(({ type, group }) =>
              pipe([
                () => live.ResourceArn,
                lives.getById({
                  type,
                  group,
                  providerName: config.providerName,
                }),
                get("name"),
              ])()
            ),
            filter(not(isEmpty)),
            first,
            tap((name) => {
              assert(name);
            }),
          ]),
        }),
        tap(({ webACLName, resourceName }) => {
          assert(webACLName);
          assert(resourceName);
        }),
        ({ webACLName, resourceName }) =>
          `webacl-assoc::${webACLName}::${resourceName}`,
      ])(),
  findId,
  dependencies: {
    webAcl: {
      type: "WebACL",
      group: "WAFv2",
      dependencyId: ({ lives, config }) => get("WebACLArn"),
    },
    ...WebAclDependencies,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#associateWebACL-property
  create: {
    method: "associateWebACL",
    configIsUp: { retryCount: 20 * 12, retryDelay: 5e3 },
    shouldRetryOnExceptionMessages: [
      "AWS WAF couldn’t retrieve the resource that you requested",
    ],
  },
  destroy: {
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#disassociateWebACL-property
    method: "disassociateWebACL",
    pickId: pipe([
      tap(({ ResourceArn }) => {
        assert(ResourceArn);
      }),
      pick(["ResourceArn"]),
    ]),
  },
  getList:
    ({ endpoint }) =>
    ({ lives, config }) =>
      pipe([
        () => WebAclDependencies,
        values,
        flatMap(({ type, group, buildArn }) =>
          pipe([
            lives.getByType({
              providerName: config.providerName,
              type,
              group,
            }),
            map(
              pipe([
                get("live"),
                buildArn({ config }),
                tap((ResourceArn) => {
                  assert(ResourceArn);
                }),
                tryCatch(
                  (ResourceArn) =>
                    pipe([
                      () => ({ ResourceArn }),
                      endpoint().getWebACLForResource,
                      get("WebACL.ARN"),
                      tap((ARN) => {
                        assert(true);
                      }),
                      unless(isEmpty, (WebACLArn) => ({
                        WebACLArn,
                        ResourceArn,
                      })),
                    ])(),
                  // WAFInvalidParameterException
                  () => undefined
                ),
              ])
            ),
            filter(not(isEmpty)),
          ])()
        ),
      ])(),
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties,
    dependencies: { webAcl, ...wafDependencies },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(webAcl);
      }),
      () => properties,
      defaultsDeep({
        WebACLArn: getField(webAcl, "ARN"),
        ResourceArn: pipe([
          () => wafDependencies,
          keys,
          first,
          tap((key) => {
            assert(key, "missing waf dependency");
          }),
          (key) =>
            pipe([
              () => wafDependencies,
              get(key),
              get("live"),
              switchCase([
                isEmpty,
                () => `<< Arn of ${key} not available yet >>`,
                WebAclDependencies[key].buildArn({ config }),
              ]),
              ,
            ])(),
        ])(),
      }),
    ])(),
});
