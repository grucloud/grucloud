const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { buildTags } = require("../AwsCommon");

const { AwsClient } = require("../AwsClient");
const { createSSM } = require("./SSMCommon");

const ignoreErrorCodes = ["ParameterNotFound"];

const findName = get("live.Name");
const findId = get("live.Name");
const pickId = pipe([
  tap(({ Name }) => {
    assert(Name);
  }),
  pick(["Name"]),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html

exports.SSMParameter = ({ spec, config }) => {
  const ssm = createSSM(config);
  const client = AwsClient({ spec, config })(ssm);

  const findDependencies = ({ live }) => [
    {
      type: "Key",
      group: "KMS",
      ids: [live.KeyId],
    },
  ];

  const findNamespace = pipe([() => ""]);

  const assignTags = assign({
    Tags: pipe([
      ({ Name }) =>
        ssm().listTagsForResource({
          ResourceId: Name,
          ResourceType: "Parameter",
        }),
      get("TagList"),
    ]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#getParameter-property
  const getById = client.getById({
    pickId,
    method: "getParameter",
    getField: "Parameter",
    decorate: () => assignTags,
    ignoreErrorCodes,
  });

  const getByName = ({ name }) => getById({ Name: name });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#describeParameters-property
  const getList = client.getList({
    method: "describeParameters",
    getParam: "Parameters",
    decorate: () => getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#putParameter-property
  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Name: name,
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])();

  const create = client.create({
    method: "putParameter",
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    getById,
    config,
  });

  const update = client.update({
    pickId,
    method: "putParameter",
    extraParam: { Overwrite: true },
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#deleteParameter-property
  const destroy = client.destroy({
    pickId,
    method: "deleteParameter",
    getById,
    ignoreErrorCodes,
  });

  return {
    spec,
    findId,
    findNamespace,
    findDependencies,
    getByName,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
  };
};
