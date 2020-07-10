const Spinnies = require("spinnies");
const assert = require("assert");
const logger = require("../logger")({ prefix: "CliUtils" });
const { tos } = require("../tos");

const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const spinner = { interval: 200, frames };

exports.runAsyncCommand = async (command, text) => {
  console.log(`${text}`);
  const spinnies = new Spinnies({ spinner });

  const resourceToKey = (resource) => {
    //assert(resource.name);
    assert(resource.type);
    assert(resource.provider);
    return `${resource.provider}::${resource.type}::${resource.name}`;
  };

  const onStateChange = ({ resource, previousState, nextState, error }) => {
    logger.debug(
      `onStateChange: ${tos({
        resource,
        previousState,
        nextState,
      })}`
    );
    switch (nextState) {
      case "RUNNING": {
        const key = resourceToKey(resource);
        assert(key);
        spinnies.add(key, { text: key });
        break;
      }
      case "DONE": {
        const key = resourceToKey(resource);
        spinnies.succeed(key);
        break;
      }
      case "ERROR": {
        const key = resourceToKey(resource);
        spinnies.fail(key, { text: `${key}: ${error.message}` });
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
