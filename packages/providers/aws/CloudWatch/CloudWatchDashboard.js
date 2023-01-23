const assert = require("assert");
const { pipe, tap, get, omit, assign, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const decorate = ({ endpoint }) =>
  pipe([assign({ DashboardBody: pipe([get("DashboardBody"), JSON.parse]) })]);

const stringifyDashboardBody = assign({
  DashboardBody: pipe([get("DashboardBody"), JSON.stringify]),
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html
exports.CloudWatchDashboard = ({}) => ({
  type: "Dashboard",
  package: "cloudwatch",
  client: "CloudWatch",
  inferName: () => get("DashboardName"),
  findName: () => pipe([get("DashboardName")]),
  findId: () => pipe([get("DashboardArn")]),
  ignoreErrorCodes: ["ResourceNotFound", "DashboardNotFoundError"],
  omitProperties: ["DashboardArn"],
  propertiesDefault: {},
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html#getDashboard-property
  getById: {
    method: "getDashboard",
    pickId: pipe([pick(["DashboardName"])]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html#listDashboards-property
  getList: {
    method: "listDashboards",
    getParam: "DashboardEntries",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html#putDashboard-property
  create: {
    method: "putDashboard",
    pickCreated: ({ payload }) => pipe([() => payload]),
    filterPayload: pipe([
      tap((params) => {
        assert(true);
      }),
      stringifyDashboardBody,
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html#putDashboard-property
  update: {
    method: "putDashboard",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, stringifyDashboardBody])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html#deleteDashboards-property
  destroy: {
    method: "deleteDashboards",
    pickId: pipe([
      ({ DashboardName }) => ({ DashboardNames: [DashboardName] }),
    ]),
  },
  getByName: ({ getList, endpoint, getById }) =>
    pipe([({ name }) => ({ DashboardName: name }), getById({})]),
  configDefault: ({ name, namespace, properties: { ...otherProps }, config }) =>
    pipe([() => otherProps, defaultsDeep({})])(),
});
