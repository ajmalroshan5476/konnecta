import s3 from './s3.js';
import fs from 'fs';

async function uploadFile(filePath, bucketName, key) {
  const fileContent = fs.readFileSync(filePath);

  const params = { 
    Bucket: bucketName, 
    Key: key, 
    Body: fileContent 
  };

  try {
    // Upload file (private by default)
    await s3.upload(params).promise();

    // Generate a pre-signed URL
    const url = s3.getSignedUrl('getObject', {
      Bucket: bucketName,
      Key: key,
      Expires: 60 * 60 // 1 hour
    });

    console.log(`✅ File uploaded successfully`);
    console.log(`🔑 Signed URL: ${url}`);

    return url; // return to frontend
  } catch (err) {
    console.error('❌ Error uploading file:', err);
  }
}

export default uploadFile;


