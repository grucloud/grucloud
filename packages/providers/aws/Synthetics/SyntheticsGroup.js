const assert = require("assert");
const { pipe, tap, get, assign, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { updateResourceArray } = require("@grucloud/core/updateResourceArray");

const { Tagger } = require("./SyntheticsCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);
const toGroupIdentifier = ({ Id }) => ({
  GroupIdentifier: Id,
});

const pickId = pipe([
  tap(({ Id }) => {
    assert(Id);
  }),
  toGroupIdentifier,
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Synthetics.html#listGroupResources-property
    assign({
      Canaries: pipe([
        toGroupIdentifier,
        endpoint().listGroupResources,
        get("Resources"),
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Synthetics.html#associateResource-property
const canaryAssociate = ({ endpoint, live }) =>
  pipe([
    tap((ResourceArn) => {
      assert(ResourceArn);
      assert(endpoint);
      assert(live.Id);
    }),
    (ResourceArn) => ({ ResourceArn, GroupIdentifier: live.Id }),
    endpoint().associateResource,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Synthetics.html#disassociateResource-property
const canaryDisssociate = ({ endpoint, live }) =>
  pipe([
    tap((ResourceArn) => {
      assert(ResourceArn);
      assert(endpoint);
      assert(live.Id);
    }),
    (ResourceArn) => ({ ResourceArn, GroupIdentifier: live.Id }),
    endpoint().disassociateResource,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Synthetics.html
exports.SyntheticsGroup = () => ({
  type: "Group",
  package: "synthetics",
  client: "Synthetics",
  propertiesDefault: {},
  omitProperties: ["Id", "Arn", "CreatedTime", "LastModifiedTime", "Canaries"],
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
      get("Arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    canaries: {
      type: "Canary",
      group: "Synthetics",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("Canaries")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Synthetics.html#getGroup-property
  getById: {
    method: "getGroup",
    getField: "Group",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Synthetics.html#listGroups-property
  getList: {
    method: "listGroups",
    getParam: "Groups",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Synthetics.html#createGroup-property
  create: {
    method: "createGroup",
    pickCreated: ({ payload }) => pipe([get("Group")]),
    postCreate:
      ({ endpoint, payload, created }) =>
      (live) =>
        pipe([
          tap((params) => {
            assert(live.Id);
          }),
          () => payload,
          get("Canaries"),
          map(
            pipe([
              (ResourceArn) => ({ ResourceArn, GroupIdentifier: live.Id }),
              endpoint().associateResource,
            ])
          ),
        ])(),
  },
  update:
    ({ endpoint, getById }) =>
    async ({ payload, live, diff }) =>
      pipe([
        () => ({ payload, live, diff }),
        updateResourceArray({
          endpoint,
          arrayPath: "Canaries",
          onAdd: canaryAssociate,
          onRemove: canaryDisssociate,
        }),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Synthetics.html#deleteGroup-property
  destroy: {
    method: "deleteGroup",
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
    dependencies: { canaries },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
        Canaries: pipe([
          () => canaries,
          map((canary) => getField(canary, "Arn")),
        ])(),
      }),
    ])(),
});
