const assert = require("assert");
const { GoogleProvider } = require("../../GoogleProvider");
const { ConfigLoader } = require("ConfigLoader");
const { pipe, tap, map, get, filter } = require("rubico");
const { find, isDeepEqual } = require("rubico/x");
const chance = require("chance")();
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("../../../../test/E2ETestUtils");

describe.skip("GcpIamPolicy", async function () {
  let config;
  let provider;
  let iamPolicy;
  let serviceAccount;
  const types = ["IamPolicy", "ServiceAccount"];

  const bindingEditor = {
    role: "roles/editor",
    members: ["serviceAccount:grucloud@grucloud-e2e.iam.gserviceaccount.com"],
  };
  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/multi" });
    } catch (error) {
      this.skip();
    }

    provider = GoogleProvider({
      config: config.google,
    });
    await provider.start();

    const saName = `sa-${chance.guid().slice(0, 15)}`;
    serviceAccount = await provider.makeServiceAccount({
      name: saName,
      properties: () => ({
        accountId: saName,
        serviceAccount: {
          displayName: saName,
        },
      }),
    });
    iamPolicy = await provider.makeIamPolicy({
      name: "iam-policy",
      dependencies: { serviceAccount },
      properties: ({ dependencies: { serviceAccount } }) => ({
        policy: {
          bindings: [
            {
              role: "roles/editor",
              members: [`serviceAccount:${serviceAccount.live?.email}`],
            },
          ],
        },
      }),
    });
  });
  after(async () => {});
  it.skip("iamPolicy config", async function () {
    const iamPolicyLive = await iamPolicy.getLive();
    const target = await iamPolicy.resolveConfig({ live: iamPolicyLive });
    assert(
      find((binding) => binding.role === "roles/owner")(target.policy.bindings)
    );
    assert(target.policy.etag);
  });

  it.skip("plan", async function () {
    const plan = await provider.planQuery();
    assert.equal(plan.resultDestroy.length, 0);
    assert.equal(plan.resultCreate.length, 2);
    const planUpdate = plan.resultCreate[1];
    assert.equal(planUpdate.action, "UPDATE");
    assert(planUpdate.config);
    assert(planUpdate.config.policy.etag);
    assert(planUpdate.config.policy.bindings);

    assert(planUpdate.live);
    assert(planUpdate.live.etag);
  });
  it("iamPolicy apply and destroy", async function () {
    await testPlanDeploy({ provider, types });

    const live = await iamPolicy.getLive();

    assert(
      find((binding) => isDeepEqual(binding, bindingEditor))(live.bindings)
    );

    const target = await iamPolicy.resolveConfig({ live: iamPolicyLive });
    assert(
      find((binding) => binding.role === "roles/owner")(target.policy.bindings)
    );
    assert(target.policy.etag);

    await testPlanDestroy({ provider, types });
  });
});
