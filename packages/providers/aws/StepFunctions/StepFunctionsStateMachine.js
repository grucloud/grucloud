const assert = require("assert");
const { map, pipe, tap, get, pick, assign, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./StepFunctionsCommon");
const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pick(["stateMachineArn"]);

const decorate = ({ endpoint }) =>
  pipe([
    assign({
      definition: pipe([get("definition"), JSON.parse]),
      tags: pipe([
        ({ stateMachineArn }) => ({
          resourceArn: stateMachineArn,
        }),
        endpoint().listTagsForResource,
        get("tags"),
      ]),
    }),
  ]);

const model = {
  package: "sfn",
  client: "SFN",
  ignoreErrorCodes: ["StateMachineDoesNotExist"],
  getById: {
    method: "describeStateMachine",
    pickId,
    decorate,
  },
  getList: {
    method: "listStateMachines",
    getParam: "stateMachines",
    decorate: ({ getById }) => getById,
  },
  create: {
    method: "createStateMachine",
    filterPayload: pipe([
      assign({
        definition: pipe([get("definition"), JSON.stringify]),
      }),
    ]),
    shouldRetryOnExceptionCodes: ["AccessDeniedException"],
  },
  update: { method: "updateStateMachine" },
  destroy: { method: "deleteStateMachine", pickId },
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StepFunctions.html
exports.StepFunctionsStateMachine = ({ spec, config }) =>
  createAwsResource({
    model,
    spec,
    config,
    findName: get("live.name"),
    findId: get("live.stateMachineArn"),
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { tags, ...otherProps },
      dependencies: { role },
    }) =>
      pipe([
        tap((params) => {
          assert(role);
        }),
        () => otherProps,
        defaultsDeep({
          name,
          tags: buildTags({
            name,
            config,
            namespace,
            UserTags: tags,
            key: "key",
            value: "value",
          }),
          roleArn: getField(role, "Arn"),
        }),
      ])(),
  });
