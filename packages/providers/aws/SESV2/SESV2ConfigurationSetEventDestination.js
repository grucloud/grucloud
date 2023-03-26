const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, when, find, unless, isEmpty } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ ConfigurationSetName, EventDestinationName }) => {
    assert(ConfigurationSetName);
    assert(EventDestinationName);
  }),
  pick(["ConfigurationSetName", "EventDestinationName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap(({ Name, ConfigurationSetName }) => {
      assert(ConfigurationSetName);
      assert(Name);
    }),
    ({ Name, ConfigurationSetName, ...other }) => ({
      EventDestinationName: Name,
      ConfigurationSetName,
      EventDestination: other,
    }),
  ]);

const findName =
  () =>
  ({ ConfigurationSetName, EventDestinationName }) =>
    pipe([() => `${ConfigurationSetName}::${EventDestinationName}`])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html
exports.SESV2ConfigurationSetEventDestination = () => ({
  type: "ConfigurationSetEventDestination",
  package: "sesv2",
  client: "SESv2",
  propertiesDefault: {},
  omitProperties: [
    "EventDestination.KinesisFirehoseDestination.DeliveryStreamArn",
    "EventDestination.KinesisFirehoseDestination.IamRoleArn",
    "EventDestination.PinpointDestination.ApplicationArn",
    "EventDestination.SnsDestination.TopicArn",
  ],
  inferName:
    ({ dependenciesSpec: { configurationSet } }) =>
    ({ EventDestinationName }) =>
      pipe([
        tap((params) => {
          assert(configurationSet);
          assert(EventDestinationName);
        }),
        () => `${configurationSet}::${EventDestinationName}`,
      ])(),

  findName,
  findId: findName,
  ignoreErrorCodes: ["NotFoundException"],
  dependencies: {
    configurationSet: {
      type: "ConfigurationSet",
      group: "SESV2",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("ConfigurationSetName"),
          lives.getByName({
            type: "ConfigurationSet",
            group: "SESV2",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
    firehoseDeliveryStream: {
      type: "DeliveryStream",
      group: "Firehose",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("EventDestination.KinesisFirehoseDestination.DeliveryStreamArn"),
        ]),
    },
    firehoseDeliveryStreamIamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([get("EventDestination.KinesisFirehoseDestination.IamRoleArn")]),
    },
    pinpointApp: {
      type: "App",
      group: "Pinpoint",
      dependencyId: ({ lives, config }) =>
        pipe([get("EventDestination.PinpointDestination.ApplicationArn")]),
    },
    snsTopic: {
      type: "Topic",
      group: "SNS",
      dependencyId: ({ lives, config }) =>
        pipe([get("EventDestination.SnsDestination.TopicArn")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html#getConfigurationSetEventDestinations-property
  getById: {
    method: "getConfigurationSetEventDestinations",
    pickId: pipe([
      pick(["ConfigurationSetName"]),
      tap(({ ConfigurationSetName }) => {
        assert(ConfigurationSetName);
      }),
    ]),
    decorate: ({ live, endpoint, config }) =>
      pipe([
        tap(() => {
          assert(live.EventDestinationName);
        }),
        get("EventDestinations"),
        find(eq(get("Name"), live.EventDestinationName)),
        unless(isEmpty, decorate({ endpoint, config })),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html#getConfigurationSetEventDestinations-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "ConfigurationSet", group: "SESV2" },
          pickKey: pipe([pick(["ConfigurationSetName"])]),
          method: "getConfigurationSetEventDestinations",
          getParam: "EventDestinations",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap((params) => {
                assert(true);
              }),
              defaultsDeep({
                ConfigurationSetName: parent.ConfigurationSetName,
              }),
              decorate({ config }),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html#createConfigurationSetEventDestination-property
  create: {
    method: "createConfigurationSetEventDestination",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html#updateConfigurationSetEventDestination-property
  update: {
    method: "updateConfigurationSetEventDestination",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html#deleteConfigurationSetEventDestination-property
  destroy: {
    method: "deleteConfigurationSetEventDestination",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {
      configurationSet,
      firehoseDeliveryStream,
      firehoseDeliveryStreamIamRole,
      pinpointDestination,
      snsTopic,
    },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(configurationSet);
      }),
      () => otherProps,
      defaultsDeep({
        ConfigurationSetName: configurationSet.config.ConfigurationSetName,
      }),
      when(
        () => firehoseDeliveryStream,
        defaultsDeep({
          EventDestination: {
            KinesisFirehoseDestination: {
              DeliveryStreamArn: getField(
                firehoseDeliveryStream,
                "DeliveryStreamARN"
              ),
              IamRoleArn: getField(firehoseDeliveryStreamIamRole, "Arn"),
            },
          },
        })
      ),
      when(
        () => pinpointDestination,
        defaultsDeep({
          EventDestination: {
            PinpointDestination: {
              ApplicationArn: getField(pinpointDestination, "Arn"), //TODO
            },
          },
        })
      ),
      when(
        () => snsTopic,
        defaultsDeep({
          EventDestination: {
            SnsDestination: {
              TopicArn: getField(snsTopic, "Attributes.TopicArn"),
            },
          },
        })
      ),
    ])(),
});
