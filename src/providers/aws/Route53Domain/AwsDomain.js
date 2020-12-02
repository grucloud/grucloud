const assert = require("assert");
const AWS = require("aws-sdk");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  pick,
  filter,
  assign,
  fork,
  or,
  not,
  eq,
  omit,
  flatten,
} = require("rubico");
const {
  find,
  pluck,
  defaultsDeep,
  isEmpty,
  differenceWith,
  isDeepEqual,
} = require("rubico/x");

const logger = require("../../../logger")({ prefix: "Domain" });
const { tos } = require("../../../tos");
const {
  getByNameCore,
  isUpByIdCore,
  isDownByIdCore,
  logError,
  axiosErrorToJSON,
} = require("../../Common");

const findName = get("DomainName");
const findId = findName;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsDomain = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const route53domains = new AWS.Route53Domains({ region: "us-east-1" });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#listDomains-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.debug(`getList ${tos(params)}`);
      }),
      () => route53domains.listDomains(params).promise(),
      get("Domains"),
      map(
        async ({ DomainName }) =>
          await route53domains.getDomainDetail({ DomainName }).promise()
      ),
      (Domains) => ({
        total: Domains.length,
        items: Domains,
      }),
      tap((Domains) => {
        logger.debug(`getList Domain result: ${tos(Domains)}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#getDomain-property
  const getById = pipe([
    tap(({ id }) => {
      logger.debug(`getById ${id}`);
    }),
    tryCatch(
      ({ id }) => route53domains.getDomainDetail({ DomainName: id }).promise(),
      switchCase([
        (error) => error.code !== "NoSuchDomain",
        (error) => {
          logger.debug(`getById error: ${tos(error)}`);
          throw error;
        },
        (error, { id }) => {
          logger.debug(`getById ${id} NoSuchDomain`);
        },
      ])
    ),
    tap((result) => {
      logger.debug(`getById result: ${tos(result)}`);
    }),
  ]);

  const getByName = ({ name }) => getById({ id: name });

  const configDefault = async ({ name, properties }) =>
    defaultsDeep({
      DomainName: name,
    })(properties);

  const isUpById = isUpByIdCore({ getById });

  return {
    type: "Route53Domain",
    spec,
    isUpById,
    configDefault,
    findId,
    getByName,
    getById,
    cannotBeDeleted: () => true,
    findName,
    getList,
  };
};
