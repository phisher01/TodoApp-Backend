const AWS = require("aws-sdk");

// ⚠️ Replace with your actual credentials
const b2= new AWS.S3({
  endpoint: "s3.us-east-005.backblazeb2.com", // Change based on your region
  accessKeyId:  "005fabc1e6e87dc0000000001",
  secretAccessKey: "K005xXTbfHn6FhPE/WgnmYdWkTav3Pg",
  region: "us-west-004", // Choose the correct region
  signatureVersion: "v4",
});

const b2_Bucket = "samplemybucket"; // Replace with your actual bucket name

module.exports = { b2, b2_Bucket };
