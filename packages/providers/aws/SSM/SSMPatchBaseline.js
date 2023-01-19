const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  omit,
  assign,
  switchCase,
  or,
} = require("rubico");
const {
  defaultsDeep,
  when,
  callProp,
  identity,
  last,
  unless,
  first,
  isEmpty,
} = require("rubico/x");
const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./SSMCommon");

const buildArn = () => get("BaselineId");

const pickId = pipe([
  pick(["BaselineId"]),
  tap(({ BaselineId }) => {
    assert(BaselineId);
  }),
]);

const managedByOther = () =>
  pipe([get("Name"), callProp("startsWith", "AWS-")]);

const omitDefaultBaseline = when(
  eq(get("DefaultBaseline"), false),
  pipe([omit(["DefaultBaseline"])])
);

const decorate = ({ endpoint, live }) =>
  pipe([
    defaultsDeep(live),
    omitIfEmpty([
      "GlobalFilters.PatchFilters",
      "GlobalFilters",
      "ApprovedPatches",
      "PatchGroups",
      "RejectedPatches",
      "Sources",
    ]),
    unless(
      managedByOther(),
      assign({
        Tags: pipe([
          get("BaselineId"),
          callProp("split", "/"),
          last,
          (ResourceId) => ({
            ResourceId,
            ResourceType: "PatchBaseline",
          }),
          endpoint().listTagsForResource,
          get("TagList"),
        ]),
      })
    ),
  ]);

const registerDefaultPatchBaseline = ({ endpoint }) =>
  pipe([
    tap(({ BaselineId }) => {
      assert(BaselineId);
    }),
    pick(["BaselineId"]),
    endpoint().registerDefaultPatchBaseline,
  ]);

const registerDefaultPatchBaselineDefault = ({ endpoint }) =>
  tap((live) =>
    pipe([
      tap(() => {
        assert(live.OperatingSystem);
      }),
      () => ({
        Filters: [
          {
            Key: "OWNER",
            Values: ["AWS"],
          },
          {
            Key: "OPERATING_SYSTEM",
            Values: [live.OperatingSystem],
          },
        ],
      }),
      endpoint().describePatchBaselines,
      get("BaselineIdentities"),
      first,
      unless(
        isEmpty,
        pipe([pick(["BaselineId"]), endpoint().registerDefaultPatchBaseline])
      ),
    ])()
  );

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html
exports.SSMPatchBaseline = () => ({
  type: "PatchBaseline",
  package: "ssm",
  client: "SSM",
  managedByOther,
  cannotBeDeleted: managedByOther,
  findName: () => get("Name"),
  findId: () =>
    pipe([
      get("BaselineId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  inferName: () => get("Name"),
  propertiesDefault: {
    ApprovedPatchesComplianceLevel: "UNSPECIFIED",
    ApprovedPatchesEnableNonSecurity: false,
  },
  omitProperties: ["BaselineId", "CreatedDate", "ModifiedDate"],
  ignoreErrorCodes: ["DoesNotExistException"],
  getById: {
    pickId,
    method: "getPatchBaseline",
    decorate,
  },
  getList: {
    enhanceParams: () => () => ({
      Filters: [
        {
          Key: "OWNER",
          Values: ["Self"],
        },
      ],
    }),
    method: "describePatchBaselines",
    getParam: "BaselineIdentities",
    decorate:
      ({ getById }) =>
      (live) =>
        pipe([() => live, getById])(),
  },
  create: {
    method: "createPatchBaseline",
    pickCreated: ({ payload }) => identity,
    postCreate:
      ({ endpoint, payload, created }) =>
      (live) =>
        pipe([
          () => payload,
          tap.if(
            get("DefaultBaseline"),
            pipe([() => live, registerDefaultPatchBaseline({ endpoint })])
          ),
        ])(),
  },
  update:
    ({ endpoint, getById }) =>
    async ({ payload, live, diff }) =>
      pipe([
        () => diff,
        tap((params) => {
          assert(payload);
        }),
        switchCase([
          pipe([() => payload, get("DefaultBaseline")]),
          pipe([() => live, registerDefaultPatchBaseline({ endpoint })]),
          pipe([() => live, registerDefaultPatchBaselineDefault({ endpoint })]),
        ]),
        () => payload,
        defaultsDeep(pickId(live)),
        tap((params) => {
          assert(true);
        }),
        endpoint().updatePatchBaseline,
        tap((params) => {
          assert(true);
        }),
      ])(),
  destroy: {
    preDestroy: registerDefaultPatchBaselineDefault,
    method: "deletePatchBaseline",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn(config),
      additionalParams: pipe([() => ({ ResourceType: "PatchBaseline" })]),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
