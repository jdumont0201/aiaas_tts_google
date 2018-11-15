const {Storage} = require('@google-cloud/storage');

// Your Google Cloud Platform project ID
const projectId = 'prospect-222508';

// Creates a client
const storage = new Storage({
  projectId: projectId,
});

// The name for the new bucket

const externalLinkBase="https://storage.cloud.google.com/"

module.exports={
    store:async function(filename,filePath,bucketName,f){
        
        const bucket=storage.bucket(bucketName);

        console.log("STORAGE",filePath)
        try{
        await bucket.upload(filePath, {
            // Support for HTTP requests made with `Accept-Encoding: gzip`
            gzip: true,
            metadata: {
              // Enable long-lived HTTP caching headers
              // Use only if the contents of the file will never change
              // (If the contents will change, use cacheControl: 'no-cache')
              cacheControl: 'public, max-age=31536000',
            },
          })

          await storage
  .bucket(bucketName)
  .file(filename)
  .makePublic();

        ;
          
          console.log("STORED",bucketName+"/"+filename)
          f({success:true,path:externalLinkBase+bucketName+"/"+filename});
        }catch(err){
            console.error("ERR STORAGE",err)
            f({success:false});
        }
    }
}
