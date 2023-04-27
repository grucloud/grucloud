const assert = require("assert");
const {
  pipe,
  tap,
  get,
  eq,
  assign,
  map,
  and,
  not,
  filter,
  fork,
} = require("rubico");
const {
  defaultsDeep,
  first,
  pluck,
  callProp,
  when,
  isEmpty,
  unless,
} = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");
const { ipToInt32 } = require("@grucloud/core/ipUtils");
const { replaceWithName } = require("@grucloud/core/Common");

const { buildTags, getNewCallerReference } = require("../AwsCommon");
const { Tagger, assignTags } = require("./Route53ResolverCommon");

const pickId = pipe([({ Id }) => ({ ResolverEndpointId: Id })]);

const decorate = ({ endpoint }) =>
  pipe([
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#listResolverEndpointIpAddresses-property
    assign({
      IpAddresses: pipe([
        pickId,
        endpoint().listResolverEndpointIpAddresses,
        get("IpAddresses", []),
        filter(get("Ip")),
        callProp("sort", (a, b) =>
          ipToInt32(a.Ip) > ipToInt32(b.Ip) ? 1 : -1
        ),
      ]),
    }),
    assignTags({ endpoint }),
  ]);

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html
exports.Route53ResolverEndpoint = ({}) => ({
  type: "Endpoint",
  package: "route53resolver",
  client: "Route53Resolver",
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () => pipe([get("Name")]),
  findId: () => pipe([get("Arn")]),
  getByName: ({ getList, endpoint }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      ({ name }) => ({ Filters: [{ Name: "Name", Values: [name] }] }),
      endpoint().listResolverEndpoints,
      get("ResolverEndpoints"),
      tap((params) => {
        assert(true);
      }),
      //TODO getList,
      first,
      unless(isEmpty, decorate({ endpoint })),
      tap((params) => {
        assert(true);
      }),
    ]),
  propertiesDefault: { ResolverEndpointType: "IPV4" },
  omitProperties: [
    "Id",
    "CreatorRequestId",
    "SecurityGroupIds",
    "Status",
    "Arn",
    "StatusMessage",
    "CreationTime",
    "ModificationTime",
    "IpAddressCount",
    "HostVPCId",
    "IpAddresses[].CreationTime",
    "IpAddresses[].Ip",
    "IpAddresses[].IpId",
    "IpAddresses[].ModificationTime",
    "IpAddresses[].Status",
    "IpAddresses[].StatusMessage",
  ],
  dependencies: {
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("SecurityGroupIds"),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("IpAddresses"), pluck("SubnetId")]),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      assign({
        IpAddresses: pipe([
          get("IpAddresses"),
          map(
            fork({
              SubnetId: pipe([
                get("SubnetId"),
                replaceWithName({
                  type: "Subnet",
                  group: "EC2",
                  pathLive: "id",
                  path: "id",
                  lives,
                  providerConfig,
                }),
              ]),
            })
          ),
        ]),
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#getResolverEndpoint-property
  getById: {
    method: "getResolverEndpoint",
    getField: "ResolverEndpoint",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#listResolverEndpoints-property
  getList: {
    method: "listResolverEndpoints",
    getParam: "ResolverEndpoints",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#createResolverEndpoint-property
  create: {
    method: "createResolverEndpoint",
    pickCreated: ({ payload }) => pipe([get("ResolverEndpoint")]),
    isInstanceUp: pipe([
      and([
        eq(get("Status"), "OPERATIONAL"),
        pipe([get("IpAddresses"), pluck("Ip"), not(isEmpty)]),
      ]),
    ]),
    isInstanceError: pipe([eq(get("Status"), "ACTION_NEEDED")]),
    getErrorMessage: get("StatusMessage", "error"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#updateResolverEndpoint-property
  update: {
    method: "updateResolverEndpoint",
    //TODO
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#deleteResolverEndpoint-property
  destroy: { method: "deleteResolverEndpoint", pickId },
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { securityGroups },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        CreatorRequestId: getNewCallerReference(),
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
