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
  forEach,
  pluck,
  when,
  isString,
  prepend,
  callProp,
  isEmpty,
  find,
  defaultsDeep,
} = require("rubico/x");
const { omitIfEmpty } = require("@grucloud/core/Common");
const {
  hasDependency,
  findLiveById,
} = require("@grucloud/core/generatorUtils");

const { createAwsService } = require("../AwsService");

const { IAMGroup } = require("./AwsIamGroup");
const { AwsIamRole } = require("./AwsIamRole");
const { AwsIamInstanceProfile } = require("./AwsIamInstanceProfile");
const { AwsIamPolicy, isOurMinionIamPolicy } = require("./AwsIamPolicy");
const { IAMUser } = require("./AwsIamUser");
const { IAMUserPolicy } = require("./IAMUserPolicy");

const {
  AwsIamOpenIDConnectProvider,
} = require("./AwsIamOpenIDConnectProvider");

const {
  dependenciesPolicy,
  assignPolicyDocumentAccountAndRegion,
  assignPolicyAccountAndRegion,
} = require("./AwsIamCommon");

const {
  compareAws,
  isOurMinion,
  ignoreResourceCdk,
  replaceRegion,
} = require("../AwsCommon");

const GROUP = "IAM";

const compare = compareAws({});

module.exports = pipe([
  () => [
    {
      type: "OpenIDConnectProvider",
      Client: AwsIamOpenIDConnectProvider,
      inferName:
        ({ dependenciesSpec: { cluster } }) =>
        (properties) =>
          pipe([
            switchCase([
              () => cluster,
              () => `eks-cluster::${cluster}`,
              pipe([
                () => properties,
                get("Url"),
                callProp("replace", "https://", ""),
              ]),
            ]),
          ])(),
      compare: compare({
        filterLive: () =>
          pipe([
            assign({ Url: pipe([get("Url"), prepend("https://")]) }),
            omit(["ThumbprintList", "CreateDate", "Arn"]),
          ]),
      }),
      filterLive: () => pick(["ClientIDList", "Url"]),
      dependencies: {
        cluster: {
          type: "Cluster",
          group: "EKS",
          dependencyId:
            ({ lives, config }) =>
            (live) =>
              pipe([
                lives.getByType({
                  type: "Cluster",
                  group: "EKS",
                  providerName: config.providerName,
                }),
                find(
                  eq(get("live.identity.oidc.issuer"), `https://${live.Url}`)
                ),
                get("id"),
              ])(),
        },
      },
      inferName:
        ({ dependenciesSpec }) =>
        (properties) =>
          pipe([
            () => dependenciesSpec,
            tap((params) => {
              assert(true);
            }),
            switchCase([
              get("cluster"),
              pipe([get("cluster"), prepend("eks-cluster::")]),
              pipe([
                () => properties,
                get("Url"),
                tap((Url) => {
                  assert(Url);
                }),
                callProp("replace", "https://", ""),
              ]),
            ]),
            prepend("oidp::"),
          ])(),
      hasNoProperty: ({ lives, resource }) =>
        pipe([
          () => resource,
          or([hasDependency({ type: "Cluster", group: "EKS" })]),
        ])(),
    },
    createAwsService(IAMGroup({ compare })),
    {
      type: "Role",
      Client: AwsIamRole,
      inferName: () => get("RoleName"),
      propertiesDefault: { Path: "/" },
      compare: compare({
        filterAll: () => pipe([pick(["AssumeRolePolicyDocument", "Policies"])]),
      }),
      ignoreResource: ignoreResourceCdk,
      transformDependencies: ({ provider }) =>
        pipe([
          assign({
            policies: pipe([
              get("policies", []),
              tap((params) => {
                assert(true);
              }),
              forEach(
                when(isString, (name) =>
                  provider.IAM.usePolicy({
                    name: pipe([
                      () => name,
                      callProp("replace", "arn:aws:iam::aws:policy/", ""),
                    ])(),
                    properties: () => ({
                      Arn: name,
                      PolicyName: name,
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
            "RoleName",
            "Description",
            "Path",
            "AssumeRolePolicyDocument",
            "Policies",
            "AttachedPolicies",
          ]),
          assign({
            RoleName: pipe([
              get("RoleName"),
              replaceRegion({ lives, providerConfig }),
            ]),
          }),
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
          when(
            get("AssumeRolePolicyDocument"),
            assign({
              AssumeRolePolicyDocument: pipe([
                get("AssumeRolePolicyDocument"),
                assignPolicyAccountAndRegion({ providerConfig, lives }),
              ]),
            })
          ),
          assign({
            Policies: pipe([
              get("Policies", []),
              map(
                assignPolicyDocumentAccountAndRegion({ providerConfig, lives })
              ),
            ]),
          }),
          omitIfEmpty(["Description", "Policies", "AttachedPolicies"]),
        ]),
      dependencies: {
        policies: {
          type: "Policy",
          group: "IAM",
          list: true,
          findDependencyNames: ({ resource, lives }) =>
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
                    providerName: resource.providerName,
                  }),
                  get("name"),
                ])()
              ),
              filter(not(isEmpty)),
              (dependencyVarNames) => ({ list: true, dependencyVarNames }),
              tap((params) => {
                assert(true);
              }),
            ])(),
        },
        ...dependenciesPolicy,
      },
    },
    {
      type: "Policy",
      Client: AwsIamPolicy,
      inferName: () =>
        pipe([
          get("PolicyName"),
          tap((PolicyName) => {
            assert(PolicyName);
          }),
        ]),
      isOurMinion: isOurMinionIamPolicy,
      compare: compare({
        filterAll: () =>
          pipe([
            //TODO description
            pick(["PolicyDocument"]),
          ]),
      }),
      filterLive: switchCase([
        get("resource.cannotBeDeleted"),
        () => pick(["Arn"]),
        ({ providerConfig, lives }) =>
          pipe([
            pick(["PolicyName", "PolicyDocument", "Path", "Description"]),
            assign({
              PolicyName: pipe([
                get("PolicyName"),
                replaceRegion({ lives, providerConfig }),
              ]),
            }),
            assignPolicyDocumentAccountAndRegion({ providerConfig, lives }),
          ]),
      ]),
      dependencies: dependenciesPolicy,
    },
    {
      type: "InstanceProfile",
      Client: AwsIamInstanceProfile,
      compare: compare({
        //TODO remove
        filterAll: () => pipe([omit(["Tags"])]),
        filterLive: () =>
          pipe([
            omit(["Path", "InstanceProfileId", "Arn", "CreateDate", "Roles"]),
          ]),
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
    },
    createAwsService(IAMUser({ compare })),
    createAwsService(IAMUserPolicy({ compare })),
  ],
  map(defaultsDeep({ group: GROUP, isOurMinion, compare: compare({}) })),
]);
