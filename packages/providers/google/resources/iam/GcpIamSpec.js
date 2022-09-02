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
const {
  prepend,
  find,
  isEmpty,
  callProp,
  identity,
  first,
} = require("rubico/x");
const { camelCase } = require("change-case");
const { compareGoogle } = require("../../GoogleCommon");
const { hasDependency } = require("@grucloud/core/generatorUtils");

const {
  GcpServiceAccount,
  isOurMinionServiceAccount,
} = require("./GcpServiceAccount");

const { GcpIamPolicy, compareIamPolicy } = require("./GcpIamPolicy");
const { GcpIamBinding, isOurMinionIamBinding } = require("./GcpIamBinding");

const GROUP = "iam";

module.exports = () =>
  map(
    assign({
      group: () => GROUP,
      baseUrl: () => "https://iam.googleapis.com/v1",
    })
  )([
    {
      type: "ServiceAccount",
      Client: GcpServiceAccount,
      inferName: pipe([get("properties.accountId")]),
      //TODO remove
      methods: {
        get: {
          path: "/projects/{project}/serviceAccounts/{serviceAccount}",
          parameterOrder: ["project", "serviceAccount"],
        },
        list: { path: "/projects/{project}/serviceAccounts" },
        insert: { path: "/projects/{project}/serviceAccounts" },
        delete: {
          path: "/projects/{project}/serviceAccounts/{serviceAccount}",
          parameterOrder: ["project", "serviceAccount"],
        },
      },
      isOurMinion: isOurMinionServiceAccount,
      resourceVarName: pipe([prepend("sa_"), camelCase]),
      filterLive: () =>
        pipe([
          ({ email, description, displayName }) => ({
            accountId: pipe([() => email, callProp("split", "@"), first])(),
            serviceAccount: { displayName, description },
          }),
          tap((params) => {
            assert(true);
          }),
        ]),
      compare: compareGoogle({
        filterTarget: () =>
          pipe([
            tap(({ serviceAccount }) => {
              assert(true);
            }),
            ({ serviceAccount }) => serviceAccount,
          ]),
        filterLive: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            pick(["displayName", "description", "name"]),
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
      inferName: pipe([get("properties.role")]),
      Client: GcpIamBinding,
      isOurMinion: isOurMinionIamBinding,
      compare: compareGoogle({
        filterTarget: () =>
          pipe([
            tap(({ serviceAccount }) => {
              assert(true);
            }),
          ]),
        filterLive: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
          ]),
      }),
      filterLive: () => pipe([pick(["role"])]),
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
    },
  ]);
