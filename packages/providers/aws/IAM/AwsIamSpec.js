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
  includes,
  unless,
} = require("rubico/x");
const { omitIfEmpty } = require("@grucloud/core/Common");
const {
  hasDependency,
  findLiveById,
} = require("@grucloud/core/generatorUtils");

const { createAwsService } = require("../AwsService");

const { IAMGroup } = require("./AwsIamGroup");
const { AwsIamRole, findDependenciesRole } = require("./AwsIamRole");
const { IAMInstanceProfile } = require("./AwsIamInstanceProfile");
const { AwsIamPolicy, isOurMinionIamPolicy } = require("./AwsIamPolicy");
const { IAMUser } = require("./AwsIamUser");
const { IAMUserPolicy } = require("./IAMUserPolicy");

const {
  AwsIamOpenIDConnectProvider,
} = require("./AwsIamOpenIDConnectProvider");

const {
  buildDependenciesPolicy,
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
    createAwsService(IAMInstanceProfile({ compare })),
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
          dependencyIds: () =>
            pipe([get("AttachedPolicies"), pluck("PolicyArn")]),
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
        openIdConnectProvider: {
          type: "OpenIDConnectProvider",
          group: "IAM",
          parent: true,
          dependencyId: ({ lives, config }) =>
            pipe([
              get("AssumeRolePolicyDocument.Statement"),
              pluck("Principal.Federated"),
              filter(not(isEmpty)),
              unless(isEmpty, (oidps) =>
                pipe([
                  lives.getByType({
                    type: "OpenIDConnectProvider",
                    group: "IAM",
                    providerName: config.providerName,
                  }),
                  find((connectProvider) =>
                    pipe([() => oidps, includes(connectProvider.id)])()
                  ),
                  get("id"),
                ])()
              ),
            ]),
        },
        ...findDependenciesRole(),
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
      dependencies: buildDependenciesPolicy({ policyKey: "PolicyDocument" }),
    },
    createAwsService(IAMUser({ compare })),
    createAwsService(IAMUserPolicy({ compare })),
  ],
  map(defaultsDeep({ group: GROUP, isOurMinion, compare: compare({}) })),
]);
