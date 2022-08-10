const assert = require("assert");
const { pipe, tap, get, eq, any, assign, pick, omit } = require("rubico");
const { defaultsDeep, forEach, callProp } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "IamGroup" });
const { getByNameCore } = require("@grucloud/core/Common");
const { AwsClient } = require("../AwsClient");
const { createIAM, assignAttachedPolicies } = require("./AwsIamCommon");

const findName = get("live.GroupName");
const findId = findName;
const pickId = pick(["GroupName"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamGroup = ({ spec, config }) => {
  const iam = createIAM(config);
  const client = AwsClient({ spec, config })(iam);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listGroups-property
  const getList = client.getList({
    method: "listGroups",
    getParam: "Groups",
    decorate: () =>
      pipe([
        assign({
          AttachedPolicies: pipe([
            pick(["GroupName"]),
            defaultsDeep({ MaxItems: 1e3 }),
            iam().listAttachedGroupPolicies,
            get("AttachedPolicies"),
            callProp("sort", (a, b) => a.PolicyArn.localeCompare(b.PolicyArn)),
          ]),
          Policies: pipe([
            pick(["GroupName"]),
            defaultsDeep({ MaxItems: 1e3 }),
            iam().listGroupPolicies,
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
    dependencies: { policies = [] },
  }) =>
    pipe([
      () => ({}),
      assignAttachedPolicies({ policies }),
      defaultsDeep(otherProps),
      defaultsDeep({
        GroupName: name,
      }),
      // Cannot set Tags
    ])();

  const attachGroupPolicy = ({ name }) =>
    pipe([
      forEach(
        pipe([
          tap(({ PolicyArn }) => {
            assert(PolicyArn);
            assert(name);
          }),
          pick(["PolicyArn"]),
          defaultsDeep({ GroupName: name }),
          iam().attachGroupPolicy,
        ])
      ),
    ]);

  const create = client.create({
    method: "createGroup",
    getById,
    filterPayload: omit(["AttachedPolicies"]),
    pickCreated: () => get("Group"),
    postCreate: ({ name, payload }) =>
      pipe([
        () => payload,
        get("AttachedPolicies", []),
        attachGroupPolicy({ name }),
      ]),
  });

  const updateAttachedPolicies = ({ name, diff }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => diff,
      get("liveDiff.added.AttachedPolicies", []),
      //putUserAttachedPolicies({ name }),
    ]);

  const update = async ({ name, diff }) =>
    pipe([
      tap((params) => {
        assert(diff);
      }),
      updateAttachedPolicies({ name, diff }),
    ])();

  const removeUserFromGroup = ({ GroupName }) =>
    pipe([
      () => ({
        GroupName,
        MaxItems: 1e3,
      }),
      iam().getGroup,
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
  });

  return {
    spec,
    findId,
    getByName,
    findName,
    create,
    update,
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
