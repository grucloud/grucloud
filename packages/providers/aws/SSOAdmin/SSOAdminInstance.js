const assert = require("assert");
const { pipe, tap, get, eq } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { createAwsResource } = require("../AwsClient");

const defaultName = "default";

const decorate = ({ endpoint, index }) =>
  pipe([
    when(
      eq(() => index, 0),
      defaultsDeep({ Name: defaultName, IsDefault: true })
    ),
    defaultsDeep({ Index: index }),
  ]);

const cannotBeDeleted = () => true;

const model = ({ config }) => ({
  package: "sso-admin",
  client: "SSOAdmin",
  ignoreErrorCodes: [],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSOAdmin.html#listInstances-property
  getList: {
    method: "listInstances",
    getParam: "Instances",
    decorate,
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSOAdmin.html
exports.SSOAdminInstance = ({ compare }) => ({
  type: "Instance",
  propertiesDefault: {},
  omitProperties: ["IdentityStoreId", "InstanceArn", "Index", "IsDefault"],
  //listOnly: true,
  inferName: pipe([() => defaultName]),
  Client: ({ spec, config }) =>
    createAwsResource({
      model: model({ config }),
      spec,
      config,
      cannotBeDeleted,
      managedByOther: cannotBeDeleted,
      findName: ({ live, lives }) => pipe([() => defaultName])(),
      findId: pipe([get("live"), get("InstanceArn")]),
    }),
});
