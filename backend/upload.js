import s3 from './s3.js';


import fs from 'fs';

async function uploadFile(filePath, bucketName, key) {
  const fileContent = fs.readFileSync(filePath);

  const params = { Bucket: bucketName, Key: key, Body: fileContent };

  try {
    const data = await s3.upload(params).promise();
    console.log(`✅ File uploaded successfully: ${data.Location}`);
  } catch (err) {
    console.error('❌ Error uploading file:', err);
  }
}

export default uploadFile;

