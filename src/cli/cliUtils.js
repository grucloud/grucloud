const Spinnies = require("spinnies");
const assert = require("assert");
const logger = require("../logger")({ prefix: "CliUtils" });
const { tos } = require("../tos");

const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

const spinner = { interval: 300, frames };

exports.runAsyncCommand = async (command, commandText) => {
  console.log(`${commandText}`);
  assert(command);
  const spinnies = new Spinnies({ spinner });
  logger.debug(`runAsyncCommand: ${JSON.stringify({ commandText })}`);
  const spinnerList = [];
  const onStateChange = ({
    uri,
    display,
    previousState,
    nextState,
    error,
    indent,
    ...other
  }) => {
    logger.debug(
      `onStateChange: ${tos({
        uri,
        previousState,
        nextState,
        other,
      })}`
    );

    if (!uri) {
      assert(!uri, "onStateChange: missing uri");
    }
    const text = display || uri;

    switch (nextState) {
      case "WAITING": {
        logger.debug(`spinnies: create: ${uri}`);
        spinnerList.push(uri);
        const spinny = spinnies.pick(uri);
        if (spinny) {
          assert(false, `${uri} already created`);
        }
        spinnies.add(uri, {
          text,
          indent,
          color: "yellow",
        });
        break;
      }
      case "RUNNING": {
        logger.debug(`spinnies running: ${uri}`);
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
          /*
          assert(
            false,
            `spinnies create in running state: ${uri}, spinnerList: ${spinnerList.join(
              "\n"
            )}`
          );*/
          spinnies.add(uri, { text, color: runningColor, indent });
        }
        break;
      }
      case "DONE": {
        const spinny = spinnies.pick(uri);
        if (spinny) {
          spinnies.succeed(uri);
        } else {
          assert(false, `DONE event: ${uri} was not created`);
        }

        break;
      }
      case "ERROR": {
        //TODO build error.ToString()

        const spinny = spinnies.pick(uri);
        if (spinny) {
          assert(error, `should have set the error, id: ${uri}`);
          const text = `${uri}: ${error?.name || ""} ${error.message || ""}`;
          logger.debug(`spinnies: failed: ${uri}: ${text}`);
          spinnies.fail(uri, { text });
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
    logger.debug(`runAsyncCommand end of : ${commandText}`);
    spinnies.stopAll();
    return result;
  } catch (error) {
    spinnies.stopAll();
    logger.debug(`runAsyncCommand: error for command: ${commandText}`);
    logger.debug(error);

    throw error;
  }
};
