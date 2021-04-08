const assert = require("assert");
const { map, pipe, tap, get, not, assign, switchCase } = require("rubico");
const { first, defaultsDeep, isEmpty } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const logger = require("@grucloud/core/logger")({
  prefix: "ELBTargetGroup",
});

const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { isUpByIdCore, isDownByIdCore } = require("@grucloud/core/Common");
const { ELBv2New, buildTags, shouldRetryOnException } = require("../AwsCommon");

const findName = get("TargetGroupName");
const findId = get("TargetGroupArn");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html

exports.ELBTargetGroup = ({ spec, config }) => {
  const elb = ELBv2New(config);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeTargetGroups-property
  const getList = async () =>
    pipe([
      tap(() => {
        logger.info(`getList target group`);
      }),
      () => elb().describeTargetGroups({}),
      get("TargetGroups"),
      map(
        assign({
          Tags: pipe([
            ({ TargetGroupArn }) =>
              elb().describeTags({ ResourceArns: [TargetGroupArn] }),
            get("TagDescriptions"),
            first,
            get("Tags"),
          ]),
        })
      ),
      tap((results) => {
        logger.debug(`getList target group result: ${tos(results)}`);
      }),
      (items = []) => ({
        total: items.length,
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList: target group #total: ${total}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeTargetGroups-property
  const getByName = ({ name }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${name}`);
      }),
      () => ({ Names: [name] }),
      (params) => elb().describeTargetGroups(params),
      get("TargetGroups"),
      first,
      tap((result) => {
        logger.debug(`getByName result: ${tos(result)}`);
      }),
    ])();

  const getById = ({ id }) => getByName({ name: id });

  const isInstanceUp = not(isEmpty);

  const isUpById = isUpByIdCore({ isInstanceUp, getById });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createTargetGroup-property
  const create = async ({ name, payload }) =>
    pipe([
      tap(() => {
        logger.info(`create target group : ${name}`);
        logger.debug(`${tos(payload)}`);
      }),
      () => elb().createTargetGroup(payload),
      get("TargetGroups"),
      first,
      tap(({ TargetGroupArn }) =>
        retryCall({
          name: `target group isUpById: ${name}, TargetGroupArn: ${TargetGroupArn}`,
          fn: () => isUpById({ name, id: TargetGroupArn }),
          config,
        })
      ),
      tap((result) => {
        logger.info(`created target group ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#deleteTargetGroup-property
  const destroy = async ({ live }) =>
    pipe([
      () => ({ id: findId(live), name: findName(live) }),
      ({ id, name }) =>
        pipe([
          tap(() => {
            logger.info(`destroy target group ${JSON.stringify({ id })}`);
          }),
          () => ({
            TargetGroupArn: id,
          }),
          (params) => elb().deleteTargetGroup(params),
          tap(() =>
            retryCall({
              name: `target group isDownById: ${id}`,
              fn: () => isDownById({ id }),
              config,
            })
          ),
          tap(() => {
            logger.info(`destroyed target group ${JSON.stringify({ name })}`);
          }),
        ])(),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createTargetGroup-property
  const configDefault = async ({ name, properties, dependencies: { vpc } }) =>
    pipe([
      tap(() => {
        assert(vpc);
      }),
      () => properties,
      defaultsDeep({
        Name: name,
        Port: 80,
        Protocol: "HTTP",
        VpcId: getField(vpc, "VpcId"),
        Tags: buildTags({ name, config }),
      }),
    ])();

  return {
    type: "TargetGroup",
    spec,
    isInstanceUp,
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
  };
};
