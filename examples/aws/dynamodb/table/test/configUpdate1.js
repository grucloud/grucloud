module.exports = ({ stage }) => ({
  DynamoDB: {
    Table: {
      myTable: {
        name: "myTable",
        properties: {
          ProvisionedThroughput: {
            ReadCapacityUnits: 6,
            WriteCapacityUnits: 6,
          },
        },
      },
    },
  },
});
