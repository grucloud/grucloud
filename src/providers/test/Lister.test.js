const assert = require("assert");
const sinon = require("sinon");
const { Lister } = require("../Lister");

describe("Lister", function () {
  const executorOk = sinon
    .stub()
    .returns(Promise.resolve({ total: 0, items: [] }));

  const onStateChange = (stateChanges) => ({ type, nextState, ...other }) => {
    if (nextState === "RUNNING") {
      type && stateChanges.push(type);
    }
  };

  it("lister ok", async function () {
    const stateChanges = [];
    const inputs = [
      {
        providerName: "k8s",
        type: "Volume",
        executor: executorOk,
      },
      {
        providerName: "k8s",
        type: "VolumeClaim",
        executor: executorOk,
        dependsOn: ["Volume"],
      },
    ];
    const lister = Lister({
      inputs,
      onStateChange: onStateChange(stateChanges),
    });

    const { error, results } = await lister.run();
    assert(!error);
    assert(results);
  });
});
