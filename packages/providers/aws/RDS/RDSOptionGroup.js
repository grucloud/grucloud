const assert = require("assert");
const { pipe, tap, get, pick, assign, map, and, filter } = require("rubico");
const { defaultsDeep, callProp, unless, isEmpty } = require("rubico/x");
const { updateResourceArray } = require("@grucloud/core/updateResourceArray");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./RDSCommon");

const isDefaultParameterGroup = pipe([
  get("OptionGroupName"),
  callProp("startsWith", "default:"),
]);

const managedByOther = () => pipe([isDefaultParameterGroup]);

const buildArn = () =>
  pipe([
    get("OptionGroupArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ OptionGroupName }) => {
    assert(OptionGroupName);
  }),
  pick(["OptionGroupName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
    assign({
      Options: pipe([
        get("Options"),
        map(
          pipe([
            omitIfEmpty([
              "DBSecurityGroupMemberships",
              "VpcSecurityGroupMemberships",
            ]),
            assign({
              OptionSettings: pipe([
                get("OptionSettings"),
                filter(and([get("Value"), get("IsModifiable")])),
              ]),
            }),
          ])
        ),
      ]),
    }),
  ]);

const modifyOptionGroupAdd = ({ endpoint, live }) =>
  pipe([
    (OptionToInclude) => ({
      OptionsToInclude: [OptionToInclude],
      OptionGroupName: live.OptionGroupName,
      ApplyImmediately: true,
    }),
    endpoint().modifyOptionGroup,
  ]);

const modifyOptionGroupRemove = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(live.OptionGroupName);
    }),
    ({ OptionName }) => ({
      OptionsToRemove: [OptionName],
      OptionGroupName: live.OptionGroupName,
      ApplyImmediately: true,
    }),
    endpoint().modifyOptionGroup,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html
exports.RDSOptionGroup = () => ({
  type: "OptionGroup",
  package: "rds",
  client: "RDS",
  propertiesDefault: {},
  omitProperties: [
    "VpcId",
    "AllowsVpcAndNonVpcInstanceMemberships",
    "OptionGroupArn",
    "SourceAccountId",
    "SourceOptionGroup",
    "CopyTimestamp",
  ],
  inferName: () =>
    pipe([
      get("OptionGroupName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("OptionGroupName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("OptionGroupName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  managedByOther,
  cannotBeDeleted: managedByOther,
  ignoreErrorCodes: ["OptionGroupNotFoundFault"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#describeOptionGroups-property
  getById: {
    method: "describeOptionGroups",
    getField: "OptionGroupsList",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#describeOptionGroups-property
  getList: {
    method: "describeOptionGroups",
    getParam: "OptionGroupsList",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createOptionGroup-property
  create: {
    method: "createOptionGroup",
    pickCreated: ({ payload }) => pipe([() => payload]),
    postCreate:
      ({ endpoint, payload, created }) =>
      (live) =>
        pipe([
          () => payload,
          get("Options", []),
          tap((id) => {
            assert(id);
          }),
          unless(isEmpty, map(modifyOptionGroupAdd({ endpoint, live }))),
        ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#modifyOptionGroup-property
  update:
    ({ endpoint, getById }) =>
    async ({ payload, live, diff }) =>
      pipe([
        () => ({ payload, live, diff }),
        updateResourceArray({
          endpoint,
          arrayPath: "Options",
          onAdd: modifyOptionGroupAdd,
          onRemove: modifyOptionGroupRemove,
        }),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#deleteOptionGroup-property
  destroy: {
    method: "deleteOptionGroup",
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
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
