const assert = require("assert");
const { pipe, tap, get, eq, any, assign, pick } = require("rubico");
const { defaultsDeep, isEmpty, forEach, pluck } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "IamGroup" });
const { tos } = require("@grucloud/core/tos");
const { getByNameCore } = require("@grucloud/core/Common");
const { IAMNew } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");

const findName = get("live.GroupName");
const findId = findName;
const pickId = pick(["GroupName"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamGroup = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const iam = IAMNew(config);

  const findDependencies = ({ live }) => [
    {
      type: "Policy",
      group: "IAM",
      ids: pipe([() => live, get("AttachedPolicies"), pluck("PolicyArn")])(),
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listGroups-property
  //TODO
  const getList = client.getList({
    method: "listGroups",
    getParam: "Groups",
    decorate: () =>
      pipe([
        assign({
          AttachedPolicies: pipe([
            ({ GroupName }) =>
              iam().listAttachedGroupPolicies({
                GroupName,
                MaxItems: 1e3,
              }),
            get("AttachedPolicies"),
          ]),
          Policies: pipe([
            ({ GroupName }) =>
              iam().listGroupPolicies({
                GroupName,
                MaxItems: 1e3,
              }),
            get("Policies"),
          ]),
        }),
      ]),
  });

  const getByName = getByNameCore({ getList, findName });

  const getById = client.getById({
    pickId,
    method: "getGroup",
    ignoreErrorCodes: ["NoSuchEntity"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createGroup-property
  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        GroupName: name,
        Path: "/",
        // Tags: buildTags({
        //   name,
        //   config,
        //   namespace,
        //   UserTags: Tags,
        // }),
      }),
    ])();

  const create = client.create({
    method: "createGroup",
    pickId,
    getById,
    config,
    pickCreated: () => pipe([get("Group")]),
    postCreate: ({ name, resolvedDependencies: { policies } }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        tap.if(
          () => policies,
          () =>
            forEach(
              pipe([
                tap((policy) => {
                  logger.debug(`attachGroupPolicy ${tos({ policy })}`);
                  assert(policy.live.Arn, `no live.Arn in ${tos(policy)}`);
                }),
                (policy) => ({
                  PolicyArn: policy.live.Arn,
                  GroupName: name,
                }),
                tap((params) => {
                  logger.debug(`attachGroupPolicy ${tos({ params })}`);
                }),
                iam().attachGroupPolicy,
              ])
            )(policies)
        ),
      ]),
  });

  const removeUserFromGroup = ({ GroupName }) =>
    pipe([
      () =>
        iam().getGroup({
          GroupName,
          MaxItems: 1e3,
        }),
      get("Users"),
      tap((Users = []) => {
        logger.info(`removeUserFromGroup #users ${Users.length}`);
      }),
      forEach(({ UserName }) =>
        iam().removeUserFromGroup({
          GroupName,
          UserName,
        })
      ),
    ])();

  const detachGroupPolicy = ({ GroupName }) =>
    pipe([
      tap(() => {
        assert(GroupName);
      }),
      () => ({ GroupName, MaxItems: 1e3 }),
      iam().listAttachedGroupPolicies,
      get("AttachedPolicies"),
      forEach(({ PolicyArn }) => {
        iam().detachGroupPolicy({
          PolicyArn,
          GroupName,
        });
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteGroup-property
  const destroy = client.destroy({
    pickId,
    preDestroy: pipe([
      get("live"),
      tap(detachGroupPolicy),
      tap(removeUserFromGroup),
    ]),
    method: "deleteGroup",
    ignoreErrorCodes: ["NoSuchEntity"],
    getById,
    config,
  });

  return {
    spec,
    findId,
    findDependencies,
    getByName,
    findName,
    create,
    destroy,
    getList,
    configDefault,
  };
};

exports.isOurMinionIamGroup = ({ name, live, resources }) =>
  pipe([
    tap(() => {
      assert(live);
      assert(resources, "resources");
    }),
    () => resources,
    any(eq(get("name"), live.GroupName)),
    tap((isOur) => {
      logger.debug(`isOurMinionIamGroup: ${name}, isOur:${isOur}`);
    }),
  ])();
