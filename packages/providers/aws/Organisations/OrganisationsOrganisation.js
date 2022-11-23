const assert = require("assert");
const { pipe, tap, get, assign } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");

const decorate = ({ endpoint }) =>
  pipe([
    assign({
      serviceAccessPrincipals: pipe([
        endpoint().listAWSServiceAccessForOrganization,
        get("EnabledServicePrincipals"),
        pluck("ServicePrincipal"),
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html
exports.OrganisationsOrganisation = ({}) => ({
  type: "Organisation",
  package: "organizations",
  client: "Organizations",
  ignoreErrorCodes: [],
  inferName: () => get("MasterAccountEmail"),
  findName: () => pipe([get("MasterAccountEmail")]),
  findId: () => pipe([get("Id")]),
  omitProperties: ["Arn", "Id", "MasterAccountArn", "MasterAccountId"],
  managedByOther: () => () => true,
  cannotBeDeleted: () => () => true,
  getById: {
    method: "describeOrganization",
    getField: "Organization",
    pickId: pipe([() => undefined]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#describeOrganization-property
  getList: {
    method: "describeOrganization",
    getParam: "Organization",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#createOrganization-property
  create: {
    method: "createOrganization",
    pickCreated: ({ payload }) => pipe([get("Organization")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#deleteOrganization-property
  destroy: {
    method: "deleteOrganization",
    pickId: pipe([() => undefined]),
  },
  //TODO
  getByName: ({ getList, endpoint }) =>
    pipe([
      getList,
      tap((params) => {
        assert(true);
      }),
      //first,
    ]),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
