const fs = require('fs');

// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

// Creates a client
const client = new textToSpeech.TextToSpeechClient();

module.exports = 
{// The text to synthesize

 task:function(text,outputName,outputPath,f){
   console.log("TASK",text,outputName)
// Construct the request
const request = {
  input: {text: text},
  // Select the language and SSML Voice Gender (optional)
  voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
  // Select the type of audio encoding
  audioConfig: {audioEncoding: 'MP3'},
};

// Performs the Text-to-Speech request
client.synthesizeSpeech(request, (err, response) => {
  if (err) {
    console.error('ERROR:', err);
    f({success:false,error:err,code:"SYNTHESIZE",output:outputName})
    return;
  }
console.log("WRITE",outputPath)
  // Write the binary audio content to a local file
  fs.writeFile(outputPath, response.audioContent, 'binary', err => {
    if (err) {
      f({success:false,error:err,code:"WRITE_FILE",output:outputName})
      return;
    }else{
      f({success:true,output:outputName})
    }
    
  });
});
}
}