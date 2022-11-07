const assert = require("assert");
const { pipe, tap, get, or, eq } = require("rubico");
const {
  defaultsDeep,
  first,
  unless,
  when,
  append,
  callProp,
  differenceWith,
  isDeepEqual,
} = require("rubico/x");

const { createAwsResource } = require("../AwsClient");

const resourceTypesAll = ["ECR", "EC2"];

const cannotBeDeleted = pipe([
  get("live"),
  eq(get("state.status"), "DISABLED"),
]);

const model = ({ config }) => ({
  package: "inspector2",
  client: "Inspector2",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  getById: {
    method: "batchGetAccountStatus",
    pickId: () => ({ accountIds: [] }),
    decorate: ({ endpoint }) =>
      pipe([
        get("accounts"),
        first,
        ({ resourceState: { ec2, ecr }, state }) =>
          pipe([
            () => [],
            when(
              pipe([() => ec2.status, callProp("startsWith", "ENA")]),
              append("EC2")
            ),
            when(
              pipe([() => ecr.status, callProp("startsWith", "ENA")]),
              append("ECR")
            ),
            (resourceTypes) => ({
              resourceTypes,
              state,
            }),
          ])(),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Inspector2.html#enable-property
  create: {
    method: "enable",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Inspector2.html#disable-property
  destroy: {
    method: "disable",
    pickId: ({ accountIds = [] }) => ({
      accountIds,
      resourceTypes: resourceTypesAll,
    }),
    isInstanceDown: pipe([eq(get("state.status"), "DISABLED")]),
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Inspector2.html
exports.Inspector2Enabler = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([() => "default"]),
    findId: pipe([() => "default"]),
    cannotBeDeleted,
    getList: ({ endpoint, getById }) => pipe([getById, (result) => [result]]),
    update:
      ({ endpoint, getById }) =>
      async ({ payload, live, diff }) =>
        pipe([
          () => diff,
          tap.if(
            or([get("liveDiff.deleted.resourceTypes")]),
            pipe([
              () => payload.resourceTypes,
              differenceWith(isDeepEqual, resourceTypesAll),
              (resourceTypes) => ({
                accountIds: payload.accountIds,
                resourceTypes,
              }),
              endpoint().disable,
            ])
          ),
          tap.if(
            or([get("liveDiff.added.resourceTypes")]),
            pipe([() => payload, endpoint().enable])
          ),
        ])(),
    getByName: ({ getList, endpoint, getById }) => pipe([getById]),
    configDefault: ({
      name,
      namespace,
      properties: { accountIds = [], ...otherProps },
    }) => pipe([() => otherProps, defaultsDeep({ accountIds })])(),
  });
