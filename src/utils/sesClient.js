const { SESClient } = require("@aws-sdk/client-ses");
// Set the AWS Region.
const REGION = "us-east-1";
// Create SES service object.
const sesClient = new SESClient({ region: REGION, credentials: {
    accessKeyId: process.env.AWWS_SECRET_KEY,
    secretAccessKey: process.env.AWS_SECREDT_VALUE,
  }});
module.exports =  { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]