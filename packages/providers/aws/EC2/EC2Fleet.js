const assert = require("assert");
const { pipe, tap, get, assign } = require("rubico");
const { defaultsDeep, isIn, pluck, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");
const { findNameInTagsOrId, buildTags } = require("../AwsCommon");

const { tagResource, untagResource } = require("./EC2Common");

const pickId = pipe([
  tap(({ FleetId }) => {
    assert(FleetId);
  }),
  ({ FleetId }) => ({ FleetIds: [FleetId], TerminateInstances: true }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2Fleet = () => ({
  type: "Fleet",
  package: "ec2",
  client: "EC2",
  propertiesDefault: {},
  omitProperties: ["FleetId", "FleetState"],
  findName: findNameInTagsOrId,
  findId: () =>
    pipe([
      get("FleetId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException", "InvalidFleetId.Malformed"],
  dependencies: {
    launchTemplates: {
      type: "LaunchTemplate",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("LaunchTemplateConfigs"),
          pluck("LaunchTemplateSpecification.LaunchTemplateId"),
        ]),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        LaunchTemplateConfigs: pipe([
          get("LaunchTemplateConfigs"),
          map(
            assign({
              LaunchTemplateSpecification: pipe([
                get("LaunchTemplateSpecification"),
                assign({
                  LaunchTemplateId: pipe([
                    get("LaunchTemplateId"),
                    replaceWithName({
                      groupType: "EC2::LaunchTemplate",
                      path: "id",
                      providerConfig,
                      lives,
                    }),
                  ]),
                }),
              ]),
            })
          ),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeFleets-property
  getById: {
    method: "describeFleets",
    getField: "Fleets",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeFleets-property
  // See https://stackoverflow.com/questions/59931037/boto3-describe-fleets-api-does-not-fetch-all-fleet-information
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeFleets-property
  getList: {
    method: "describeFleets",
    getParam: "Fleets",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createFleet-property
  create: {
    method: "createFleet",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: pipe([get("FleetState"), isIn(["active"])]),
    isInstanceError: pipe([get("FleetState"), isIn(["failed"])]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#modifyFleet-property
  update: {
    method: "modifyFleet",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteFleets-property
  destroy: {
    method: "deleteFleets",
    pickId,
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource: tagResource, untagResource: untagResource }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        TagSpecifications: [
          {
            ResourceType: "fleet",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
    ])(),
});
