const Spinnies = require("spinnies");
const assert = require("assert");
const logger = require("../logger")({ prefix: "CliUtils" });
const { tos } = require("../tos");

const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const spinner = { interval: 200, frames };

exports.runAsyncCommand = async (command, text) => {
  console.log(`${text}`);
  const spinnies = new Spinnies({ spinner });

  const resourceToKey = (resource) => `${resource.name}`;

  const onStateChange = ({ resource, previousState, nextState }) => {
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
        const keys = resourceToKey(resource);
        spinnies.succeed(keys);
        break;
      }
      default:
        break;
    }
  };

  try {
    const result = await command({ onStateChange });
    return result;
  } catch (error) {
    throw error;
  }
};
