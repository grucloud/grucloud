const assert = require("assert");
const { map, pipe, tap, get, not, pick, assign } = require("rubico");
const { defaultsDeep, isEmpty, includes } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "SSMParameter" });
const {
  createEndpoint,
  shouldRetryOnException,
  buildTags,
} = require("../AwsCommon");

const { AwsClient } = require("../AwsClient");

const findName = get("live.Name");
const findId = get("live.Name");
const pickId = pick(["Name"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html

exports.SSMParameter = ({ spec, config }) => {
  const client = AwsClient({ spec, config });

  const ssm = () => createEndpoint({ endpointName: "SSM" })(config);

  const findDependencies = ({ live }) => [
    {
      type: "Key",
      group: "KMS",
      ids: [live.KeyId],
    },
  ];

  const findNamespace = pipe([
    tap((params) => {
      assert(true);
    }),
    () => "",
  ]);

  const assignTags = assign({
    Tags: pipe([
      ({ Name }) => ({
        ResourceId: Name,
        ResourceType: "Parameter",
      }),
      ssm().listTagsForResource,
      get("TagList"),
    ]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#getParameter-property
  const getById = client.getById({
    pickId,
    method: "getParameter",
    getField: "Parameter",
    decorate: () => assignTags,
    ignoreErrorCodes: ["ParameterNotFound"],
  });

  const getByName = ({ name }) => getById({ Name: name });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#describeParameters-property
  const getList = client.getList({
    method: "describeParameters",
    getParam: "Parameters",
    decorate: () => getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#putParameter-property
  const create = client.create({
    method: "putParameter",
    pickId,
    getById,
    config,
  });

  const update = client.update({
    pickId,
    method: "putParameter",
    extraParam: { Overwrite: true },
    config,
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#deleteParameter-property
  const destroy = client.destroy({
    pickId,
    method: "deleteParameter",
    getById,
    ignoreError: ({ code }) =>
      pipe([() => ["ParameterNotFound"], includes(code)]),
    config,
  });

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
    shouldRetryOnException,
  };
};
