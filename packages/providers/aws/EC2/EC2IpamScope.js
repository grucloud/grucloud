const assert = require("assert");
const { pipe, tap, get, pick, eq, switchCase, map, not } = require("rubico");
const { defaultsDeep, find, append, prepend, isEmpty } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags, findNameInTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EC2Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidIpamScopeId.NotFound"],
  getById: {
    pickId: pipe([({ IpamScopeId }) => ({ IpamScopeIds: [IpamScopeId] })]),
    method: "describeIpamScopes",
    getField: "IpamScopes",
  },
  getList: {
    method: "describeIpamScopes",
    getParam: "IpamScopes",
  },
  create: {
    method: "createIpamScope",
    pickCreated: ({ payload }) => pipe([get("IpamScope")]),
    isInstanceUp: eq(get("State"), "create-complete"),
  },
  destroy: {
    method: "deleteIpamScope",
    pickId: pipe([pick(["IpamScopeId"])]),
  },
});

const findName =
  ({ lives, config }) =>
  (live) =>
    pipe([
      () => [
        findNameInTags({}),
        get("Description"),
        // TODO add locale ?
        () => "ipam-scope",
      ],
      map((fn) => fn(live)),
      find(not(isEmpty)),
      tap((params) => {
        assert(true);
      }),
    ])();

const findId = () => pipe([get("IpamScopeId")]);

const managedByOther = () => get("IsDefault");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2IpamScope = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: ({ lives, config }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        switchCase([
          get("IsDefault"),
          (live) =>
            pipe([
              lives.getByType({
                type: "Ipam",
                group: "EC2",
                providerName: config.providerName,
              }),
              find(eq(get("live.IpamArn"), live.IpamArn)),
              get("name", live.IpamArn),
              tap((name) => {
                //assert(name);
              }),
              prepend(`ipam-scope::default::`),
              append(live.IpamScopeType),
            ])(),
          findName({ lives, config }),
        ]),
      ]),
    findId,
    cannotBeDeleted: managedByOther,
    managedByOther,
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { ipam },
      config,
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
