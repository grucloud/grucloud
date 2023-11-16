import assert from "assert";
import rubico from "rubico";
const { pipe, tap, get } = rubico;

import { runCommand } from "./RunCommand.js";

const RunStep =
  ({ sql, ws, stream }) =>
  (step) =>
    pipe([
      tap(() => {
        assert(sql);
        assert(step);
        assert(stream);
      }),
      () => step,
      get("run"),
      runCommand({
        sql,
        ws,
        workingDirectory: step.workingDirectory,
        stream,
      }),
      tap((result) => {
        assert(true);
      }),
    ])();

export default RunStep;
