const assert = require("assert");
const { pipe, tap, get, pick, eq, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");

const { Tagger } = require("./LightsailCommon");

const buildArn = () =>
  pipe([
    get("serviceName"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ serviceName }) => {
    assert(serviceName);
  }),
  pick(["serviceName"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    ({ containerServiceName, ...other }) => ({
      serviceName: containerServiceName,
      ...other,
    }),
  ]);

const model = ({ config }) => ({
  package: "lightsail",
  client: "Lightsail",
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getContainerServices-property
  getById: {
    method: "getContainerServices",
    getField: "containerServices",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getContainerServices-property
  getList: {
    method: "getContainerServices",
    getParam: "containerServices",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#createContainerService-property
  create: {
    method: "createContainerService",
    pickCreated: ({ payload }) => pipe([() => payload]),
    //pickCreated: ({ payload }) => pipe([get("containerService")]),
    isInstanceUp: pipe([eq(get("state"), "RUNNING")]),
    // isInstanceError: pipe([eq(get("Status"), "ACTION_NEEDED")]),
    // getErrorMessage: get("stateDetail.message", "error"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#updateContainerService-property
  update: {
    method: "updateContainerService",
    filterParams: ({ pickId, payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#deleteContainerService-property
  destroy: {
    method: "deleteContainerService",
    pickId,
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html
exports.LightsailContainerService = () => ({
  type: "ContainerService",
  propertiesDefault: { isDisabled: false },
  omitProperties: [
    "arn",
    "supportCode",
    "resourceType",
    "createdAt",
    "powerId",
    "state",
    "location",
    "stateDetail",
    "url",
    "principalArn",
    "privateDomainName",
    "nextDeployment",
  ],
  inferName: get("properties.serviceName"),
  dependencies: {
    certificate: {
      type: "Certificate",
      group: "Lightsail",
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("publicDomainNames"),
          map(
            pipe([
              (publicDomainName) =>
                lives.getByName({
                  name: publicDomainName,
                  type: "Certificate",
                  group: "Lightsail",
                  providerName: config.providerName,
                }),
              get("id"),
              tap((id) => {
                assert(id);
              }),
            ])
          ),
        ]),
    },
  },
  Client: ({ spec, config }) =>
    createAwsResource({
      model: model({ config }),
      spec,
      config,
      findName: () =>
        pipe([
          get("serviceName"),
          tap((name) => {
            assert(name);
          }),
        ]),
      findId: () =>
        pipe([
          get("serviceName"),
          tap((id) => {
            assert(id);
          }),
        ]),
      getByName: ({ getById }) =>
        pipe([({ name }) => ({ serviceName: name }), getById({})]),
      ...Tagger({ buildArn: buildArn(config) }),
      configDefault: ({
        name,
        namespace,
        properties: { tags, ...otherProps },
        dependencies: {},
      }) =>
        pipe([
          () => otherProps,
          defaultsDeep({
            tags: buildTags({
              name,
              config,
              namespace,
              UserTags: tags,
              key: "key",
              value: "value",
            }),
          }),
        ])(),
    }),
});
