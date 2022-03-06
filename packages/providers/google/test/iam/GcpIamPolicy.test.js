const assert = require("assert");
const { GoogleProvider } = require("../../GoogleProvider");
const { pipe, tap, map, get, filter } = require("rubico");
const { find, isDeepEqual } = require("rubico/x");
const chance = require("chance")();
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

describe.skip("GcpIamPolicy", async function () {
  let config;
  let provider;
  let iamPolicy;
  let serviceAccount;
  const types = ["Policy", "ServiceAccount"];

  const bindingEditor = {
    role: "roles/editor",
    members: ["serviceAccount:grucloud@grucloud-test.iam.gserviceaccount.com"],
  };
  before(async function () {
    provider = GoogleProvider({
      config: () => ({
        projectId: "grucloud-test",
      }),
    });

    const saName = `sa-${chance.guid().slice(0, 15)}`;
    serviceAccount = provider.iam.makeServiceAccount({
      name: saName,
      properties: () => ({
        accountId: saName,
        serviceAccount: {
          displayName: saName,
        },
      }),
    });
    iamPolicy = provider.iam.makePolicy({
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

    await provider.start();
  });
  after(async () => {});

  it.skip("plan", async function () {
    const plan = provider.planQuery();
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

    await testPlanDestroy({ provider, types });
  });
});
