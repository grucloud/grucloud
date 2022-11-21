const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  assign,
  flatMap,
  map,
  tryCatch,
} = require("rubico");
const { defaultsDeep, unless } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./OrganisationsCommon");

const pickId = pipe([pick(["PolicyId"])]);

const buildArn = () => pipe([get("PolicyId")]);

const stringifyContent = assign({
  Content: pipe([get("Content"), JSON.stringify]),
});

const cannotBeDeleted = () => pipe([eq(get("AwsManaged"), true)]);

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

exports.OrganisationsPolicy = ({}) => ({
  type: "Policy",
  package: "organizations",
  client: "Organizations",
  ignoreErrorCodes: ["PolicyNotFoundException"],
  inferName: pipe([
    get("properties.Name"),
    tap((name) => {
      assert(name);
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
      get("PolicyId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  omitProperties: ["Arn", "PolicyId", "AwsManaged"],
  managedByOther: cannotBeDeleted,
  cannotBeDeleted,
  getByName: getByNameCore,
  getById: {
    method: "describePolicy",
    getField: "Policy",
    pickId,
    decorate,
  },
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
        tryCatch(
          pipe([
            (Filter) => ({ Filter }),
            endpoint().listPolicies,
            get("Policies"),
            map(pipe([({ Id }) => ({ PolicyId: Id }), getById({})])),
          ]),
          //TODO
          // AccessDeniedException
          (error) => undefined
        )
      ),
    ]),
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
        Tags: buildTags({
          name,
          config,
          namespace,
          UserTags: Tags,
        }),
      }),
    ])(),
});
