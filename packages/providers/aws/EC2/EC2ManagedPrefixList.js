const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  assign,
  fork,
  switchCase,
} = require("rubico");
const { defaultsDeep, first, values } = require("rubico/x");

const { buildTags, replaceRegion } = require("../AwsCommon");
const { tagResource, untagResource } = require("./EC2Common");

const findId = () => get("PrefixListId");
const pickId = pick(["PrefixListId"]);
const findName = () => get("PrefixListName");

const ignoreErrorCodes = ["InvalidPrefixListID.NotFound"];

const cannotBeDeleted = () => eq(get("OwnerId"), "AWS");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#getManagedPrefixListEntries-property
const decorate = ({ endpoint }) =>
  pipe([
    assign({
      Entries: pipe([
        pickId,
        pick(["PrefixListId"]),
        endpoint().getManagedPrefixListEntries,
        get("Entries"),
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2ManagedPrefixList = ({ compare }) => ({
  type: "ManagedPrefixList",
  package: "ec2",
  client: "EC2",
  inferName: () => get("PrefixListName"),
  managedByOther: cannotBeDeleted,
  cannotBeDeleted: cannotBeDeleted,
  findName,
  findId,
  compare: compare({
    filterAll: () => pipe([pick(["Entries", "MaxEntries"])]),
  }),
  omitProperties: [
    "PrefixListId",
    "State",
    "PrefixListArn",
    "Version",
    "OwnerId",
  ],
  filterLive: ({ providerConfig, lives }) =>
    pipe([
      pick(["PrefixListName", "AddressFamily", "MaxEntries", "Entries"]),
      assign({
        PrefixListName: pipe([
          get("PrefixListName"),
          replaceRegion({ providerConfig }),
        ]),
      }),
    ]),
  ignoreErrorCodes,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeManagedPrefixLists-property
  getById: {
    pickId: pipe([({ PrefixListId }) => ({ PrefixListIds: [PrefixListId] })]),
    method: "describeManagedPrefixLists",
    getField: "PrefixLists",
    ignoreErrorCodes,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeManagedPrefixLists-property
  getList: {
    method: "describeManagedPrefixLists",
    getParam: "PrefixLists",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createManagedPrefixList-property
  create: {
    method: "createManagedPrefixList",
    pickCreated: () => pipe([get("PrefixList")]),
    isInstanceUp: eq(get("State"), "create-complete"),
    isInstanceError: eq(get("State"), "create-failed"),
    getErrorMessage: get("StateMessage", "create-failed"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#modifyManagedPrefixList-property
  update: {
    method: "modifyManagedPrefixList",
    filterParams: ({ payload, live, diff }) =>
      pipe([
        () => diff,
        switchCase([
          get("liveDiff.updated.MaxEntries"),
          fork({ MaxEntries: () => payload.MaxEntries }),
          fork({
            CurrentVersion: () => live.Version,
            AddEntries: pipe([get("liveDiff.updated.Entries", {}), values]),
            RemoveEntries: pipe([
              get("targetDiff.updated.Entries", {}),
              values,
            ]),
          }),
        ]),
        assign({ PrefixListId: () => live.PrefixListId }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteManagedPrefixList-property
  destroy: {
    pickId,
    method: "deleteManagedPrefixList",
    isInstanceError: eq(get("State"), "delete-failed"),
    getErrorMessage: get("StateMessage", "delete-failed"),
    ignoreErrorCodes,
    ignoreErrorMessages: [
      "The action is not supported for an AWS-managed prefix list",
    ],
  },
  getByName: ({ endpoint }) =>
    pipe([
      ({ name }) => ({
        Filters: [
          {
            Name: "prefix-list-name",
            Values: [name],
          },
        ],
      }),
      endpoint().describeManagedPrefixLists,
      get("PrefixLists"),
      first,
    ]),
  tagger: () => ({ tagResource: tagResource, untagResource: untagResource }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies,
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        TagSpecifications: [
          {
            ResourceType: "prefix-list",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
    ])(),
});
