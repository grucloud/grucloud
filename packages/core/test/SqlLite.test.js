const assert = require("assert");
const { pipe, tap, map, eq, get } = require("rubico");
const { size, pluck, flatten } = require("rubico/x");
const logger = require("../logger")({ prefix: "GraphLive" });
//const gcList = require("./fixture/gc-list.json");
const initSqlJs = require("sql.js");

describe.skip("sql lite", function () {
  it("workflow", async function () {
    assert(true);

    const SQL = await initSqlJs({
      // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
      // You can omit locateFile completely when running in node
      //locateFile: file => `https://sql.js.org/dist/${file}`
    });

    // Create a database
    const db = new SQL.Database();

    let sqlstr = "CREATE TABLE hello (a int, b char);";
    sqlstr += "INSERT INTO hello VALUES (0, 'hello');";
    sqlstr += "INSERT INTO hello VALUES (1, 'world');";
    db.run(sqlstr); // Run the query without returning anything

    const res = db.exec("SELECT * FROM hello");

    const stmt = db.prepare("SELECT * FROM hello WHERE a=:aval AND b=:bval");

    // Bind values to the parameters and fetch the results of the query
    const result = stmt.getAsObject({ ":aval": 1, ":bval": "world" });
    console.log(result); // Will print {a:1, b:'world'}

    assert(false);
  });
});
