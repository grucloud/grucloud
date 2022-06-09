const assert = require("assert");
const { pipe, tap, get, pick, eq, not, map } = require("rubico");
const { defaultsDeep, isEmpty, find } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags, findNameInTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EC2Common");

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidIpamId.NotFound"],
  getById: {
    pickId: pipe([
      tap(({ IpamId }) => {
        assert(IpamId);
      }),
      ({ IpamId }) => ({ IpamIds: [IpamId] }),
    ]),
    method: "describeIpams",
    getField: "Ipams",
    decorate: ({ endpoint }) =>
      pipe([
        tap((params) => {
          assert(endpoint);
        }),
      ]),
  },
  getList: {
    method: "describeIpams",
    getParam: "Ipams",
    decorate: ({ endpoint, getById }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
      ]),
  },
  create: {
    method: "createIpam",
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        get("Ipam"),
      ]),
    isInstanceUp: eq(get("State"), "create-complete"),
  },
  destroy: {
    method: "deleteIpam",
    pickId: pipe([
      tap(({ IpamId }) => {
        assert(IpamId);
      }),
      pick(["IpamId"]),
      defaultsDeep({ Cascade: true }),
    ]),
  },
});

const findId = pipe([
  get("live.IpamId"),
  tap((IpamId) => {
    assert(IpamId);
  }),
]);

const findName = ({ live, lives, config }) =>
  pipe([
    () => [
      findNameInTags({}),
      get("live.Description"),
      // TODO add region ?
      () => "ipam",
    ],
    map((fn) => fn({ live, lives, config })),
    find(not(isEmpty)),
    tap((params) => {
      assert(true);
    }),
  ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2Ipam = ({ spec, config }) =>
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
      dependencies: {},
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          TagSpecifications: [
            {
              ResourceType: "ipam",
              Tags: buildTags({ config, namespace, name, UserTags: Tags }),
            },
          ],
        }),
      ])(),
  });
