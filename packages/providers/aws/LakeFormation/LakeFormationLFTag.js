const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, callProp, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ TagKey }) => {
    assert(TagKey);
  }),
  pick(["TagKey"]),
]);

const decorate = ({ endpoint, live, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(live);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LakeFormation.html
exports.LakeFormationLFTag = () => ({
  type: "LFTag",
  package: "lakeformation",
  client: "LakeFormation",
  propertiesDefault: {},
  omitProperties: ["CatalogId"],
  inferName: ({}) => pipe([get("TagKey")]),
  findName: ({ lives, config }) =>
    pipe([
      get("TagKey"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("TagKey"),
      tap((id) => {
        assert(id);
      }),
    ]),
  //   compare: compare({
  //     filterTarget: () => pipe([omit(["compare"])]),
  //   }),
  // filterLive: ({ lives, providerConfig }) =>
  //   pipe([
  //     assign({
  //       RoleArn: pipe([
  //         get("RoleArn"),
  //         replaceAccountAndRegion({ lives, providerConfig }),
  //       ]),
  //     }),
  //   ]),
  dependencies: {},
  ignoreErrorCodes: ["EntityNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LakeFormation.html#getLFTag-property
  getById: {
    method: "getLFTag",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LakeFormation.html#listLFTags-property
  getList: {
    method: "listLFTags",
    getParam: "LFTags",
    decorate: ({ getById }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LakeFormation.html#createLFTag-property
  create: {
    method: "createLFTag",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LakeFormation.html#deleteLFTag-property
  destroy: {
    method: "deleteLFTag",
    pickId,
    //ignoreErrorMessages: [],
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      tap((params) => {
        assert(true);
      }),
    ])(),
});
