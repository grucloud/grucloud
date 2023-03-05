const assert = require("assert");
const { pipe, tap, get, pick, map } = require("rubico");
const { defaultsDeep, first } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ DirectoryId }) => {
    assert(DirectoryId);
  }),
  pick(["DirectoryId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html
exports.DirectoryServiceRegion = () => ({
  type: "Region",
  package: "directory-service",
  client: "DirectoryService",
  propertiesDefault: {},
  omitProperties: ["DirectoryId", "Status"],
  inferName:
    ({ dependenciesSpec: { directory } }) =>
    ({ RegionName }) =>
      pipe([
        tap((params) => {
          assert(directory);
        }),
        () => `${directory}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ RegionName, DirectoryId }) =>
      pipe([
        tap((name) => {
          assert(RegionName);
          assert(DirectoryId);
        }),
        () => DirectoryId,
        lives.getById({
          type: "Directory",
          group: "DirectoryService",
          providerName: config.providerName,
        }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
        //append(`::${RegionName}`),
      ])(),
  findId: () =>
    pipe([
      get("DirectoryId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    directory: {
      type: "Directory",
      group: "DirectoryService",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("DirectoryId"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("VpcSettings.SubnetIds"),
    },
  },
  ignoreErrorCodes: [
    "EntityDoesNotExistException",
    "DirectoryDoesNotExistException",
    "ResourceNotFoundException",
  ],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html#describeRegions-property
  getById: {
    method: "describeRegions",
    getField: "RegionsDescription",
    pickId: pick(["DirectoryId", "RegionName"]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html#describeRegions-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Directory", group: "DirectoryService" },
          pickKey: pipe([
            pick(["DirectoryId"]),
            tap(({ DirectoryId }) => {
              assert(DirectoryId);
            }),
          ]),
          method: "describeRegions",
          getParam: "RegionsDescription",
          config,
          decorate,
        }),
    ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html#addRegion-property
  create: {
    method: "addRegion",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html#removeRegion-property
  destroy: {
    method: "removeRegion",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { directory, subnets },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(directory);
        assert(subnets);
      }),
      () => otherProps,
      defaultsDeep({
        DirectoryId: getField(directory, "DirectoryId"),
        VpcSettings: {
          SubnetIds: pipe([
            () => subnets,
            map((subnet) => getField(subnet, "SubnetId")),
          ])(),
          VpcId: pipe([
            () => subnets,
            first,
            (subnet) => getField(subnet, "VpcId"),
          ])(),
        },
      }),
    ])(),
});
