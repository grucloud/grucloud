const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  eq,
  not,
  pick,
  assign,
} = require("rubico");
const { defaultsDeep, isEmpty } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "SSMParameter" });
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");
const {
  createEndpoint,
  shouldRetryOnException,
  buildTags,
} = require("../AwsCommon");

const findName = get("live.Name");
const findId = get("live.Name");
const pickParam = pick(["Name"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html

exports.SSMParameter = ({ spec, config }) => {
  const ssm = () => createEndpoint({ endpointName: "SSM" })(config);

  const findDependencies = ({ live }) => [
    {
      type: "Key",
      group: "kms",
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
  const getByName = ({ name: Name }) =>
    tryCatch(
      pipe([
        tap(() => {
          assert(Name);
        }),
        () => ({ Name }),
        ssm().getParameter,
        get("Parameter"),
        assignTags,
      ]),
      switchCase([
        eq(get("code"), "ParameterNotFound"),
        () => undefined,
        (error) => {
          throw error;
        },
      ])
    )();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#describeParameters-property
  const getList = () =>
    pipe([
      () => ({}),
      ssm().describeParameters,
      get("Parameters"),
      map(({ Name }) => getByName({ name: Name })),
    ])();

  const isUpByName = pipe([getByName, not(isEmpty)]);
  const isDownByName = pipe([getByName, isEmpty]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#putParameter-property
  const create = ({ payload, name, namespace }) =>
    pipe([
      () => payload,
      ssm().putParameter,
      tap(() =>
        retryCall({
          name: `putParameter isUpByName: ${name}`,
          fn: () => isUpByName({ name }),
        })
      ),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#deleteParameter-property
  const destroy = ({ live }) =>
    pipe([
      tap(() => {
        assert(live.Name);
      }),
      () => live,
      pickParam,
      tryCatch(
        pipe([
          ssm().deleteParameter,
          () =>
            retryCall({
              name: `deleteParameter isDownByName: ${live.Name}`,
              fn: () => isDownByName({ name: live.Name }),
              config,
            }),
        ]),
        (error, params) =>
          pipe([
            tap(() => {
              logger.error(`error deleteParameter ${tos({ params, error })}`);
            }),
            () => error,
            switchCase([
              eq(get("code"), "ParameterNotFound"),
              () => undefined,
              () => {
                throw error;
              },
            ]),
          ])()
      ),
    ])();

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
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
  };
};
