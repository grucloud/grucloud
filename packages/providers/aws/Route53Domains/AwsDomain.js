const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { AwsClient } = require("../AwsClient");
const { createRoute53Domains } = require("./Route53DomainCommon");

const findName = () => get("DomainName");
const findId = findName;
const pickId = pick(["DomainName"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsDomain = ({ spec, config }) => {
  const route53Domains = createRoute53Domains(config);
  const client = AwsClient({ spec, config })(route53Domains);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#getDomain-property
  const getById = client.getById({
    pickId,
    method: "getDomainDetail",
    ignoreErrorCodes: ["NoSuchDomain"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#listDomains-property
  const getList = client.getList({
    method: "listDomains",
    getParam: "Domains",
    decorate: () => pipe([getById({})]),
  });

  const getByName = pipe([({ name }) => ({ DomainName: name }), getById({})]);

  const configDefault = async ({ name, properties }) =>
    defaultsDeep({
      DomainName: name,
    })(properties);

  return {
    spec,
    configDefault,
    findId,
    getByName,
    getById,
    cannotBeDeleted: () => () => true,
    managedByOther: () => () => true,
    findName,
    getList,
  };
};
