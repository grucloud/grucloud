const assert = require("assert");
const { pipe, tap, get, pick, eq, omit, assign } = require("rubico");
const { defaultsDeep, find, when } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EC2Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidIpamPoolId.NotFound"],
  getById: {
    pickId: pipe([
      tap(({ IpamPoolId }) => {
        assert(IpamPoolId);
      }),
      ({ IpamPoolId }) => ({ IpamPoolIds: [IpamPoolId] }),
    ]),
    method: "describeIpamPools",
    getField: "IpamPools",
    decorate: ({ endpoint }) =>
      pipe([
        tap((params) => {
          assert(endpoint);
        }),
      ]),
  },
  getList: {
    method: "describeIpamPools",
    getParam: "IpamPools",
    decorate: ({ endpoint, getById }) =>
      pipe([
        assign({
          Allocations: pipe([
            pick(["IpamPoolId"]),
            endpoint().getIpamPoolAllocations,
            get("IpamPoolAllocations"),
          ]),
        }),
      ]),
  },
  create: {
    method: "createIpamPool",
    pickCreated: ({ payload }) => pipe([get("IpamPool")]),
    isInstanceUp: eq(get("State"), "create-complete"),
  },
  //TODO
  update: {
    method: "modifyIpamPool",
    pickId: pipe([pick(["IpamPoolId"])]),
    filterParams: ({ pickId, payload, live }) =>
      pipe([
        () => payload,
        tap((params) => {
          assert(pickId);
        }),
        omit(["TagSpecifications"]),
        defaultsDeep(pickId(live)),
        tap((params) => {
          assert(true);
        }),
      ])(),
    isInstanceUp: eq(get("State"), "create-complete"),
  },
  destroy: {
    method: "deleteIpamPool",
    pickId: pipe([pick(["IpamPoolId"])]),
  },
});

const findId = pipe([get("live.IpamPoolId")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2IpamPool = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: findNameInTagsOrId({ findId }),
    findId,
    findDependencies: ({ live, lives }) => [
      {
        type: "IpamScope",
        group: "EC2",
        ids: [
          pipe([
            () =>
              lives.getByType({
                type: "IpamScope",
                group: "EC2",
                providerName: config.providerName,
              }),
            find(eq(get("live.IpamScopeArn"), live.IpamScopeArn)),
            get("id"),
            tap((id) => {
              assert(id);
            }),
          ])(),
        ],
      },
      {
        type: "IpamPool",
        group: "EC2",
        ids: [pipe([() => live.SourceIpamPoolId])()],
      },
    ],
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { ipamScope, ipamPoolSource },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          IpamScopeId: getField(ipamScope, "IpamScopeId"),
          TagSpecifications: [
            {
              ResourceType: "ipam-pool",
              Tags: buildTags({ config, namespace, name, UserTags: Tags }),
            },
          ],
        }),
        when(
          () => ipamPoolSource,
          defaultsDeep({
            SourceIpamPoolId: getField(ipamPoolSource, "IpamPoolId"),
          })
        ),
      ])(),
  });
