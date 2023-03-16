const assert = require("assert");
const { pipe, tap, get, pick, fork, eq, switchCase } = require("rubico");
const { defaultsDeep, callProp, unless, isEmpty, find } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { resourceId } = require("./ServiceCatalogCommon");

const pickId = pipe([
  tap(({ ResourceId, TagOptionId }) => {
    assert(ResourceId);
    assert(TagOptionId);
  }),
  pick(["ResourceId", "TagOptionId"]),
]);

const toResourceId = ({ Id, ...other }) => ({ ResourceId: Id, ...other });

const decorate = ({ endpoint, config }) =>
  pipe([
    tap(({ Id, TagOptionId }) => {
      assert(Id);
      assert(TagOptionId);
    }),
    toResourceId,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html
exports.ServiceCatalogTagOptionResourceAssociation = () => ({
  type: "TagOptionResourceAssociation",
  package: "service-catalog",
  client: "ServiceCatalog",
  propertiesDefault: {},
  omitProperties: [
    "ResourceId",
    "TagOptionId",
    "CreatedTime",
    "Name",
    "Description",
    "ARN",
  ],
  inferName: ({ dependenciesSpec: { portfolio, product, tagOption } }) =>
    pipe([
      tap((params) => {
        assert(tagOption);
        assert(portfolio || product);
      }),
      () => `${tagOption}::${portfolio || product}`,
    ]),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        fork({
          resourceName: pipe([
            switchCase([
              // Portfolio
              pipe([get("ResourceId"), callProp("startsWith", "port-")]),
              pipe([
                get("ResourceId"),
                tap((id) => {
                  assert(id);
                }),
                lives.getById({
                  type: "Portfolio",
                  group: "ServiceCatalog",
                  providerName: config.providerName,
                }),
                get("name", live.ResourceId),
              ]),
              // Product
              pipe([get("ResourceId"), callProp("startsWith", "prod-")]),
              pipe([
                get("ResourceId"),
                tap((id) => {
                  assert(id);
                }),
                lives.getById({
                  type: "Product",
                  group: "ServiceCatalog",
                  providerName: config.providerName,
                }),
                get("name", live.ResourceId),
              ]),
              // Default
              () => live.ResourceId,
            ]),
          ]),
          tagOption: pipe([
            get("TagOptionId"),
            tap((id) => {
              assert(id);
            }),
            lives.getById({
              type: "TagOption",
              group: "ServiceCatalog",
              providerName: config.providerName,
            }),
            get("name", live.TagOptionId),
          ]),
        }),
        tap(({ tagOption, resourceName }) => {
          assert(tagOption);
          assert(resourceName);
        }),
        ({ tagOption, resourceName }) => `${tagOption}::${resourceName}`,
      ])(),
  findId: () =>
    pipe([
      tap(({ TagOptionId, ResourceId }) => {
        assert(TagOptionId);
        assert(ResourceId);
      }),
      ({ TagOptionId, ResourceId }) => `${TagOptionId}::${ResourceId}`,
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    portfolio: {
      type: "Portfolio",
      group: "ServiceCatalog",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("ResourceId")]),
    },
    product: {
      type: "Product",
      group: "ServiceCatalog",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("ResourceId")]),
    },
    tagOption: {
      type: "TagOption",
      group: "ServiceCatalog",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("TagOptionId")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#getTagOptionResourceAssociation-property
  getById: {
    method: "listResourcesForTagOption",
    pickId,
    decorate: ({ endpoint, config, live }) =>
      pipe([
        tap((params) => {
          assert(live.ResourceId);
        }),
        get("ResourceDetails"),
        find(eq(get("Id"), live.ResourceId)),
        unless(
          isEmpty,
          pipe([
            defaultsDeep({ TagOptionId: live.TagOptionId }),
            decorate({ endpoint, config }),
          ])
        ),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#listTagOptionResourceAssociations-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "TagOption", group: "ServiceCatalog" },
          pickKey: pipe([
            tap(({ Id }) => {
              assert(Id);
            }),
            ({ Id }) => ({ TagOptionId: Id }),
          ]),
          method: "listResourcesForTagOption",
          getParam: "ResourceDetails",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap(({ Id }) => {
                assert(Id);
                assert(parent.Id);
              }),
              defaultsDeep({ TagOptionId: parent.Id }),
              ({ Id, ...other }) => ({ ResourceId: Id, ...other }),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#associateTagOptionWithResource-property
  create: {
    method: "associateTagOptionWithResource",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#disassociateTagOptionFromResource-property
  destroy: {
    method: "disassociateTagOptionFromResource",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { tagOption, portfolio, product },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(tagOption);
      }),
      () => otherProps,
      defaultsDeep({
        TagOptionId: getField(tagOption, "Id"),
        ResourceId: resourceId({ portfolio, product }),
      }),
    ])(),
});
