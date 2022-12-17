const assert = require("assert");
const { pipe, tap, get, pick, eq, omit, assign, map, not } = require("rubico");
const { defaultsDeep, find, when, isEmpty } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags, findNameInTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EC2Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const findName =
  ({ lives, config }) =>
  (live) =>
    pipe([
      () => [
        findNameInTags({}),
        get("Description"),
        // TODO add locale ?
        pipe([({ live }) => "ipam-pool"]),
      ],
      map((fn) => fn(live)),
      find(not(isEmpty)),
      tap((params) => {
        assert(true);
      }),
    ])();

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
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        omit(["TagSpecifications"]),
        defaultsDeep(pickId(live)),
      ])(),
    isInstanceUp: eq(get("State"), "create-complete"),
  },
  destroy: {
    method: "deleteIpamPool",
    pickId: pipe([pick(["IpamPoolId"])]),
  },
});

const findId = () => pipe([get("IpamPoolId")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2IpamPool = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName,
    findId,
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
