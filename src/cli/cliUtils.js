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
    logger.debug(
      `onStateChange: ${tos({
        context,
        previousState,
        nextState,
        other,
      })}`
    );

    if (!context) {
      assert(false, "onStateChange: missing context");
    }
    const { uri, display } = context;

    if (!uri) {
      assert(false, "onStateChange: missing context uri");
    }
    const text = display || uri;

    switch (nextState) {
      case "WAITING": {
        logger.debug(`spinnies: create uri: ${uri}, text: ${text}`);
        spinnerList.push(uri);

        if (spinnies.pick(uri)) {
          assert(false, `${uri} already created`);
        }
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
        if (spinny) {
          if (spinner.status === "spinning") {
            assert(false, `${uri} already spinning`);
          }
          spinnies.update(uri, {
            text,
            color: runningColor,
            status: "spinning",
          });
        } else {
          assert(
            false,
            `spinnies create in running state: ${uri}, spinnerList: ${spinnerList.join(
              "\n"
            )}`
          );
        }
        break;
      }
      case "DONE": {
        const spinny = spinnies.pick(uri);
        if (spinny) {
          spinnies.succeed(uri);
          spinnerMap.delete(uri, spinny);
        } else {
          assert(false, `DONE event: ${uri} was not created`);
        }

        break;
      }
      case "ERROR": {
        const spinny = spinnies.pick(uri);
        if (spinny) {
          assert(error, `should have set the error, id: ${uri}`);
          const textWithError = `${text.padEnd(30, " ")} ${
            error.Message || ""
          } ${error.message || ""}`;
          logger.error(textWithError);
          spinnies.fail(uri, { text: textWithError });
          spinnerMap.delete(uri, spinny);
        } else {
          assert(false, `ERROR event: ${uri} was not created, error: ${error}`);
        }
        break;
      }
      default:
        assert(false, `unknown state ${nextState}`);
        break;
    }
  };

  try {
    const result = await command({ onStateChange });
    logger.debug(`runAsyncCommand end of : ${text}`);
    [...spinnerMap.keys()].forEach((uri) => {
      const spinny = spinnies.pick(uri);
      const msg = `spinners still running: ${uri} in status ${spinny.status}`;
      logger.error(msg);
      console.log(msg);
    });
    assert.equal(spinnerMap.size, 0, "spinner still active");
    spinnies.stopAll();
    return result;
  } catch (error) {
    spinnies.stopAll();
    logger.debug(`runAsyncCommand: error for command: ${text}`);
    logger.debug(error);

    throw error;
  }
};
