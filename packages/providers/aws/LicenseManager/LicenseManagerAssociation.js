const assert = require("assert");
const { pipe, tap, get, pick, eq, switchCase } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { ignoreErrorCodes } = require("./LicenseManagerCommon");

const pickId = pipe([
  tap(({ LicenseConfigurationArn }) => {
    assert(LicenseConfigurationArn);
  }),
  pick(["LicenseConfigurationArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const filterPayload = pipe([
  tap(({ ResourceArn, LicenseConfigurationArn }) => {
    assert(ResourceArn);
    assert(LicenseConfigurationArn);
  }),
  ({ ResourceArn, LicenseConfigurationArn, AmiAssociationScope }) => ({
    ResourceArn,
    AddLicenseSpecifications: [
      {
        LicenseConfigurationArn,
        AmiAssociationScope,
      },
    ],
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html
exports.LicenseManagerAssociation = () => ({
  type: "Association",
  package: "license-manager",
  client: "LicenseManager",
  propertiesDefault: {},
  omitProperties: ["LicenseConfigurationArn", "AssociationTime", "ResourceArn"],
  inferName: ({ dependenciesSpec: { licenseConfiguration, ec2Instance } }) =>
    pipe([
      tap((params) => {
        assert(licenseConfiguration);
        assert(ec2Instance /*|| product*/);
      }),
      () => `${licenseConfiguration}::${ec2Instance /*|| product*/}`,
    ]),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        fork({
          resourceName: pipe([
            switchCase([
              // EC2 Instance
              pipe([get("ResourceArn"), callProp("startsWith", "arn:aws:ec")]),
              pipe([
                get("ResourceArn"),
                tap((id) => {
                  assert(id);
                }),
                lives.getById({
                  type: "Instance",
                  group: "EC2",
                  providerName: config.providerName,
                }),
                get("name", live.ResourceArn),
              ]),
              // Default
              () => live.ResourceArn,
            ]),
          ]),
          licenseConfiguration: pipe([
            get("LicenseConfigurationArn"),
            tap((id) => {
              assert(id);
            }),
            lives.getById({
              type: "LicenseConfiguration",
              group: "LicenseManager",
              providerName: config.providerName,
            }),
            get("name", live.LicenseConfigurationArn),
          ]),
        }),
        tap(({ licenseConfiguration, resourceName }) => {
          assert(licenseConfiguration);
          assert(resourceName);
        }),
        ({ licenseConfiguration, resourceName }) =>
          `${licenseConfiguration}::${resourceName}`,
      ])(),
  findId: () =>
    pipe([
      ({ LicenseConfigurationArn, ResourceArn }) =>
        `${LicenseConfigurationArn}::${ResourceArn}`,
    ]),
  ignoreErrorCodes,
  dependencies: {
    ec2Instance: {
      type: "Instance",
      group: "EC2",
      parent: true,
      dependencyId:
        ({ lives, config }) =>
        ({ ResourceArn }) =>
          pipe([
            tap(() => {
              assert(ResourceArn);
            }),
            lives.getByType({
              type: "Instance",
              group: "EC2",
              providerName: config.providerName,
            }),
            find(eq(get("Arn"), ResourceArn)),
          ])(),
    },
    licenseConfiguration: {
      type: "LicenseConfiguration",
      group: "LicenseManager",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("LicenseConfigurationArn"),
          tap((LicenseConfigurationArn) => {
            assert(LicenseConfigurationArn);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html#getAssociation-property
  getById: {
    method: "listAssociationsForLicenseConfiguration",
    pickId,
    decorate: ({ live }) =>
      pipe([
        tap(() => {
          assert(live.ResourceArn);
        }),
        get("LicenseConfigurationAssociations"),
        find(eq(get("ResourceArn"), live.ResourceArn)),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html#listAssociationsForLicenseConfiguration-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "LicenseConfiguration", group: "LicenseManager" },
          pickKey: pipe([
            pick(["LicenseConfigurationArn"]),
            tap((LicenseConfigurationArn) => {
              assert(LicenseConfigurationArn);
            }),
          ]),
          method: "listAssociationsForLicenseConfiguration",
          getParam: "LicenseConfigurationAssociations",
          config,
          decorate: ({ parent }) =>
            pipe([
              defaultsDeep({
                LicenseConfigurationArn: parent.LicenseConfigurationArn,
              }),
              decorate({ endpoint, config }),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html#updateLicenseSpecificationsForResource-property
  create: {
    filterPayload,
    method: "updateLicenseSpecificationsForResource",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html#updateLicenseSpecificationsForResource-property
  update: {
    method: "updateLicenseSpecificationsForResource",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LicenseManager.html#updateLicenseSpecificationsForResource-property
  destroy: {
    method: "updateLicenseSpecificationsForResource",
    pickId: pipe([
      tap(({ ResourceArn, LicenseConfigurationArn }) => {
        assert(ResourceArn);
        assert(LicenseConfigurationArn);
      }),
      ({ ResourceArn, LicenseConfigurationArn, AmiAssociationScope }) => ({
        ResourceArn,
        RemoveLicenseSpecifications: [
          {
            LicenseConfigurationArn,
            AmiAssociationScope,
          },
        ],
      }),
    ]),
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { licenseConfiguration, ec2Instance },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(licenseConfiguration);
      }),
      () => otherProps,
      defaultsDeep({
        LicenseConfigurationArn: getField(
          licenseConfiguration,
          "LicenseConfigurationArn"
        ),
      }),
      switchCase([
        () => ec2Instance,
        defaultsDeep({
          ResourceArn: getField(ec2Instance, "Arn"),
        }),
        () => {
          assert(false, "missing license manager resource");
        },
      ]),
    ])(),
});
