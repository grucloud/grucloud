const assert = require("assert");
const { pipe, tap, get, assign, eq, filter, not, map } = require("rubico");
const {
  defaultsDeep,
  first,
  isEmpty,
  when,
  prepend,
  find,
  keys,
} = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");

const findAssociatedEntity =
  ({ type, group }) =>
  ({ lives, config }) =>
  (live) =>
    pipe([
      tap((params) => {
        assert(live);
        assert(live.associatedEntity);
      }),
      lives.getByType({
        type,
        group,
      }),
      find(eq(get("live.Arn"), live.associatedEntity)),
      get("id"),
    ])();

const PrincipalAssociationDependencies = {
  organisation: {
    type: "Organisation",
    group: "Organisations",
    arnKey: "Arn",
    dependencyId: findAssociatedEntity({
      type: "Organisation",
      group: "Organisations",
    }),
  },
  organisationalUnit: {
    type: "OrganisationalUnit",
    group: "Organisations",
    arnKey: "Arn",
    dependencyId: findAssociatedEntity({
      type: "OrganisationalUnit",
      group: "Organisations",
    }),
  },
  user: {
    type: "User",
    group: "IAM",
    arnKey: "Arn",
    dependencyId: findAssociatedEntity({
      type: "User",
      group: "IAM",
    }),
  },
  group: {
    type: "Group",
    group: "IAM",
    arnKey: "Arn",
    dependencyId: findAssociatedEntity({
      type: "Group",
      group: "IAM",
    }),
  },
};

exports.PrincipalAssociationDependencies = PrincipalAssociationDependencies;

const model = ({ config }) => ({
  package: "ram",
  client: "RAM",
  ignoreErrorCodes: ["UnknownResourceException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#getResourceShareAssociations-property
  getById: {
    method: "getResourceShareAssociations",
    getField: "resourceShareAssociations",
    pickId: pipe([
      ({ resourceShareArn, associatedEntity }) => ({
        resourceShareArns: [resourceShareArn],
        associationType: "PRINCIPAL",
        principal: associatedEntity,
      }),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#getResourceShareAssociations-property
  getList: {
    extraParam: { associationType: "PRINCIPAL" },
    method: "getResourceShareAssociations",
    getParam: "resourceShareAssociations",
    transformListPre: () =>
      pipe([filter(not(eq(get("status"), "DISASSOCIATED")))]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#associateResourceShare-property
  create: {
    method: "associateResourceShare",
    filterPayload: ({ associatedEntity, ...otheProps }) =>
      pipe([() => ({ principals: [associatedEntity], ...otheProps })])(),
    pickCreated: ({ payload }) =>
      pipe([get("resourceShareAssociations"), first]),
    isInstanceUp: pipe([eq(get("status"), "ASSOCIATED")]),
    isInstanceError: pipe([eq(get("status"), "FAILED")]),
    getErrorMessage: get("statusMessage", "error"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#updateResourceShare-property
  // update: {
  //   method: "updateResourceShare",
  //   //TODO
  // },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#disassociateResourceShare-property
  destroy: {
    method: "disassociateResourceShare",
    pickId: pipe([
      ({ associatedEntity, resourceShareArn }) => ({
        principals: [associatedEntity],
        resourceShareArn,
      }),
    ]),
    isInstanceDown: pipe([eq(get("status"), "DISASSOCIATED")]),
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html
exports.RAMPrincipalAssociation = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName:
      ({ lives }) =>
      (live) =>
        pipe([
          tap(() => {
            assert(live.associatedEntity);
          }),
          lives.getByType({
            type: "Organisation",
            group: "Organisations",
          }),
          find(eq(get("live.Arn"), live.associatedEntity)),
          get("name"),
          //TODO
          when(
            isEmpty,
            pipe([
              () => live.associatedEntity,
              lives.getById({
                type: "User",
                group: "IAM",
              }),
              get("name"),
            ])
          ),
          when(isEmpty, () => live.associatedEntity),
          prepend(`ram-principal-assoc::${live.resourceShareName}::`),
        ])(),
    findId: () =>
      pipe([
        ({ resourceShareArn, associatedEntity }) =>
          `${resourceShareArn}::${associatedEntity}`,
      ]),
    getByName: ({ getList, endpoint }) =>
      pipe([
        ({ name }) => ({ params: { name, resourceShareStatus: "ACTIVE" } }),
        getList,
        tap((params) => {
          assert(true);
        }),
        first,
      ]),
    configDefault: ({
      name,
      namespace,
      properties: { ...otheProps },
      dependencies: { resourceShare, ...principalDependencies },
    }) =>
      pipe([
        tap((params) => {
          assert(resourceShare);
        }),
        () => otheProps,
        defaultsDeep({
          resourceShareArn: getField(resourceShare, "resourceShareArn"),
        }),
        when(
          () => !isEmpty(principalDependencies),
          assign({
            associatedEntity: pipe([
              () => principalDependencies,
              keys,
              first,
              (depKey) =>
                getField(
                  principalDependencies[depKey],
                  PrincipalAssociationDependencies[depKey].arnKey || "Arn"
                ),
            ]),
          })
        ),
      ])(),
  });
