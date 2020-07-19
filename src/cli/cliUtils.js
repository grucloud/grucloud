const Spinnies = require("spinnies");
const assert = require("assert");
const logger = require("../logger")({ prefix: "CliUtils" });
const { tos } = require("../tos");

const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

const spinner = { interval: 300, frames };

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
      case "WAITING": {
        const key = resourceToKey(resource);
        assert(key);
        logger.debug(`spinnies: create: ${key}`);
        spinnies.add(key, { text: key /*, status: "non-spinnable" */ });
        break;
      }
      case "RUNNING": {
        const key = resourceToKey(resource);
        assert(key);
        logger.debug(`spinnies running: ${key}`);
        const spinny = spinnies.pick(key);
        if (spinny) {
          spinnies.update(key, { text: `${key}`, status: "spinning" });
        } else {
          //TODO assert ?
          logger.error(`spinnies not created: ${key}`);
          spinnies.add(key, { text: key });
        }
        break;
      }
      case "DONE": {
        const key = resourceToKey(resource);
        spinnies.succeed(key);
        break;
      }
      case "ERROR": {
        const key = resourceToKey(resource);
        //TODO build error.ToString()
        const text = `${key}: ${error?.name} ${error.message || ""}`;
        logger.debug(`spinnies: failed: ${key}: ${text}`);
        spinnies.fail(key, { text });
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
