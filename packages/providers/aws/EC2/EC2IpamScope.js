const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EC2Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidIpamScopeId.NotFound"],
  getById: {
    pickId: pipe([
      tap(({ IpamScopeId }) => {
        assert(IpamScopeId);
      }),
      ({ IpamScopeId }) => ({ IpamScopeIds: [IpamScopeId] }),
    ]),
    method: "describeIpamScopes",
    getField: "IpamScopes",
    decorate: ({ endpoint }) =>
      pipe([
        tap((params) => {
          assert(endpoint);
        }),
      ]),
  },
  getList: {
    method: "describeIpamScopes",
    getParam: "IpamScopes",
    decorate: ({ endpoint, getById }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
      ]),
  },
  create: {
    method: "createIpamScope",
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        get("IpamScope"),
      ]),
    isInstanceUp: eq(get("State"), "create-complete"),
  },
  destroy: {
    method: "deleteIpamScope",
    pickId: pipe([
      tap(({ IpamScopeId }) => {
        assert(IpamScopeId);
      }),
      pick(["IpamScopeId"]),
    ]),
  },
});

const findId = pipe([
  get("live.IpamScopeId"),
  tap((IpamScopeId) => {
    assert(IpamScopeId);
  }),
]);

const managedByOther = get("live.IsDefault");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2IpamScope = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: pipe([
      tap((params) => {
        assert(true);
      }),
      //TODO default name
      findNameInTagsOrId({ findId }),
    ]),
    findId,
    cannotBeDeleted: managedByOther,
    managedByOther,
    findDependencies: ({ live, lives }) => [
      {
        type: "Ipam",
        group: "EC2",
        ids: [
          pipe([
            () =>
              lives.getByType({
                type: "Ipam",
                group: "EC2",
                providerName: config.providerName,
              }),
            find(eq(get("live.IpamArn"), live.IpamArn)),
            get("id"),
          ])(),
        ],
      },
    ],
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { ipam },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          IpamId: getField(ipam, "IpamId"),
          TagSpecifications: [
            {
              ResourceType: "ipam-scope",
              Tags: buildTags({ config, namespace, name, UserTags: Tags }),
            },
          ],
        }),
      ])(),
  });
