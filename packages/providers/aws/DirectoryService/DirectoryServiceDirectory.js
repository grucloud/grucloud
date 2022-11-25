const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  map,
  omit,
  assign,
  tryCatch,
  switchCase,
  or,
} = require("rubico");
const {
  defaultsDeep,
  first,
  identity,
  pluck,
  isEmpty,
  when,
} = require("rubico/x");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { updateResourceArray } = require("@grucloud/core/updateResourceArray");

const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags, replaceAccountAndRegion } = require("../AwsCommon");

const { Tagger } = require("./DirectoryServiceCommon");

const buildArn = () =>
  pipe([
    get("DirectoryId"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ DirectoryId }) => {
    assert(DirectoryId);
  }),
  pick(["DirectoryId"]),
]);

const assignTags = ({ buildArn, endpoint }) =>
  pipe([
    assign({
      Tags: pipe([
        buildArn(),
        (ResourceId) => ({ ResourceId }),
        endpoint().listTagsForResource,
        get("Tags"),
      ]),
    }),
  ]);

const decorate = ({ endpoint }) =>
  pipe([
    assignTags({ buildArn, endpoint }),
    assign({
      EventTopics: tryCatch(
        pipe([pickId, endpoint().describeEventTopics, get("EventTopics")]),
        // Could not describe event topics as directory d-xxxxxxxx is in Deleting state.
        (error) => undefined
      ),
    }),
    omitIfEmpty(["EventTopics"]),
    when(
      pipe([get("RegionsInfo.AdditionalRegions"), isEmpty]),
      omit(["RegionsInfo"])
    ),
  ]);

const registerEventTopic = ({ endpoint, live }) =>
  pipe([defaultsDeep(pickId(live)), endpoint().registerEventTopic]);

const deregisterEventTopic = ({ endpoint, live }) =>
  pipe([endpoint().deregisterEventTopic]);

const updateRadius =
  ({ endpoint, getById }) =>
  async ({ payload, live, diff }) =>
    pipe([
      () => diff,
      switchCase([
        // Added
        or([eq(get("targetDiff.updated.RadiusSettings"), undefined)]),
        pipe([
          () => ({
            DirectoryId: live.DirectoryId,
            RadiusSettings: payload.RadiusSettings,
          }),
          endpoint().enableRadius,
        ]),
        // Update
        or([get("liveDiff.updated.RadiusSettings")]),
        pipe([
          () => ({
            DirectoryId: live.DirectoryId,
            RadiusSettings: payload.RadiusSettings,
          }),
          endpoint().updateRadius,
        ]),
        // Deleted
        or([get("targetDiff.added.RadiusSettings")]),
        pipe([
          () => ({
            DirectoryId: live.DirectoryId,
          }),
          endpoint().disableRadius,
        ]),
      ]),
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html
exports.DirectoryServiceDirectory = ({ compare }) => ({
  type: "Directory",
  package: "directory-service",
  client: "DirectoryService",
  propertiesDefault: {},
  omitProperties: [
    "Alias",
    //"Type",
    "DesiredNumberOfDomainControllers",
    "SsoEnabled",
    "DirectoryId",
    "AccessUrl",
    "DnsIpAddrs",
    "Stage",
    "ShareStatus",
    "ShareMethod",
    "ShareNotes",
    "LaunchTime",
    "StageLastUpdatedDateTime",
    "VpcSettings",
    "OsVersion",
    "EventTopics[].DirectoryId",
    "EventTopics[].TopicArn",
    "EventTopics[].CreatedDateTime",
    "EventTopics[].Status",
    "RadiusStatus",
  ],
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("DirectoryId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  environmentVariables: [
    { path: "Password", suffix: "PASSWORD" },
    {
      path: "RadiusSettings.SharedSecret",
      suffix: "RADIUS_SHAREDSECRET",
      rejectEnvironmentVariable: () => pipe([get("RadiusSettings"), isEmpty]),
    },
  ],
  compare: compare({
    filterAll: () => pipe([omit(["Password", "RadiusSettings.SharedSecret"])]),
  }),
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      when(
        get("RegionsInfo"),
        assign({
          RegionsInfo: pipe([
            get("RegionsInfo"),
            assign({
              PrimaryRegion: pipe([
                get("PrimaryRegion"),
                replaceAccountAndRegion({
                  providerConfig,
                  lives,
                }),
              ]),
            }),
          ]),
        })
      ),
    ]),
  // TODO SecurityGroupId
  dependencies: {
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("VpcSettings.SubnetIds"),
    },
    snsTopics: {
      type: "Topic",
      group: "SNS",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("EventTopics"), pluck("TopicArn")]),
    },
  },
  ignoreErrorCodes: ["EntityDoesNotExistException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html#getDirectory-property
  getById: {
    method: "describeDirectories",
    getField: "DirectoryDescriptions",
    pickId: ({ DirectoryId }) => ({
      DirectoryIds: [DirectoryId],
    }),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html#listDirectorys-property
  getList: {
    method: "describeDirectories",
    getParam: "DirectoryDescriptions",
    decorate: ({ getById }) => pipe([getById]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html#createDirectory-property
  create: {
    method: () =>
      pipe([
        switchCase([
          eq(get("Type"), "SimpleAD"),
          () => "createDirectory",
          eq(get("Type"), "MicrosoftAD"),
          () => "createMicrosoftAD",
          ({ Type }) => {
            assert(false, `type ${Type} should be SimpleAD or MicrosoftAD`);
          },
        ]),
      ]),
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: pipe([eq(get("Stage"), "Active")]),
    isInstanceError: pipe([eq(get("Status"), "Failed")]),
    getErrorMessage: get("StageReason", "error"),
    configIsUp: { retryCount: 45 * 6, retryDelay: 10e3 },
    postCreate:
      ({ endpoint, payload, created }) =>
      (live) =>
        pipe([
          () => payload,
          get("EventTopics", []),
          map(pipe([registerEventTopic({ endpoint, live })])),
          // Radius
          tap((params) => {
            assert(live.DirectoryId);
          }),
          () => payload,
          when(
            get("RadiusSettings"),
            pipe([
              pick(["RadiusSettings"]),
              defaultsDeep({ DirectoryId: live.DirectoryId }),
              endpoint().enableRadius,
            ])
          ),
        ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html#updateDirectory-property
  update:
    ({ endpoint, getById }) =>
    async ({ payload, live, diff }) =>
      pipe([
        () => ({ payload, live, diff }),
        updateResourceArray({
          endpoint,
          arrayPath: "EventTopics",
          onAdd: registerEventTopic,
          onRemove: deregisterEventTopic,
        }),
        () => ({ payload, live, diff }),
        updateRadius({ endpoint }),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html#deleteDirectory-property
  destroy: {
    method: "deleteDirectory",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { subnets },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(subnets);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        VpcSettings: {
          SubnetIds: pipe([
            () => subnets,
            map((subnet) => getField(subnet, "SubnetId")),
          ])(),
          VpcId: pipe([
            () => subnets,
            first,
            (subnet) => getField(subnet, "VpcId"),
          ])(),
        },
      }),
    ])(),
});
