const assert = require("assert");
const { pipe, tap, get, pick, fork, switchCase, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const managedByOther =
  ({ lives, config }) =>
  (live) =>
    pipe([
      () => live,
      get("PolicyId"),
      (id) =>
        lives.getById({
          id,
          type: "Policy",
          group: "Organisations",
          providerName: config.providerName,
        }),
      get("live.AwsManaged"),
    ])();

const pickId = pipe([
  tap(({ PolicyId, TargetId }) => {
    assert(PolicyId);
    assert(TargetId);
  }),
  pick(["PolicyId", "TargetId"]),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html
exports.OrganisationsPolicyAttachment = () => ({
  type: "PolicyAttachment",
  package: "organizations",
  client: "Organizations",
  ignoreErrorCodes: ["PolicyNotFoundException"],
  managedByOther,
  cannotBeDeleted: managedByOther,
  inferName: pipe([
    get("dependenciesSpec"),
    ({ policy, account, root, organisationalUnit }) =>
      `policy-attach::${policy}::${account || root || organisationalUnit}`,
  ]),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        fork({
          policy: pipe([
            get("PolicyId"),
            (id) =>
              lives.getById({
                id,
                type: "Policy",
                group: "Organisations",
                providerName: config.providerName,
              }),
            get("name", live.PolicyId),
          ]),
          target: pipe([
            switchCase([
              eq(get("Type"), "ACCOUNT"),
              pipe([
                get("TargetId"),
                (id) =>
                  lives.getById({
                    id,
                    type: "Account",
                    group: "Organisations",
                    providerName: config.providerName,
                  }),
                get("name"),
              ]),
              eq(get("Type"), "ROOT"),
              pipe([
                get("TargetId"),
                (id) =>
                  lives.getById({
                    id,
                    type: "Root",
                    group: "Organisations",
                    providerName: config.providerName,
                  }),
                get("name"),
              ]),
              eq(get("Type"), "ORGANIZATIONAL_UNIT"),
              pipe([
                get("TargetId"),
                (id) =>
                  lives.getById({
                    id,
                    type: "OrganisationalUnit",
                    group: "Organisations",
                    providerName: config.providerName,
                  }),
                get("name"),
              ]),
              () => {
                assert(false, "missing target");
              },
            ]),
          ]),
        }),
        tap(({ policy, target }) => {
          assert(policy);
          assert(target);
        }),
        ({ policy, target }) => `policy-attach::${policy}::${target}`,
      ])(),
  findId: () => pipe([({ PolicyId, TargetId }) => `${PolicyId}::${TargetId}`]),
  omitProperties: ["TargetId", "PolicyId", "Type", "Arn", "Name"],
  dependencies: {
    policy: {
      type: "Policy",
      group: "Organisations",
      parent: true,
      dependencyId: ({ lives, config }) => get("PolicyId"),
    },
    account: {
      type: "Account",
      group: "Organisations",
      parent: true,
      dependencyId: ({ lives, config }) => get("TargetId"),
    },
    root: {
      type: "Root",
      group: "Organisations",
      parent: true,
      dependencyId: ({ lives, config }) => get("TargetId"),
    },
    organisationalUnit: {
      type: "OrganisationalUnit",
      group: "Organisations",
      parent: true,
      dependencyId: ({ lives, config }) => get("TargetId"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#listTargetsForPolicy-property
  getList: ({ client, config }) =>
    pipe([
      client.getListWithParent({
        parent: { type: "Policy", group: "Organisations" },
        config,
        pickKey: pick(["PolicyId"]),
        method: "listTargetsForPolicy",
        getParam: "Targets",
        decorate:
          ({ lives, parent: { PolicyId } }) =>
          (live) =>
            pipe([() => live, defaultsDeep({ PolicyId })])(),
      }),
    ]),
  create: {
    method: "attachPolicy",
    pickCreated: ({ payload }) => pipe([() => payload]),
    shouldRetryOnExceptionMessages: [
      "AWS Organizations can't complete your request because it conflicts with another attempt to modify the same entity",
    ],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#detachPolicy-property
  destroy: {
    method: "detachPolicy",
    pickId,
    shouldRetryOnExceptionMessages: [
      "AWS Organizations can't complete your request because it conflicts with another attempt to modify the same entity",
    ],
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties,
    dependencies: { policy, account, root, organisationalUnit },
  }) =>
    pipe([
      tap((params) => {
        assert(policy);
      }),
      () => ({
        PolicyId: getField(policy, "PolicyId"),
      }),
      switchCase([
        () => account,
        defaultsDeep({ TargetId: getField(account, "Id") }),
        () => root,
        defaultsDeep({ TargetId: getField(root, "Id") }),
        () => organisationalUnit,
        defaultsDeep({ TargetId: getField(organisationalUnit, "Id") }),
        () => {
          assert(false, "missing target");
        },
      ]),
    ])(),
});
