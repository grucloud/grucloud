const assert = require("assert");
const { pipe, tap, get, pick, eq, map, assign, or } = require("rubico");
const { defaultsDeep, append, when, first } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

const pickId = pick(["EndpointGroupArn"]);

const decorate = () =>
  pipe([
    ({ EndpointDescriptions, ...other }) => ({
      EndpointConfigurations: EndpointDescriptions,
      ...other,
    }),
  ]);

const model = ({ config }) => ({
  package: "global-accelerator",
  client: "GlobalAccelerator",
  region: "us-west-2",
  ignoreErrorCodes: ["EndpointGroupNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#describeEndpointGroup-property
  getById: {
    method: "describeEndpointGroup",
    getField: "EndpointGroup",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#createEndpointGroup-property
  create: {
    method: "createEndpointGroup",
    pickCreated: ({ payload }) => pipe([get("EndpointGroup")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#updateEndpointGroup-property
  update: {
    method: "updateEndpointGroup",
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        defaultsDeep({ EndpointGroupArn: live.EndpointGroupArn }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#deleteEndpointGroup-property
  destroy: {
    method: "deleteEndpointGroup",
    pickId,
  },
});

exports.GlobalAcceleratorEndpointGroup = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName:
      ({ lives, config }) =>
      (live) =>
        pipe([
          () => live,
          get("ListenerArn"),
          lives.getById({
            type: "Listener",
            group: "GlobalAccelerator",
            providerName: config.providerName,
          }),
          get("name"),
          tap((name) => {
            assert(name);
          }),
          append(`::${live.EndpointGroupRegion}`),
        ])(),
    findId: () => pipe([get("EndpointGroupArn")]),
    getByName: getByNameCore,
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GlobalAccelerator.html#listEndpointGroups-property
    getList: ({ client, endpoint, getById, config }) =>
      pipe([
        () =>
          client.getListWithParent({
            parent: { type: "Listener", group: "GlobalAccelerator" },
            pickKey: pipe([pick(["ListenerArn"])]),
            method: "listEndpointGroups",
            getParam: "EndpointGroups",
            config,
            decorate: ({ parent }) =>
              pipe([
                tap((params) => {
                  assert(parent);
                }),
                defaultsDeep({
                  ListenerArn: parent.ListenerArn,
                  AcceleratorName: parent.AcceleratorName,
                }),
                decorate(),
              ]),
          }),
      ])(),
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { listener },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          ListenerArn: getField(listener, "ListenerArn"),
        }),
      ])(),
  });
