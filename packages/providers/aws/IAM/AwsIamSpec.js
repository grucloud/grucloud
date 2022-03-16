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
  not,
  filter,
  any,
} = require("rubico");
const {
  when,
  isString,
  prepend,
  callProp,
  isEmpty,
  find,
} = require("rubico/x");
const { omitIfEmpty } = require("@grucloud/core/Common");
const {
  hasDependency,
  findLiveById,
} = require("@grucloud/core/generatorUtils");
const { AwsIamUser } = require("./AwsIamUser");
const { AwsIamGroup, isOurMinionIamGroup } = require("./AwsIamGroup");
const { AwsIamRole } = require("./AwsIamRole");
const { AwsIamInstanceProfile } = require("./AwsIamInstanceProfile");
const { AwsIamPolicy, isOurMinionIamPolicy } = require("./AwsIamPolicy");

const {
  AwsIamOpenIDConnectProvider,
} = require("./AwsIamOpenIDConnectProvider");

const { compareAws, isOurMinion, ignoreResourceCdk } = require("../AwsCommon");
const defaultsDeep = require("rubico/x/defaultsDeep");

const GROUP = "IAM";

const compareIAM = compareAws({});

const replaceAccountAndRegion = ({ providerConfig }) =>
  pipe([
    callProp("replace", providerConfig.accountId(), "${config.accountId()}"),
    callProp("replace", providerConfig.region, "${config.region}"),
    (resource) => () => "`" + resource + "`",
  ]);

const filterAttachedPolicies = ({ lives }) =>
  pipe([
    assign({
      AttachedPolicies: pipe([
        get("AttachedPolicies"),
        filter(
          not(({ PolicyArn }) =>
            pipe([() => lives, any(eq(get("id"), PolicyArn))])()
          )
        ),
      ]),
    }),
    omitIfEmpty(["AttachedPolicies"]),
  ]);

module.exports = pipe([
  () => [
    {
      type: "OpenIDConnectProvider",
      Client: AwsIamOpenIDConnectProvider,
      compare: compareIAM({
        filterLive: () =>
          pipe([
            assign({ Url: pipe([get("Url"), prepend("https://")]) }),
            omit(["ThumbprintList", "CreateDate", "Arn"]),
          ]),
      }),
      filterLive: () => pick(["ClientIDList"]),
      dependencies: {
        cluster: { type: "Cluster", group: "EKS" },
        role: { type: "Role", group: "IAM" },
      },
      inferName: ({ properties, dependenciesSpec }) =>
        pipe([
          () => dependenciesSpec,
          switchCase([
            get("cluster"),
            pipe([get("cluster"), prepend("EKS::Cluster::")]),
            () => "",
          ]),
          prepend("oidp::"),
        ])(),
      hasNoProperty: ({ lives, resource }) =>
        pipe([
          () => resource,
          or([hasDependency({ type: "Cluster", group: "EKS" })]),
        ])(),
    },
    {
      type: "User",
      Client: AwsIamUser,
      compare: compareIAM({
        filterLive: () =>
          pipe([
            omit([
              "UserId",
              "Arn",
              "CreateDate",
              "LoginProfile",
              "Policies",
              "AccessKeys",
            ]),
          ]),
      }),
      filterLive: ({ lives }) =>
        pipe([
          pick(["Path", "AttachedPolicies"]),
          filterAttachedPolicies({ lives }),
        ]),
      dependencies: {
        iamGroups: { type: "Group", group: "IAM", list: true },
        policies: { type: "Policy", group: "IAM", list: true },
      },
    },
    {
      type: "Group",
      Client: AwsIamGroup,
      isOurMinion: isOurMinionIamGroup,
      compare: compareIAM({
        filterLive: () =>
          pipe([omit(["GroupId", "Arn", "CreateDate", "Policies"])]),
      }),
      filterLive: ({ lives }) =>
        pipe([
          pick(["Path", "AttachedPolicies"]),
          filterAttachedPolicies({ lives }),
        ]),
      dependencies: {
        policies: { type: "Policy", group: "IAM", list: true },
      },
    },
    {
      type: "Role",
      Client: AwsIamRole,
      compare: compareIAM({
        filterAll: () => pipe([pick(["AssumeRolePolicyDocument"])]),
      }),
      ignoreResource: ignoreResourceCdk,
      transformDependencies: ({ provider }) =>
        pipe([
          assign({
            policies: pipe([
              get("policies", []),
              map(
                when(isString, (name) =>
                  provider.IAM.usePolicy({
                    name: pipe([
                      () => name,
                      callProp("replace", "arn:aws:iam::aws:policy/", ""),
                    ])(),
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
      filterLive: ({ lives, resource, providerConfig }) =>
        pipe([
          tap((params) => {
            assert(lives);
            assert(resource);
          }),
          pick([
            "Description",
            "Path",
            "AssumeRolePolicyDocument",
            "Policies",
            "AttachedPolicies",
          ]),
          when(
            get("AttachedPolicies"),
            assign({
              AttachedPolicies: pipe([
                get("AttachedPolicies"),
                filter(
                  not(({ PolicyArn }) =>
                    pipe([
                      () => PolicyArn,
                      findLiveById({
                        type: "Policy",
                        group: "IAM",
                        lives,
                        providerName: resource.providerName,
                      }),
                    ])()
                  )
                ),
              ]),
            })
          ),
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
          omitIfEmpty(["Description", "Policies", "AttachedPolicies"]),
        ]),
      includeDefaultDependencies: true,
      dependencies: {
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
                    () => undefined,
                    ({ name }) => `'${name}'`,
                  ]),
                ])()
              ),
              filter(not(isEmpty)),
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
      },
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
      compare: compareIAM({
        filterAll: () =>
          pipe([
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
      Client: AwsIamInstanceProfile,
      compare: compareIAM({
        //TODO remove
        filterAll: () => pipe([omit(["Tags"])]),
        filterLive: () =>
          pipe([
            omit(["Path", "InstanceProfileId", "Arn", "CreateDate", "Roles"]),
          ]),
      }),
      filterLive: () => pick([]),
      dependencies: {
        roles: { type: "Role", group: "IAM", list: true },
      },
    },
  ],
  map(defaultsDeep({ group: GROUP, isOurMinion })),
]);
