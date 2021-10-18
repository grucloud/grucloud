const assert = require("assert");
const {
  pipe,
  assign,
  map,
  tap,
  get,
  pick,
  omit,
  switchCase,
  or,
  eq,
} = require("rubico");
const { when, isString, prepend, callProp, last, find } = require("rubico/x");
const { compare, omitIfEmpty } = require("@grucloud/core/Common");
const {
  hasDependency,
  findLiveById,
  ResourceVarNameDefault,
} = require("@grucloud/core/generatorUtils");
const { AwsIamUser } = require("./AwsIamUser");
const { AwsIamGroup, isOurMinionIamGroup } = require("./AwsIamGroup");
const { AwsIamRole } = require("./AwsIamRole");
const { AwsIamInstanceProfile } = require("./AwsIamInstanceProfile");
const { AwsIamPolicy, isOurMinionIamPolicy } = require("./AwsIamPolicy");

const {
  AwsIamOpenIDConnectProvider,
} = require("./AwsIamOpenIDConnectProvider");

const { isOurMinion } = require("../AwsCommon");

const GROUP = "IAM";

const replaceAccountAndRegion = ({ providerConfig }) =>
  pipe([
    callProp("replace", providerConfig.accountId(), "${config.accountId()}"),
    callProp("replace", providerConfig.region, "${config.region}"),
    (resource) => () => "`" + resource + "`",
  ]);

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "OpenIDConnectProvider",
      Client: AwsIamOpenIDConnectProvider,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([omit(["Tags"])]),
        filterLive: pipe([
          assign({ Url: pipe([get("Url"), prepend("https://")]) }),
          omit(["ThumbprintList", "CreateDate", "Arn", "Tags"]),
        ]),
      }),
      filterLive: () => pick(["ClientIDList"]),
      dependencies: () => ({
        cluster: { type: "Cluster", group: "EKS" },
        role: { type: "Role", group: "IAM" },
      }),
      hasNoProperty: ({ lives, resource }) =>
        pipe([
          () => resource,
          or([hasDependency({ type: "Cluster", group: "EKS" })]),
        ])(),
    },
    {
      type: "User",
      dependsOn: ["IAM::Policy", "IAM::Group"],
      Client: AwsIamUser,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([omit(["Tags"])]),
        filterLive: pipe([
          omit([
            "UserId",
            "Arn",
            "CreateDate",
            "LoginProfile",
            "Policies",
            "AttachedPolicies",
            "Groups",
            "Tags",
            "AccessKeys",
          ]),
        ]),
      }),
      filterLive: () => pick(["Path"]),
      dependencies: () => ({
        iamGroups: { type: "Group", group: "IAM", list: true },
        policies: { type: "Policy", group: "IAM", list: true },
      }),
    },
    {
      type: "Group",
      dependsOn: ["IAM::Policy"],
      Client: AwsIamGroup,
      isOurMinion: isOurMinionIamGroup,
      compare: compare({
        filterTarget: pipe([omit(["Tags"])]),
        filterLive: pipe([
          omit([
            "GroupId",
            "Arn",
            "CreateDate",
            "Policies",
            "AttachedPolicies",
          ]),
        ]),
      }),
      filterLive: () => pick(["Path"]),
      dependencies: () => ({
        policies: { type: "Policy", group: "IAM", list: true },
      }),
    },
    {
      type: "Role",
      dependsOn: ["IAM::Policy"],
      Client: AwsIamRole,
      isOurMinion,
      compare: compare({
        filterAll: pipe([pick(["AssumeRolePolicyDocument"])]),
      }),
      transformDependencies: ({ provider }) =>
        pipe([
          assign({
            policies: pipe([
              get("policies", []),
              map(
                when(isString, (name) =>
                  provider.IAM.usePolicy({
                    name: pipe([callProp("split", "/"), last])(name),
                    properties: () => ({
                      Arn: name,
                      Path: pipe([
                        () => name,
                        callProp("replace", "arn:aws:iam::aws:policy/", ""),
                        callProp("split", "/"),
                        callProp("slice", 0, -1),
                        callProp("join", "/"),
                        prepend("/"),
                      ])(),
                    }),
                  })
                )
              ),
            ]),
          }),
        ]),
      filterLive: ({ providerConfig }) =>
        pipe([
          pick(["Description", "Path", "AssumeRolePolicyDocument", "Policies"]),
          assign({
            Policies: pipe([
              get("Policies", []),
              map(
                assign({
                  PolicyDocument: pipe([
                    get("PolicyDocument"),
                    assign({
                      Statement: pipe([
                        get("Statement"),
                        map(
                          assign({
                            Resource: pipe([
                              get("Resource"),
                              switchCase([
                                Array.isArray,
                                map(
                                  replaceAccountAndRegion({ providerConfig })
                                ),
                                replaceAccountAndRegion({ providerConfig }),
                              ]),
                            ]),
                          })
                        ),
                      ]),
                    }),
                  ]),
                })
              ),
            ]),
          }),
          omitIfEmpty(["Description", "Policies"]),
        ]),
      includeDefaultDependencies: true,
      dependencies: () => ({
        policies: {
          type: "Policy",
          group: "IAM",
          list: true,
          findDependencyNames: ({ resource, lives, providerName }) =>
            pipe([
              () => resource.dependencies,
              find(eq(get("groupType"), `IAM::Policy`)),
              get("ids"),
              map((id) =>
                pipe([
                  () => id,
                  findLiveById({
                    type: "Policy",
                    group: "IAM",
                    lives,
                    providerName,
                  }),
                  switchCase([
                    isEmpty,
                    () => `"${id}"`,
                    ({ group = "compute", type, name }) =>
                      `resources.${group}.${type}.${ResourceVarNameDefault(
                        name
                      )}`,
                  ]),
                ])()
              ),
              (dependencyVarNames) => ({ list: true, dependencyVarNames }),
              tap((params) => {
                assert(true);
              }),
            ])(),
        },
        openIdConnectProvider: {
          type: "OpenIDConnectProvider",
          group: "IAM",
        },
      }),
      hasNoProperty: ({ resource }) =>
        pipe([
          () => resource,
          or([hasDependency({ type: "OpenIDConnectProvider", group: "IAM" })]),
        ])(),
    },
    {
      type: "Policy",
      Client: AwsIamPolicy,
      isOurMinion: isOurMinionIamPolicy,
      compare: compare({
        filterAll: pipe([
          tap((params) => {
            assert(true);
          }),
          //TODO description
          pick(["PolicyDocument"]),
        ]),
      }),
      filterLive: switchCase([
        get("resource.cannotBeDeleted"),
        () => pick(["Arn"]),
        () => pick(["PolicyDocument", "Path", "Description"]),
      ]),
    },
    {
      type: "InstanceProfile",
      dependsOn: ["IAM::Role"],
      Client: AwsIamInstanceProfile,
      isOurMinion,
      compare: compare({
        filterAll: pipe([omit(["Tags"])]),
        filterLive: pipe([
          omit(["Path", "InstanceProfileId", "Arn", "CreateDate", "Roles"]),
        ]),
      }),
      filterLive: () => pick([]),
      dependencies: () => ({
        roles: { type: "Role", group: "IAM", list: true },
      }),
    },
  ]);
