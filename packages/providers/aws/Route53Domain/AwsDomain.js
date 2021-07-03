const assert = require("assert");
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
const { find, pluck, defaultsDeep } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "Domain" });
const { tos } = require("@grucloud/core/tos");
const { isUpByIdCore } = require("@grucloud/core/Common");
const { Route53DomainsNew } = require("../AwsCommon");
const findName = get("DomainName");
const findId = findName;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsDomain = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const route53domains = Route53DomainsNew(config);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#listDomains-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.debug(`getList domain`);
      }),
      () => route53domains().listDomains(params),
      get("Domains"),
      map(({ DomainName }) => route53domains().getDomainDetail({ DomainName })),
      tap((Domains) => {
        //logger.debug(`getList Domain result: ${tos(Domains)}`);
      }),
      (Domains) => ({
        total: Domains.length,
        items: Domains,
      }),
      tap((result) => {
        logger.info(`getList #domains  ${tos(result.total)}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#getDomain-property
  const getById = pipe([
    tap(({ id }) => {
      logger.debug(`getById domain ${id}`);
    }),
    tryCatch(
      ({ id }) => route53domains().getDomainDetail({ DomainName: id }),
      switchCase([
        eq(get("code"), "NoSuchDomain"),
        (error, { id }) => {
          logger.debug(`getById ${id} NoSuchDomain`);
        },
        (error) => {
          logger.debug(`getById domain error: ${tos(error)}`);
          throw error;
        },
      ])
    ),
    tap((result) => {
      logger.debug(`getById domain result: ${tos(result)}`);
    }),
  ]);

  const getByName = ({ name }) => getById({ id: name });

  const configDefault = async ({ name, properties }) =>
    defaultsDeep({
      DomainName: name,
    })(properties);

  const isUpById = isUpByIdCore({ getById });

  return {
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
