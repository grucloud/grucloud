import assert from "assert";
import rubico from "rubico";
const { pipe, tap } = rubico;
import { describe, it } from "node:test";

import createSql from "../Sql.js";

describe("Sql", () => {
  it("connect", () =>
    pipe([
      createSql,
      (sql) =>
        pipe([
          () => sql`SELECT 1;`,
          tap(({ count }) => {
            assert(count);
          }),
          sql.close,
        ])(),
    ])());
});
