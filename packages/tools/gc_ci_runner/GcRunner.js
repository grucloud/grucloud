import assert from "assert";
import rubico from "rubico";
const { pipe, tap, get, map, tryCatch } = rubico;

import createSql from "./Sql.js";
import createRunStep from "./RunStep.js";

const sql = createSql();

const sqlConnect = () => sql`SELECT 1;`;

const GcRunner = ({ flow, Bucket, Key }) =>
  pipe([
    tap((params) => {
      assert(flow);
      assert(Bucket);
    }),
    sqlConnect,
    tap((params) => {
      assert(params.count);
    }),
    () => flow,
    get("steps"),
    tap((params) => {
      assert(true);
    }),
    tryCatch(
      //
      map.series(createRunStep({ sql, Bucket, Key })),
      (error) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          () => ({ error }),
        ])()
    ),
    tap((params) => {
      assert(true);
    }),
    tap(sql.close),
  ])();

export default GcRunner;
