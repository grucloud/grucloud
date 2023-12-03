import assert from "assert";
import rubico from "rubico";
const { pipe, tap, get } = rubico;

import { runCommand } from "./RunCommand.js";

const RunStep =
  ({ ws, stream }) =>
  (step) =>
    pipe([
      tap(() => {
        assert(step);
        assert(stream);
      }),
      () => step,
      get("run"),
      runCommand({
        ws,
        workingDirectory: step.workingDirectory,
        stream,
      }),
      tap((result) => {
        assert(true);
      }),
    ])();

export default RunStep;
