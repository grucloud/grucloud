const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, flatMap, map } = require("rubico");
const { defaultsDeep, unless } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");

const { tagResource, untagResource } = require("./OrganisationsCommon");

const pickId = pipe([pick(["PolicyId"])]);

const buildArn = () => pipe([get("PolicyId")]);

const stringifyContent = assign({
  Content: pipe([get("Content"), JSON.stringify]),
});

const cannotBeDeleted = pipe([get("live"), eq(get("AwsManaged"), true)]);

const decorate = ({ endpoint }) =>
  pipe([
    ({ PolicySummary, ...other }) => ({ ...other, ...PolicySummary }),
    ({ Id, ...other }) => ({ PolicyId: Id, ...other }),
    assign({
      Content: pipe([get("Content"), JSON.parse]),
    }),
    unless(
      get("AwsManaged"),
      assign({
        Tags: pipe([
          ({ PolicyId }) => ({ ResourceId: PolicyId }),
          endpoint().listTagsForResource,
          get("Tags"),
        ]),
      })
    ),
  ]);

const model = ({ config }) => ({
  package: "organizations",
  client: "Organizations",
  ignoreErrorCodes: ["PolicyNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#describePolicy-property
  getById: {
    method: "describePolicy",
    getField: "Policy",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#createPolicy-property
  create: {
    method: "createPolicy",
    filterPayload: pipe([stringifyContent]),
    pickCreated: ({ payload }) =>
      pipe([
        get("Policy"),
        get("PolicySummary"),
        ({ Id }) => ({ PolicyId: Id }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#updatePolicy-property
  update: {
    method: "updatePolicy",
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        defaultsDeep({ PolicyId: live.PolicyId }),
        stringifyContent,
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#deletePolicy-property
  destroy: {
    method: "deletePolicy",
    pickId,
  },
});

exports.OrganisationsPolicy = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.Name")]),
    findId: pipe([get("live.PolicyId")]),
    managedByOther: cannotBeDeleted,
    cannotBeDeleted,
    getByName: getByNameCore,
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#listPolicies-property
    getList: ({ client, endpoint, getById, config }) =>
      pipe([
        () => [
          "SERVICE_CONTROL_POLICY",
          "TAG_POLICY",
          "BACKUP_POLICY",
          "AISERVICES_OPT_OUT_POLICY",
        ],
        flatMap(
          pipe([
            (Filter) => ({ Filter }),
            endpoint().listPolicies,
            get("Policies"),
            map(pipe([({ Id }) => ({ PolicyId: Id }), getById])),
          ])
        ),
      ]),
    tagResource: tagResource({
      buildArn: buildArn(config),
    }),
    untagResource: untagResource({
      buildArn: buildArn(config),
    }),
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: {},
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Tags: buildTags({
            name,
            config,
            namespace,
            UserTags: Tags,
          }),
        }),
      ])(),
  });
