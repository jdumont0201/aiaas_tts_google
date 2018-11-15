//IMPORTS
const {Storage} = require('@google-cloud/storage');

//STORAGE SPACE
const projectId = 'prospect-222508';// Your Google Cloud Platform project ID
const storage = new Storage({  projectId: projectId,}); // Creates a client
const externalLinkBase="https://storage.cloud.google.com/"

module.exports={
    store:async function(filename,filePath,bucketName,f){
        const bucket=storage.bucket(bucketName);
        try{
        await bucket.upload(filePath, {
           gzip: true,            // Support for HTTP requests made with `Accept-Encoding: gzip`
            metadata: {
              cacheControl: 'public, max-age=31536000', // Enable long-lived HTTP caching headers
            },
          })

          //make public
          await storage  .bucket(bucketName)  .file(filename)  .makePublic();        ;
          
          f({success:true,path:externalLinkBase+bucketName+"/"+filename});
        } catch(err){
            f({success:false});
        }
    }
}
