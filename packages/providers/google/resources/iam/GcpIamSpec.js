const assert = require("assert");
const {
  pipe,
  assign,
  map,
  tap,
  pick,
  or,
  get,
  filter,
  eq,
  all,
  and,
  switchCase,
} = require("rubico");
const { prepend, find, isEmpty, callProp, identity } = require("rubico/x");
const { camelCase } = require("change-case");
const { compare } = require("../../GoogleCommon");
const { hasDependency } = require("@grucloud/core/generatorUtils");

const {
  GcpServiceAccount,
  isOurMinionServiceAccount,
} = require("./GcpServiceAccount");

const { GcpIamPolicy, compareIamPolicy } = require("./GcpIamPolicy");
const {
  GcpIamBinding,
  isOurMinionIamBinding,
  compareIamBinding,
} = require("./GcpIamBinding");

const GROUP = "iam";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "ServiceAccount",
      Client: GcpServiceAccount,
      isOurMinion: isOurMinionServiceAccount,
      resourceVarName: pipe([prepend("sa_"), camelCase]),
      filterLive: () =>
        pipe([
          ({ description, displayName }) => ({
            serviceAccount: { displayName, description },
          }),
        ]),
      compare: compare({
        filterTarget: pipe([
          tap(({ serviceAccount }) => {
            assert(true);
          }),
          ({ serviceAccount }) => serviceAccount,
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
          pick(["displayName", "description"]),
        ]),
      }),
    },
    {
      type: "Policy",
      dependencies: {
        serviceAccount: { type: "ServiceAccount", group: "iam" },
      },
      singleton: true,
      Client: GcpIamPolicy,
      isOurMinion: () => true,
      compare: compareIamPolicy,
      filterLive: () => pipe([pick(["bindings"])]),
      ignoreResource: () => () => true,
    },
    {
      type: "Binding",
      dependencies: {
        serviceAccount: { type: "ServiceAccount", group: "iam" },
      },
      Client: GcpIamBinding,
      isOurMinion: isOurMinionIamBinding,
      compare: compareIamBinding,
      filterLive: () => pipe([pick(["members"])]),
      dependencies: {
        serviceAccounts: { type: "ServiceAccount", group: "iam", list: true },
      },
      ignoreResource:
        ({ lives }) =>
        ({ dependencies, live, name }) =>
          pipe([
            () => live,
            or([
              pipe([and([eq(get("role"), "roles/owner")])]),
              pipe([
                get("members"),
                filter(callProp("startsWith", "serviceAccount:")),
                all(
                  pipe([
                    callProp("replace", "serviceAccount:", ""),
                    (email) =>
                      pipe([
                        () => lives,
                        find(
                          and([
                            eq(get("live.email"), email),
                            eq(get("groupType"), "iam::ServiceAccount"),
                          ])
                        ),
                        switchCase([
                          isEmpty,
                          () => true,
                          get("managedByOther"),
                        ]),
                      ])(),
                  ])
                ),
              ]),
            ]),
            tap.if(identity, () => {
              console.log(`Ignore binding ${name}`);
            }),
          ])(),
      hasNoProperty: ({ lives, resource }) =>
        pipe([
          () => resource,
          or([hasDependency({ type: "ServiceAccount", group: "iam" })]),
        ])(),
    },
  ]);
