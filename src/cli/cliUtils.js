const Spinnies = require("spinnies");
const assert = require("assert");
const logger = require("../logger")({ prefix: "CliUtils" });
const { tos } = require("../tos");

const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

const spinner = { interval: 300, frames };

exports.runAsyncCommand = async (command, text) => {
  console.log(`${text}`);
  const spinnies = new Spinnies({ spinner });

  const onStateChange = ({ uri, previousState, nextState, error }) => {
    logger.debug(
      `onStateChange: ${tos({
        uri,
        previousState,
        nextState,
      })}`
    );
    assert(uri, "onStateChange: missing uri");

    switch (nextState) {
      case "WAITING": {
        logger.debug(`spinnies: create: ${uri}`);
        spinnies.add(uri, { text: uri /*, status: "non-spinnable" */ });
        break;
      }
      case "RUNNING": {
        logger.debug(`spinnies running: ${uri}`);
        const spinny = spinnies.pick(uri);
        if (spinny) {
          spinnies.update(uri, { text: `${uri}`, status: "spinning" });
        } else {
          //TODO assert ?
          logger.error(`spinnies not created: ${uri}`);
          spinnies.add(uri, { text: uri });
        }
        break;
      }
      case "DONE": {
        spinnies.succeed(uri);
        break;
      }
      case "ERROR": {
        //TODO build error.ToString()
        const text = `${uri}: ${error?.name} ${error.message || ""}`;
        logger.debug(`spinnies: failed: ${uri}: ${text}`);
        spinnies.fail(uri, { text });
        break;
      }
      default:
        assert(false, `unknown state ${nextState}`);
        break;
    }
  };

  try {
    const result = await command({ onStateChange });
    return result;
  } catch (error) {
    spinnies.stopAll();
    throw error;
  }
};
