import assert from "assert";
import rubico from "rubico";
const { pipe, tap, get } = rubico;
import { runCommand } from "./RunCommand.js";

const RunStep =
  ({ sql, ws }) =>
  (step) =>
    pipe([
      () => step,
      tap(() => {
        assert(sql);
        assert(step);
      }),
      get("run"),
      runCommand({ sql, ws, workingDirectory: step.workingDirectory }),
      tap((result) => {
        assert(true);
      }),
    ])();

export default RunStep;
