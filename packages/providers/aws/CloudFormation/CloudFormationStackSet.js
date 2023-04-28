const assert = require("assert");
const { pipe, tap, get, pick, assign, map } = require("rubico");
const { defaultsDeep, when, callProp } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const managedByOther = () =>
  pipe([get("StackSetName"), callProp("startsWith", "AWS-")]);

const pickId = pipe([
  tap(({ StackSetName }) => {
    assert(StackSetName);
  }),
  pick(["StackSetName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFormation.html
exports.CloudFormationStackSet = () => ({
  type: "StackSet",
  package: "cloudformation",
  client: "CloudFormation",
  propertiesDefault: {},
  omitProperties: [
    "AdministrationRoleARN",
    "StackSetId",
    "Status",
    "StackSetARN",
    "StackSetDriftDetectionDetails",
    "OrganizationalUnitIds",
  ],
  managedByOther,
  cannotBeDeleted: managedByOther,
  inferName: () =>
    pipe([
      get("StackSetName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("StackSetName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("StackSetARN"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["StackSetNotFoundException"],
  dependencies: {
    iamAdministrativeRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("AdministrationRoleARN")]),
    },
    organisationalUnits: {
      type: "OrganisationalUnit",
      group: "Organisations",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("OrganizationalUnitIds")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFormation.html#describeStackSet-property
  getById: {
    method: "describeStackSet",
    getField: "StackSet",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFormation.html#listStackSets-property
  getList: {
    method: "listStackSets",
    getParam: "Summaries",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFormation.html#createStackSet-property
  create: {
    method: "createStackSet",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFormation.html#updateStackSet-property
  update: {
    method: "updateStackSet",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFormation.html#deleteStackSet-property
  destroy: {
    method: "deleteStackSet",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { iamAdministrativeRole, organisationalUnits },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => organisationalUnits,
        assign({
          OrganizationalUnitIds: pipe([
            () => organisationalUnits,
            map((organisationalUnit) => getField(organisationalUnit, "Id")),
          ]),
        })
      ),
      when(
        () => iamAdministrativeRole,
        assign({
          AdministrationRoleARN: () => getField(iamAdministrativeRole, "Arn"),
        })
      ),
    ])(),
});
