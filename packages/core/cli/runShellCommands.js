const assert = require("assert");
const shell = require("shelljs");
const { map, pipe, switchCase, tap, tryCatch } = require("rubico");
const logger = require("../logger")({ prefix: "ShellCommands" });

const { runAsyncCommand } = require("./cliUtils");

const buildContext = ({ command, index }) => ({
  uri: `${command}${index}`,
  displayText: () => command,
});

exports.runShellCommands =
  ({ text, ignoreError = () => false }) =>
  (commands) =>
    pipe([
      tap((params) => {
        assert(Array.isArray(commands));
      }),
      () => ({
        text,
        command: ({ onStateChange }) =>
          pipe([
            tap(() => {
              assert(onStateChange);
            }),
            () => commands,
            map.withIndex((command, index) =>
              pipe([
                tap(() =>
                  onStateChange({
                    context: buildContext({ command, index }),
                    nextState: "WAITING",
                  })
                ),
                tap(() =>
                  onStateChange({
                    context: buildContext({ command, index }),
                    nextState: "RUNNING",
                  })
                ),
                () =>
                  new Promise((resolve, reject) =>
                    shell.exec(
                      command,
                      {
                        silent: true,
                        async: true,
                      },
                      (code, stdout, stderr) =>
                        pipe([
                          switchCase([
                            () => code === 0,
                            pipe([
                              tap(() =>
                                onStateChange({
                                  context: buildContext({ command, index }),
                                  nextState: "DONE",
                                })
                              ),
                              () => ({ stdout }),
                              resolve,
                            ]),
                            pipe([
                              tap((params) => {
                                logger.error(stderr);
                              }),
                              switchCase([
                                ignoreError(stderr),
                                () => "DONE",
                                () => "ERROR",
                              ]),
                              tap((nextState) =>
                                onStateChange({
                                  context: buildContext({ command, index }),
                                  nextState,
                                })
                              ),
                              () => ({ stderr, error: true }),
                              resolve,
                            ]),
                          ]),
                        ])()
                    )
                  ),
              ])()
            ),
          ])(),
      }),
      runAsyncCommand,
    ])();
