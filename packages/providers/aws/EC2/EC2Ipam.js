const assert = require("assert");
const { pipe, tap, get, pick, eq, not, map, assign } = require("rubico");
const { defaultsDeep, isEmpty, find } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags, findNameInTags, replaceRegion } = require("../AwsCommon");
const { tagResource, untagResource, assignIpamRegion } = require("./EC2Common");

const findId = () => pipe([get("IpamId")]);

const findName =
  ({ lives, config }) =>
  (live) =>
    pipe([
      () => [
        findNameInTags({}),
        get("Description"),
        // TODO add region ?
        () => "ipam",
      ],
      map((fn) => fn(live)),
      find(not(isEmpty)),
      tap((params) => {
        assert(true);
      }),
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2Ipam = ({ compare }) => ({
  type: "Ipam",
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidIpamId.NotFound"],
  findName,
  findId,
  omitProperties: [
    "IpamArn",
    "IpamId",
    "PublicDefaultScopeId",
    "PrivateDefaultScopeId",
    "ScopeCount",
    "OwnerId",
    "State",
  ],
  filterLive: ({ providerConfig }) =>
    pipe([
      assignIpamRegion({ providerConfig }),
      assign({
        OperatingRegions: pipe([
          get("OperatingRegions"),
          map(
            assign({
              RegionName: pipe([
                get("RegionName"),
                replaceRegion({ providerConfig }),
              ]),
            })
          ),
        ]),
      }),
    ]),
  getById: {
    pickId: pipe([({ IpamId }) => ({ IpamIds: [IpamId] })]),
    method: "describeIpams",
    getField: "Ipams",
  },
  getList: {
    method: "describeIpams",
    getParam: "Ipams",
  },
  create: {
    method: "createIpam",
    pickCreated: ({ payload }) => pipe([get("Ipam")]),
    isInstanceUp: eq(get("State"), "create-complete"),
  },
  destroy: {
    method: "deleteIpam",
    pickId: pipe([pick(["IpamId"]), defaultsDeep({ Cascade: true })]),
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource: tagResource, untagResource: untagResource }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
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
