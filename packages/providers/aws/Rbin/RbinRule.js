const assert = require("assert");
const {
  pipe,
  tap,
  get,
  eq,
  pick,
  flatMap,
  map,
  tryCatch,
  assign,
} = require("rubico");
const { defaultsDeep, identity, filterOut, isEmpty } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags, findNameInTagsOrId } = require("../AwsCommon");

const { Tagger, assignTags } = require("./RbinCommon");

const assignArn = ({ config }) =>
  pipe([
    assign({
      Arn: pipe([
        ({ Identifier }) =>
          `arn:aws:rbin:${
            config.region
          }:${config.accountId()}:rule/${Identifier}`,
      ]),
    }),
  ]);

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((id) => {
      assert(id);
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignArn({ config }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

const pickId = pipe([
  pick(["Identifier"]),
  tap(({ Identifier }) => {
    assert(Identifier);
  }),
]);

const findId = () =>
  pipe([
    get("Identifier"),
    tap((id) => {
      assert(id);
    }),
  ]);

exports.RbinRule = ({}) => ({
  type: "Rule",
  package: "rbin",
  client: "Rbin",
  findName: findNameInTagsOrId({ findId }),
  findId,
  ignoreErrorCodes: ["ResourceNotFoundException"],
  omitProperties: ["Arn", "Identifier", "Status", "LockState", "LockEndTime"],
  propertiesDefault: {},
  dependencies: {},
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rbin.html#getRule-property
  getById: {
    method: "getRule",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rbin.html#listRules-property
  getList: ({ endpoint, config }) =>
    pipe([
      () => ["EBS_SNAPSHOT", "EC2_IMAGE"],
      flatMap(
        tryCatch(
          pipe([
            (ResourceType) => ({ ResourceType }),
            endpoint().listRules,
            get("Rules"),
            map(
              pipe([pickId, endpoint().getRule, decorate({ endpoint, config })])
            ),
          ]),
          (error) =>
            pipe([
              tap((params) => {
                assert(error);
              }),
              () => undefined,
            ])()
        )
      ),
      filterOut(isEmpty),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rbin.html#createRule-property
  create: {
    method: "createRule",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: pipe([eq(get("Status"), "available")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rbin.html#updateRule-property
  update: {
    method: "updateRule",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rbin.html#deleteRule-property
  destroy: {
    method: "deleteRule",
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
        Tags: buildTags({
          name,
          config,
          namespace,
          UserTags: Tags,
        }),
      }),
    ])(),
});
