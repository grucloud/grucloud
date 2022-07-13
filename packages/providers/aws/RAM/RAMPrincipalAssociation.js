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

const PrincipalAssociationDependencies = {
  organisation: { type: "Organisation", group: "Organisations", arnKey: "Arn" },
  organisationalUnit: {
    type: "OrganisationalUnit",
    group: "Organisations",
    arnKey: "Arn",
  },
  user: { type: "User", group: "IAM", arnKey: "Arn" },
  group: { type: "Group", group: "IAM", arnKey: "Arn" },
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
      tap(({ resourceShareArn, associatedEntity }) => {
        assert(resourceShareArn);
        assert(associatedEntity);
      }),
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
    decorate: ({ endpoint }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
      ]),
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
    findName: ({ live, lives }) =>
      pipe([
        tap(() => {
          assert(live.associatedEntity);
        }),
        () =>
          lives.getByType({
            type: "Organisation",
            group: "Organisations",
          }),
        tap((params) => {
          assert(true);
        }),
        find(eq(get("live.Arn"), live.associatedEntity)),
        get("name"),
        tap((params) => {
          assert(true);
        }),
        when(
          isEmpty,
          pipe([
            () =>
              lives.getById({
                id: live.associatedEntity,
                type: "User",
                group: "IAM",
              }),
            get("name"),
          ])
        ),
        when(isEmpty, () => live.associatedEntity),
        prepend(`ram-principal-assoc::${live.resourceShareName}::`),
        tap((params) => {
          assert(true);
        }),
      ])(),
    findId: pipe([
      get("live"),
      ({ resourceShareArn, associatedEntity }) =>
        `${resourceShareArn}::${associatedEntity}`,
    ]),
    findDependencies: ({ live, lives }) => [
      {
        type: "ResourceShare",
        group: "RAM",
        ids: [live.resourceShareArn],
      },
      {
        type: "Organisation",
        group: "Organisations",
        ids: [
          pipe([
            tap((params) => {
              assert(live.associatedEntity);
            }),
            () =>
              lives.getByType({
                type: "Organisation",
                group: "Organisations",
              }),
            tap((params) => {
              assert(true);
            }),
            find(eq(get("live.Arn"), live.associatedEntity)),
            get("id"),
            tap((params) => {
              assert(true);
            }),
          ])(),
        ],
      },
    ],
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
