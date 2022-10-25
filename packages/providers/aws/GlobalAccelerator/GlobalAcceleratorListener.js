const assert = require("assert");
const { pipe, tap, get, pick, eq, map, assign, or } = require("rubico");
const { defaultsDeep, when, first } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

const pickId = pick(["ListenerArn"]);

const model = ({ config }) => ({
  package: "global-accelerator",
  client: "GlobalAccelerator",
  region: "us-west-2",
  ignoreErrorCodes: ["ListenerNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#describeListener-property
  getById: {
    method: "describeListener",
    getField: "Listener",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#createListener-property
  create: {
    method: "createListener",
    pickCreated: ({ payload }) => pipe([get("Listener")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#deleteListener-property
  destroy: {
    method: "deleteListener",
    pickId,
  },
});

exports.GlobalAcceleratorListener = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([
      //TODO
      get("live"),
      ({ AcceleratorName, Protocol, PortRanges }) =>
        `${AcceleratorName}::${Protocol}::${PortRanges[0].FromPort}::${PortRanges[0].ToPort}`,
    ]),
    findId: pipe([get("live.ListenerArn")]),
    getByName: getByNameCore,
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#listListeners-property
    getList: ({ client, endpoint, getById, config }) =>
      pipe([
        () =>
          client.getListWithParent({
            parent: { type: "Accelerator", group: "GlobalAccelerator" },
            pickKey: pipe([pick(["AcceleratorArn"])]),
            method: "listListeners",
            getParam: "Listeners",
            config,
            decorate: ({ parent }) =>
              pipe([
                tap((params) => {
                  assert(parent.Name);
                }),
                defaultsDeep({
                  AcceleratorArn: parent.AcceleratorArn,
                  AcceleratorName: parent.Name,
                }),
              ]),
          }),
      ])(),
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#updateAccelerator-property
    //TODO
    update:
      ({ endpoint }) =>
      async ({ pickId, payload, diff, live }) =>
        pipe([
          tap((params) => {
            assert(endpoint);
          }),
          () => diff,
        ])(),
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { accelerator },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          AcceleratorArn: getField(accelerator, "AcceleratorArn"),
        }),
        tap((params) => {
          assert(true);
        }),
      ])(),
  });
