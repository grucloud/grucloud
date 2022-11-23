const assert = require("assert");
const { pipe, eq, get, tap, map, or } = require("rubico");
const { defaultsDeep, callProp, last, identity } = require("rubico/x");

const group = "DocumentDB";

const SqlResourceSqlRoleDefinitionManagedByOther = () =>
  eq(get("properties.type"), "BuiltInRole");

exports.fnSpecs = ({ config }) =>
  pipe([
    () => [
      {
        type: "SqlResourceSqlRoleDefinition",
        cannotBeDeleted: SqlResourceSqlRoleDefinitionManagedByOther,
        managedByOther: SqlResourceSqlRoleDefinitionManagedByOther,
      },
      //TODO not working with the defaults
      { type: "SqlResourceSqlContainer", propertiesDefaultArray: [] },
    ],
    map(defaultsDeep({ group })),
  ])();
