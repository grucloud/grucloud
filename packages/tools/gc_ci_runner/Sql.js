import assert from "assert";
import rubico from "rubico";
const { pipe, tap } = rubico;

import postgres from "postgres";

const Sql = () => {
  assert(process.env.DB_URL);
  return postgres(process.env.DB_URL);
};

export default Sql;
