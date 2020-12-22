const assert = require("assert");
const AWS = require("aws-sdk");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  filter,
  switchCase,
  fork,
  eq,
} = require("rubico");
const { defaultsDeep, isEmpty } = require("rubico/x");
const moment = require("moment");
const logger = require("../../../logger")({ prefix: "IamPolicy" });
const { retryCall } = require("../../Retry");
const { tos } = require("../../../tos");
const {
  IAMNew,
  buildTags,
  findNameInDescription,
  shouldRetryOnException,
  shouldRetryOnExceptionDelete,
} = require("../AwsCommon");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamPolicy = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const iam = IAMNew(config);

  const findName = (item) =>
    findNameInDescription({ Description: item.Description });

  const findId = (item) => {
    assert(item);
    const id = item.Arn;
    assert(id);
    return id;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listPolicies-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.debug(`getList`);
      }),
      () => iam().listPolicies({ ...params, Scope: "Local", MaxItems: 1e3 }),
      tap(({ Policies }) => {
        logger.debug(`getList: ${Policies.length}`);
      }),
      get("Policies"),
      filter((policy) => moment(policy.CreateDate).isAfter("2020-09-11")),
      tap((policies) => {
        logger.debug(`getList: ${policies.length}`);
      }),
      map.pool(
        20,
        pipe([
          tap((policy) => {
            logger.debug(`getList policy: ${tos(policy)}`);
          }),
          (policy) => iam().getPolicy({ PolicyArn: policy.Arn }),
          get("Policy"),
          tap((policy) => {
            logger.debug(policy);
          }),
        ])
      ),
      tap((policy) => {
        logger.debug(`getList policy: ${tos(policy)}`);
      }),
      (policies) => ({
        total: policies.length,
        items: policies,
      }),
    ])();

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });

  const getById = pipe([
    tap(({ id }) => {
      logger.debug(`getById ${id}`);
    }),
    tryCatch(
      ({ id }) => iam().getPolicy({ PolicyArn: id }),
      switchCase([
        eq(get("code"), "NoSuchEntity"),
        (error, { id }) => {
          logger.debug(`getById ${id} NoSuchEntity`);
        },
        (error) => {
          logger.debug(`getById error: ${tos(error)}`);
          throw error;
        },
      ])
    ),
    tap((result) => {
      logger.debug(`getById result: ${result}`);
    }),
  ]);

  const isUpById = isUpByIdCore({ getById });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createPolicy-property
  const create = async ({ name, payload = {}, dependencies }) => {
    assert(name);
    assert(payload);
    logger.debug(`create policy ${tos({ name, payload })}`);

    const createParams = {
      ...payload,
      Description: `${payload.Description}, tags:${JSON.stringify(
        buildTags({ name, config })
      )}`,
      PolicyDocument: JSON.stringify(payload.PolicyDocument),
    };

    const { Policy } = await iam().createPolicy(createParams);
    const { iamUser, iamRole, iamGroup } = dependencies;

    if (iamUser) {
      const attachUserPolicyParams = {
        PolicyArn: Policy.Arn,
        UserName: iamUser.name,
      };
      await iam().attachUserPolicy(attachUserPolicyParams);
    }
    if (iamRole) {
      await iam().attachRolePolicy({
        PolicyArn: Policy.Arn,
        RoleName: iamRole.name,
      });
    }
    if (iamGroup) {
      await iam().attachGroupPolicy({
        PolicyArn: Policy.Arn,
        GroupName: iamGroup.name,
      });
    }
    logger.debug(`create result ${tos(Policy)}`);

    return Policy;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deletePolicy-property

  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.debug(`destroy ${tos({ name, id })}`);
        assert(!isEmpty(id), `destroy invalid id`);
      }),
      () =>
        iam().listEntitiesForPolicy({
          PolicyArn: id,
        }),
      tap((result) => {
        logger.debug(`destroy ${tos(result)}`);
      }),
      fork({
        PolicyUsers: pipe([
          get("PolicyUsers"),
          tap((policyUsers) => {
            logger.debug(`destroy detachUserPolicy ${tos(policyUsers)}`);
          }),
          map((policyUsers) =>
            iam().detachUserPolicy({
              PolicyArn: id,
              UserName: policyUsers.UserName,
            })
          ),
        ]),
        PolicyGroups: pipe([
          get("PolicyGroups"),
          tap((policyGroups) => {
            logger.debug(`destroy detachGroupPolicy ${tos(policyGroups)}`);
          }),
          map((policyGroup) =>
            iam().detachGroupPolicy({
              PolicyArn: id,
              GroupName: policyGroup.GroupName,
            })
          ),
        ]),
        PolicyRoles: pipe([
          get("PolicyRoles"),
          tap((policyRoles) => {
            logger.debug(`destroy detachRolePolicy ${tos(policyRoles)}`);
          }),
          map((policyRole) =>
            iam().detachRolePolicy({
              PolicyArn: id,
              RoleName: policyRole.RoleName,
            })
          ),
        ]),
      }),
      () =>
        iam().deletePolicy({
          PolicyArn: id,
        }),
      () =>
        retryCall({
          name: `iam policy isDownById: ${name} id: ${id}`,
          fn: () => isDownById({ id }),
          config,
        }),
      tap(() => {
        logger.debug(`destroy done ${tos({ name, id })}`);
      }),
    ])();

  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({ PolicyName: name, Path: "/" })(properties);

  return {
    type: "IamPolicy",
    spec,
    isUpById,
    isDownById,
    findId,
    getByName,
    getById,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
    shouldRetryOnExceptionDelete,
  };
};

exports.isOurMinionIamPolicy = ({ resource, config }) => {
  assert(resource);
  const { managedByKey, managedByValue } = config;
  assert(managedByKey);
  assert(managedByValue);

  const tags = resource.Description?.split("tags:")[1];
  let minion = false;
  if (tags) {
    try {
      const tagsJson = JSON.parse(tags);

      if (
        tagsJson.find(
          (tag) => tag.Key === managedByKey && tag.Value === managedByValue
        )
      ) {
        minion = true;
      }
    } catch (error) {
      logger.error(`isOurMinionIamPolicy ${error}`);
    }
  }
  return minion;
};
