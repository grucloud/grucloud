const assert = require("assert");
const {
  pipe,
  assign,
  map,
  tap,
  get,
  pick,
  switchCase,
  eq,
  not,
  filter,
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
const { findLiveById } = require("@grucloud/core/generatorUtils");

const { createAwsService } = require("../AwsService");

const { IAMGroup } = require("./IAMGroup");
const { IAMGroupPolicy } = require("./IAMGroupPolicy");
const { IAMRole, findDependenciesRole } = require("./IAMRole");
const { IAMInstanceProfile } = require("./IAMInstanceProfile");
const { IAMOpenIDConnectProvider } = require("./IAMOpenIDConnectProvider");
const { IAMPolicy, isOurMinionIamPolicy } = require("./IAMPolicy");
const { IAMUser } = require("./IAMUser");
const { IAMSAMLProvider } = require("./IAMSAMLProvider");
const { IAMUserPolicy } = require("./IAMUserPolicy");
const { IAMVirtualMFADevice } = require("./IAMVirtualMFADevice");

const {
  buildDependenciesPolicy,
  assignPolicyDocumentAccountAndRegion,
  assignPolicyAccountAndRegion,
} = require("./IAMCommon");

const {
  compareAws,
  isOurMinion,
  ignoreResourceCdk,
  replaceRegion,
  replaceAccountAndRegion,
} = require("../AwsCommon");

const GROUP = "IAM";

const compare = compareAws({});

module.exports = pipe([
  () => [
    createAwsService(IAMGroup({ compare })),
    createAwsService(IAMGroupPolicy({ compare })),
    createAwsService(IAMInstanceProfile({ compare })),
    createAwsService(IAMOpenIDConnectProvider({ compare })),
    {
      type: "Policy",
      Client: IAMPolicy,
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
    {
      type: "Role",
      Client: IAMRole,
      inferName: () => get("RoleName"),
      propertiesDefault: { Path: "/", MaxSessionDuration: 3600 },
      compare: compare({
        filterAll: () =>
          pipe([
            pick([
              "AssumeRolePolicyDocument",
              "Policies",
              "Description",
              "MaxSessionDuration",
            ]),
          ]),
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
            "MaxSessionDuration",
            "Path",
            "AssumeRolePolicyDocument",
            "Policies",
            "AttachedPolicies",
          ]),
          assign({
            RoleName: pipe([
              get("RoleName"),
              replaceAccountAndRegion({ lives, providerConfig }),
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
    createAwsService(IAMSAMLProvider({ compare })),
    createAwsService(IAMUser({ compare })),
    createAwsService(IAMUserPolicy({ compare })),
    createAwsService(IAMVirtualMFADevice({ compare })),
  ],
  map(defaultsDeep({ group: GROUP, isOurMinion, compare: compare({}) })),
]);
