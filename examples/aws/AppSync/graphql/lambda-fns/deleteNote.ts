const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function deleteNote(noteId: String) {
    const params = {
        TableName: process.env.NOTES_TABLE,
        Key: {
          id: noteId
        }
    }
    try {
        await docClient.delete(params).promise()
        return noteId
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}

export default deleteNote;