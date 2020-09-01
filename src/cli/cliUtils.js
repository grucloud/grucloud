const Spinnies = require("spinnies");
const assert = require("assert");
const logger = require("../logger")({ prefix: "CliUtils" });
const { tos } = require("../tos");

const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

const spinner = { interval: 300, frames };

exports.runAsyncCommand = async ({ text, command }) => {
  console.log(`${text}`);
  assert(text);
  assert(command);
  const spinnies = new Spinnies({ spinner });
  logger.debug(`runAsyncCommand: ${JSON.stringify({ text })}`);
  const spinnerList = [];
  const spinnerMap = new Map();

  const onStateChange = ({
    context,
    previousState,
    nextState,
    error = {},
    indent,
    ...other
  }) => {
    logger.info(
      `onStateChange: ${tos({
        context,
        previousState,
        nextState,
        other,
      })}`
    );
    assert(context, "onStateChange: missing context");
    const { uri, display } = context;

    assert(uri, "onStateChange: missing context uri");

    const text = display || uri;

    if (process.env.CONTINUOUS_INTEGRATION) {
      return;
    }
    switch (nextState) {
      case "WAITING": {
        logger.debug(`spinnies: create uri: ${uri}, text: ${text}`);
        spinnerList.push(uri);
        assert(!spinnies.pick(uri), `${uri} already created`);
        const spinny = {
          text,
          indent,
          color: "yellow",
        };
        spinnerMap.set(uri, spinny);
        spinnies.add(uri, spinny);
        break;
      }
      case "RUNNING": {
        logger.debug(`spinnies running uri: ${uri}, text: ${text}`);
        const spinny = spinnies.pick(uri);
        const runningColor = "greenBright";

        assert(
          spinny,
          `spinnies create in running state: ${uri}, spinnerList: ${spinnerList.join(
            "\n"
          )}`
        );
        assert(spinner.status !== "spinning", `${uri} already spinning`);

        spinnies.update(uri, {
          text,
          color: runningColor,
          status: "spinning",
        });
        break;
      }
      case "DONE": {
        const spinny = spinnies.pick(uri);
        assert(spinny, `DONE event: ${uri} was not created`);
        spinnies.succeed(uri);
        spinnerMap.delete(uri, spinny);
        break;
      }
      case "ERROR": {
        const spinny = spinnies.pick(uri);
        assert(spinny, `ERROR event: ${uri} was not created, error: ${error}`);
        assert(error, `should have set the error, id: ${uri}`);
        const textWithError = `${text.padEnd(30, " ")} ${error.Message || ""} ${
          error.message || ""
        }`;
        logger.error(textWithError);
        spinnies.fail(uri, { text: textWithError });
        spinnerMap.delete(uri, spinny);
        break;
      }
      default:
        assert(false, `unknown state ${nextState}`);
    }
  };

  try {
    const result = await command({ onStateChange });
    logger.debug(`runAsyncCommand end of : ${text}`);
    [...spinnerMap.keys()].forEach((uri) => {
      const spinny = spinnies.pick(uri);
      const msg = `spinners still running: ${uri} in status ${spinny.status}`;
      logger.error(msg);
      // console.log(msg);
    });
    //assert.equal(spinnerMap.size, 0, "spinner still active");
    spinnies.stopAll();
    return result;
  } catch (error) {
    spinnies.stopAll();
    logger.debug(`runAsyncCommand: error for command: ${text}`);
    logger.debug(error);

    throw error;
  }
};
