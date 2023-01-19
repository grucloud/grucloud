const assert = require("assert");
const { pipe, tap, get, eq, pick } = require("rubico");
const {
  defaultsDeep,
  append,
  callProp,
  first,
  identity,
  when,
} = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { getByNameCore } = require("@grucloud/core/Common");
const { ignoreErrorCodes, ignoreErrorMessages } = require("./GuardDutyCommon");

const pickId = pipe([
  tap(({ DetectorId, DestinationId }) => {
    assert(DetectorId);
    assert(DestinationId);
  }),
  pick(["DetectorId", "DestinationId"]),
]);

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    defaultsDeep({ DetectorId: live.DetectorId }),
  ]);

const findDestinationName = pipe([
  get("DestinationProperties.DestinationArn"),
  tap((DestinationArn) => {
    assert(DestinationArn);
  }),
  callProp("replace", "arn:aws:s3:::", ""),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html
exports.GuardDutyPublishingDestination = () => ({
  type: "PublishingDestination",
  package: "guardduty",
  client: "GuardDuty",
  propertiesDefault: { DestinationType: "S3" },
  omitProperties: [
    "DetectorId",
    "DestinationId",
    "Status",
    "DestinationProperties.KmsKeyArn",
  ],
  inferName:
    ({ dependenciesSpec: { detector } }) =>
    (live) =>
      pipe([
        tap((params) => {
          assert(detector);
        }),
        () => `${detector}::${findDestinationName(live)}`,
      ])(),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => live,
        get("DetectorId"),
        tap((id) => {
          assert(id);
        }),
        lives.getById({
          type: "Detector",
          group: "GuardDuty",
          providerName: config.providerName,
        }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
        append("::"),
        append(findDestinationName(live)),
      ])(),
  findId:
    () =>
    ({ DetectorId, Name }) =>
      pipe([() => `${DetectorId}::${Name}`])(),
  dependencies: {
    detector: {
      type: "Detector",
      group: "GuardDuty",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("DetectorId"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      dependencyId: ({ lives, config }) =>
        get("DestinationProperties.KmsKeyArn"),
    },
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([findDestinationName, callProp("split", "/"), first]),
    },
  },
  ignoreErrorCodes: ["BadRequestException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#describePublishingDestination-property
  getById: {
    method: "describePublishingDestination",
    pickId,
    decorate,
    ignoreErrorMessages,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#listPublishingDestinations-property
  getList: {
    method: "listPublishingDestinations",
    getParam: "PublishingDestinations",
    decorate,
  },
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Detector", group: "GuardDuty" },
          pickKey: pipe([pick(["DetectorId"])]),
          method: "listPublishingDestinations",
          getParam: "Destinations",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap(({ DestinationId }) => {
                assert({ DestinationId });
                assert(parent.DetectorId);
              }),
              ({ DestinationId }) => ({
                DestinationId,
                DetectorId: parent.DetectorId,
              }),
              getById({}),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#createPublishingDestination-property
  create: {
    method: "createPublishingDestination",
    pickCreated: ({ payload }) => pipe([identity, defaultsDeep(payload)]),
    shouldRetryOnExceptionMessages: [
      "The request failed because the resource folder specified in the destinationArn parameter does not exist",
    ],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#deletePublishingDestination-property
  destroy: {
    method: "deletePublishingDestination",
    pickId,
    ignoreErrorMessages,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { detector, kmsKey },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(detector);
      }),
      () => otherProps,
      defaultsDeep({
        DetectorId: getField(detector, "DetectorId"),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          DestinationProperties: {
            KmsKeyArn: getField(kmsKey, "Arn"),
          },
        })
      ),
    ])(),
});
