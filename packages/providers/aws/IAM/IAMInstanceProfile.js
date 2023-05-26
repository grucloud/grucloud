const assert = require("assert");
const {
  map,
  pipe,
  tap,
  get,
  eq,
  not,
  pick,
  assign,
  or,
  omit,
} = require("rubico");
const {
  defaultsDeep,
  isEmpty,
  forEach,
  find,
  pluck,
  callProp,
  unless,
  prepend,
} = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "IamInstanceProfile",
});
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags, removeRoleFromInstanceProfile } = require("../AwsCommon");

const {
  tagResourceIam,
  untagResourceIam,
  ignoreErrorCodes,
} = require("./IAMCommon");

//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#tagInstanceProfile-property
const tagResource = tagResourceIam({
  field: "InstanceProfileName",
  method: "tagInstanceProfile",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#untagInstanceProfile-property
const untagResource = untagResourceIam({
  field: "InstanceProfileName",
  method: "untagInstanceProfile",
});

const findId = () => get("Arn");
const pickId = pick(["InstanceProfileName"]);

const findNameEks =
  ({ lives, config }) =>
  (live) =>
    pipe([
      tap(() => {
        assert(lives);
        assert(live.InstanceProfileName);
      }),
      lives.getByType({
        type: "LaunchTemplate",
        group: "EC2",
        providerName: config.providerName,
      }),
      find(eq(get("live.LaunchTemplateName"), live.InstanceProfileName)),
      get("name"),
      unless(isEmpty, prepend("instance-profile-")),
    ])();

const findName = (params) => (live) => {
  const fns = [findNameEks(params), get("InstanceProfileName")];
  for (fn of fns) {
    const name = fn(live);
    if (!isEmpty(name)) {
      return name;
    }
  }
};

const managedByOther =
  ({ lives }) =>
  (live) =>
    pipe([
      tap(() => {
        assert(live.InstanceProfileName);
      }),
      () => live,
      get("InstanceProfileName"),
      or([
        //
        callProp("startsWith", "eks-"),
        callProp("startsWith", "AWSCloud9"),
      ]),
      tap((params) => {
        assert(true);
      }),
    ])();

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assign({
      Tags: pipe([
        pick(["InstanceProfileName"]),
        endpoint().listInstanceProfileTags,
        get("Tags"),
      ]),
    }),
  ]);

exports.IAMInstanceProfile = ({ compare }) => ({
  type: "InstanceProfile",
  package: "iam",
  client: "IAM",
  propertiesDefault: {},
  omitProperties: ["InstanceProfileId", "Arn", "CreateDate", "Roles"],
  managedByOther,
  findName,
  findId,
  ignoreErrorCodes,
  compare: compare({
    //TODO remove
    filterAll: () => pipe([omit(["Tags"])]),
    filterLive: () => pipe([omit(["Path"])]),
  }),
  filterLive: () => pick([]),
  dependencies: {
    roles: {
      type: "Role",
      group: "IAM",
      list: true,
      dependencyIds: () => pipe([get("Roles"), pluck("Arn")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#getInstanceProfile-property
  getById: {
    method: "getInstanceProfile",
    getField: "InstanceProfile",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listInstanceProfiles-property
  getList: {
    method: "listInstanceProfiles",
    getParam: "InstanceProfiles",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createInstanceProfile-property
  create:
    ({ endpoint, getById }) =>
    ({ name, payload = {}, dependencies }) =>
      pipe([
        tap(() => {
          logger.info(`create iam instance profile ${name}`);
          logger.debug(`payload: ${tos(payload)}`);
        }),
        () => payload,
        endpoint().createInstanceProfile,
        dependencies,
        get("roles"),
        tap((roles) => {
          assert(roles, "missing dependency roles");
          assert(Array.isArray(roles), "roles must be an array");
        }),
        forEach((iamRole) =>
          endpoint().addRoleToInstanceProfile({
            InstanceProfileName: name,
            RoleName: iamRole.name,
          })
        ),
        () =>
          retryCall({
            name: `create instance profile, getById: ${name}`,
            fn: pipe([() => ({ InstanceProfileName: name }), getById({})]),
            isExpectedResult: pipe([get("Roles"), not(isEmpty)]),
            config: { retryDelay: 2e3 },
          }),
        tap((instance) => {
          logger.info(`created iam instance profile  ${name}`);
          logger.debug(
            `created iam instance profile ${tos({ name, instance })}`
          );
        }),
      ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#updateInstanceProfile-property

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteInstanceProfile-property
  destroy: {
    pickId,
    preDestroy: ({ endpoint }) =>
      tap(
        pipe([
          ({ Roles, InstanceProfileName }) =>
            pipe([
              () => Roles,
              //TODO
              forEach(({ RoleName }) =>
                removeRoleFromInstanceProfile({ endpoint })({
                  RoleName,
                  InstanceProfileName,
                })
              ),
            ])(),
        ])
      ),
    method: "deleteInstanceProfile",
    ignoreErrorCodes,
  },
  getByName: getByNameCore,
  tagger: ({ config }) => ({
    tagResource,
    untagResource,
  }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        InstanceProfileName: name,
        Tags: buildTags({
          name,
          config,
          namespace,
          UserTags: Tags,
        }),
      }),
    ])(),
});
