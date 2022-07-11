const assert = require("assert");
const { pipe, tap, get, map, pick, fork, filter, not, not } = require("rubico");
const { defaultsDeep, values, first, isEmpty } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");

const WebAclDependencies = {
  loadBalancer: {
    type: "LoadBalancer",
    group: "ElasticLoadBalancingV2",
    parent: true,
  },
  apiGatewayV2Stage: {
    type: "Stage",
    group: "ApiGatewayV2",
    parent: true,
  },
  graphql: { type: "GraphqlApi", group: "AppSync", parent: true },
};

exports.WebAclDependencies = WebAclDependencies;

// TODO use  getWebACLForResource ?
const createModel = ({ config }) => ({
  package: "wafv2",
  client: "WAFV2",
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#associateWebACL-property
  create: { method: "associateWebACL" },
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
  tap(({ WebACLArn, ResourceArn }) => {
    assert(WebACLArn);
    assert(ResourceArn);
  }),
  ({ WebACLArn, ResourceArn }) => `webacl-assoc::${WebACLArn}::${ResourceArn}`,
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html
exports.WAFV2WebAclAssociation = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findDependencies: ({ live }) => [
      {
        type: "WebACL",
        group: "WAFV2",
        ids: [live.WebACLArn],
      },
      //TODO
      {
        type: "LoadBalancer",
        group: "ElasticLoadBalancingV2",
        ids: [live.ResourceArn],
      },
      {
        type: "Stage",
        group: "ApiGatewayV2",
        ids: [live.ResourceArn],
      },
      {
        type: "GraphqlApi",
        group: "AppSync",
        ids: [live.ResourceArn],
      },
    ],
    findName: ({ live, lives }) =>
      pipe([
        fork({
          webACLName: pipe([
            () =>
              lives.getById({
                id: live.WebACLArn,
                type: "WebACL",
                group: "WAFV2",
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
          fork({
            loadBalancer: pipe([
              () =>
                lives.getByType({
                  providerName: config.providerName,
                  type: "LoadBalancer",
                  group: "ElasticLoadBalancingV2",
                }),
              map(
                pipe([
                  ({ id }) => ({ ResourceArn: id }),
                  endpoint().getWebACLForResource,
                  get("WebACL"),
                ])
              ),
            ]),
          }),
        ])(),
    getByName:
      ({ getById, endpoint }) =>
      ({ resolvedDependencies: { webACL } }) =>
        pipe([
          tap((params) => {
            // assert(vpc);
            // assert(dhcpOptions);
          }),
        ])(),
    configDefault: ({
      name,
      namespace,
      properties,
      dependencies: { webACL, loadBalancer },
    }) =>
      pipe([
        tap(() => {
          assert(webACL);
        }),
        () => properties,
        defaultsDeep({
          WebACLArn: getField(webACL, "Arn"),
        }),
        when(
          () => loadBalancer,
          defaultsDeep({
            ResourceArn: getField(loadBalancer, "LoadBalancerArn"),
          })
        ),
        // TODO
        // For an Amazon API Gateway REST API: arn:aws:apigateway:region::/restapis/api-id/stages/stage-name
        // For an AppSync GraphQL API: arn:aws:appsync:region:account-id:apis/GraphQLApiId
      ])(),
  });
