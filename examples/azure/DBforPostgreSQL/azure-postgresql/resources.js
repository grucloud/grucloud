// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Configuration",
    group: "DBforPostgreSQL",
    properties: ({}) => ({
      name: "shared_preload_libraries",
      properties: {
        value: "pg_cron,pg_stat_statements",
        source: "user-override",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-postgres",
      server: "rg-postgres::gc-server",
    }),
  },
  {
    type: "FirewallRule",
    group: "DBforPostgreSQL",
    properties: ({}) => ({
      name: "allowallazureservicesandresourceswithinazureips_2022-1-19_17-30-21",
      properties: {
        startIpAddress: "0.0.0.0",
        endIpAddress: "0.0.0.0",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-postgres",
      server: "rg-postgres::gc-server",
    }),
  },
  {
    type: "FlexibleServer",
    group: "DBforPostgreSQL",
    properties: ({}) => ({
      name: "gc-server",
      location: "UK South",
      sku: {
        name: "Standard_B1ms",
        tier: "Burstable",
      },
      properties: {
        administratorLogin: "GcAdmin",
        version: "13",
        storage: {
          storageSizeGB: 32,
        },
        administratorLoginPassword:
          process.env.RG_POSTGRES_GC_SERVER_ADMINISTRATOR_LOGIN_PASSWORD,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-postgres",
    }),
  },
  {
    type: "ResourceGroup",
    group: "Resources",
    properties: ({}) => ({
      name: "rg-postgres",
    }),
  },
];
