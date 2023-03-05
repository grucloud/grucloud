const assert = require("assert");
const { pipe, tap, assign } = require("rubico");
const Spinnies = require("spinnies");

const onDoneDefault = ({ uri, displayText, state, spinnies, spinnerMap }) => {
  assert(uri);
  assert(spinnies);
  assert(spinnerMap);
  assert(displayText);

  spinnies.remove(uri);
  spinnerMap.delete(uri);
};

const onErrorDefault = ({ uri, spinnerMap }) => {
  assert(uri);
  assert(spinnerMap);
  spinnerMap.delete(uri);
};

const onStateChange =
  ({ spinnies, spinnerMap }) =>
  ({ context, previousState, nextState, error = {}, indent }) => {
    assert(context, "onStateChange: missing context");

    const {
      uri,
      displayText,
      onDone = onDoneDefault,
      onError = onErrorDefault,
    } = context;

    assert(displayText, "onStateChange: missing context displayText");
    assert(uri, "onStateChange: missing context uri");

    if (process.env.CONTINUOUS_INTEGRATION) {
      return;
    }

    switch (nextState) {
      case "WAITING": {
        assert(!spinnies.pick(uri), `${uri} already created`);
        spinnerMap.set(uri, { state: context.state });
        spinnies.add(uri, {
          text: displayText(context.state),
          indent,
          color: "yellow",
        });
        break;
      }
      case "RUNNING": {
        const spinner = spinnerMap.get(uri);
        if (!spinner) {
          return;
        }
        const spinny = spinnies.pick(uri);
        assert(spinny, `spinnies create in running state: ${uri}`);
        spinnies.update(uri, {
          text: displayText(context.state),
          color: "blue",
          status: "spinning",
        });
        break;
      }
      case "DONE": {
        const spinny = spinnies.pick(uri);
        if (!spinny) {
          return;
        }
        const spinner = spinnerMap.get(uri);
        if (!spinner) {
          return;
        }
        onDone({
          uri,
          displayText,
          state: spinner.state,
          spinnerMap,
          spinnies,
        });
        break;
      }
      case "ERROR": {
        const spinny = spinnies.pick(uri);
        if (!spinny) {
          return;
        }
        //assert(error, `should have set the error, id: ${uri}`);
        const spinner = spinnerMap.get(uri);
        if (!spinner) {
          return;
        }

        const textWithError = `${displayText(spinner.state).padEnd(30, " ")} ${
          error.Message || ""
        } ${error.message || ""}`;

        spinnies.fail(uri, { text: textWithError });
        onError({
          uri,
          displayText,
          state: spinner.state,
          spinnerMap,
          spinnies,
        });
        break;
      }
      default:
        assert(false, `unknown state ${nextState}`);
    }
  };

exports.createSpinnies = pipe([
  () => ({
    spinnies: new Spinnies({
      spinner: {
        interval: 300,
        frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
      },
    }),
    spinnerMap: new Map(),
  }),
  assign({
    onStateChange,
  }),
]);
