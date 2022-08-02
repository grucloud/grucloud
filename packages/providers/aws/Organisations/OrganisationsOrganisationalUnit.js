const assert = require("assert");
const { pipe, tap, get, flatMap, map, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./OrganisationsCommon");

const pickId = pipe([
  tap(({ Id }) => {
    assert(Id);
  }),
  ({ Id }) => ({ OrganizationalUnitId: Id }),
]);

const model = ({ config }) => ({
  package: "organizations",
  client: "Organizations",
  ignoreErrorCodes: ["TODO"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#describeOrganizationalUnit-property
  getById: {
    method: "describeOrganizationalUnit",
    getField: "OrganizationalUnit",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#createOrganizationalUnit-property
  create: {
    method: "createOrganizationalUnit",
    pickCreated: ({ payload }) => pipe([get("OrganizationalUnit")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#deleteOrganizationalUnit-property
  destroy: {
    method: "deleteOrganizationalUnit",
    pickId,
  },
});

const listOrganizationalUnitsForParent =
  ({ endpoint }) =>
  ({ ParentId }) =>
    pipe([
      tap((params) => {
        assert(ParentId);
      }),
      () => ({ ParentId }),
      endpoint().listOrganizationalUnitsForParent,
      get("OrganizationalUnits", []),
      map(assign({ ParentId: () => ParentId })),
      flatMap((organizationalUnit) =>
        pipe([
          tap((params) => {
            assert(organizationalUnit.Id);
          }),
          () => ({ ParentId: organizationalUnit.Id }),
          listOrganizationalUnitsForParent({ endpoint }),
          (units) => [organizationalUnit, ...units],
        ])()
      ),
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html
exports.OrganisationsOrganisationalUnit = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.Name")]),
    findId: pipe([get("live.Arn")]),
    managedByOther: () => true,
    cannotBeDeleted: () => true,
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#listOrganizationalUnitsForParent-property
    getList:
      ({ endpoint }) =>
      ({ lives }) =>
        pipe([
          () =>
            lives.getByType({
              providerName: config.providerName,
              type: "Root",
              group: "Organisations",
            }),
          flatMap(
            pipe([
              get("live.Id"),
              (Id) => ({ ParentId: Id }),
              listOrganizationalUnitsForParent({ endpoint }),
            ])
          ),
        ])(),
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      //TODO
      dependencies: { root, organisationalUnitParent },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Name: name,
          Tags: buildTags({
            name,
            config,
            namespace,
            userTags: Tags,
          }),
        }),
      ])(),
  });
