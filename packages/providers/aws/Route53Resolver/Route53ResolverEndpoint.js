const assert = require("assert");
const { pipe, tap, get, eq, assign, map } = require("rubico");
const { defaultsDeep, first, pluck, callProp, when } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const {
  tagResource,
  untagResource,
  assignTags,
} = require("./Route53ResolverCommon");

const pickId = pipe([
  tap(({ Id }) => {
    assert(Id);
  }),
  ({ Id }) => ({ ResolverEndpointId: Id }),
]);

const model = ({ config }) => ({
  package: "route53resolver",
  client: "Route53Resolver",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#getResolverEndpoint-property
  getById: {
    method: "getResolverEndpoint",
    getField: "ResolverEndpoint",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#listResolverEndpoints-property
  getList: {
    method: "listResolverEndpoints",
    getParam: "ResolverEndpoints",
    decorate: ({ endpoint }) =>
      pipe([
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#listResolverEndpointIpAddresses-property
        assign({
          IpAddresses: ({ Id }) =>
            pipe([
              () => ({ ResolverEndpointId: Id }),
              endpoint().listResolverEndpointIpAddresses,
              get("IpAddresses"),
              callProp("sort", (a, b) =>
                a.CreationTime.localeCompare(b.CreationTime)
              ),
            ])(),
        }),
        assignTags({ endpoint }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#createResolverEndpoint-property
  create: {
    method: "createResolverEndpoint",
    pickCreated: ({ payload }) => pipe([get("ResolverEndpoint")]),
    isInstanceUp: pipe([eq(get("Status"), "OPERATIONAL")]),
    isInstanceError: pipe([eq(get("Status"), "ACTION_NEEDED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#updateResolverEndpoint-property
  update: {
    method: "updateResolverEndpoint",
    //TODO
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#deleteResolverEndpoint-property
  destroy: { method: "deleteResolverEndpoint", pickId },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html
exports.Route53ResolverEndpoint = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.Name")]),
    findId: pipe([get("live.Arn")]),
    findDependencies: ({ live }) => [
      {
        type: "SecurityGroup",
        group: "EC2",
        ids: live.SecurityGroupIds,
      },
      {
        type: "Subnet",
        group: "EC2",
        ids: pipe([() => live, get("IpAddresses"), pluck("SubnetId")])(),
      },
    ],
    getByName: ({ getList, endpoint }) =>
      pipe([
        ({ name }) => ({ Filters: [{ Name: "Name", Values: [name] }] }),
        getList,
        first,
      ]),
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { securityGroups },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Name: name,
          CreatorRequestId: `${new Date()}`,
          Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        }),
        when(
          () => securityGroups,
          defaultsDeep({
            SecurityGroupIds: pipe([
              () => securityGroups,
              map((sg) => getField(sg, "GroupId")),
            ])(),
          })
        ),
      ])(),
  });
