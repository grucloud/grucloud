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
} = require("rubico");
const {
  defaultsDeep,
  values,
  first,
  isEmpty,
  keys,
  unless,
} = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");

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
        `arn:aws:apigateway:${config.region}::/restapis/${restApiId}/stages/${stageName}`,
  },
  // apiGatewayV2Stage: {
  //   type: "Stage",
  //   group: "ApiGatewayV2",
  //   parent: true,
  //   buildArn:
  //     ({ config }) =>
  //     ({ ApiId, StageName }) =>
  //       `arn:aws:apigateway:${config.region}::/apis/${ApiId}/stages/${StageName}`,
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

const createModel = ({ config }) => ({
  package: "wafv2",
  client: "WAFV2",
  ignoreErrorCodes,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#associateWebACL-property
  create: {
    method: "associateWebACL",
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
});

const findId = pipe([
  get("live"),
  ({ WebACLArn, ResourceArn }) => `webacl-assoc::${WebACLArn}::${ResourceArn}`,
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html
exports.WAFV2WebACLAssociation = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: ({ live, lives }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        fork({
          webACLName: pipe([
            () =>
              lives.getById({
                id: live.WebACLArn,
                type: "WebACL",
                group: "WAFv2",
                providerName: config.providerName,
              }),
            get("name", live.WebACLArn),
          ]),
          resourceName: pipe([
            () => WebAclDependencies,
            values,
            map(
              pipe([
                ({ type, group }) =>
                  lives.getById({
                    id: live.ResourceArn,
                    type,
                    group,
                    providerName: config.providerName,
                  }),
                get("name"),
              ])
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
    getList:
      ({ endpoint }) =>
      ({ lives }) =>
        pipe([
          () => WebAclDependencies,
          values,
          flatMap(({ type, group, buildArn }) =>
            pipe([
              () =>
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
