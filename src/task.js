//IMPORTS
const fs = require('fs');
const textToSpeech = require('@google-cloud/text-to-speech');

//CONSTANTS
const client = new textToSpeech.TextToSpeechClient();// Creates a client

module.exports = {// The text to synthesize
 task:function(text,outputName,outputPath,f){
   console.log("TASK",text,outputName)

  const request = {
    input: {text: text},
    voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},  
    audioConfig: {audioEncoding: 'MP3'},
  };


  client.synthesizeSpeech(request, (err, response) => {// Performs the Text-to-Speech request
    if (err) {
      console.error('ERROR:', err);
      f({success:false,error:err,code:"SYNTHESIZE",output:outputName})
      return;
    }
    console.log("WRITE",outputPath)
    fs.writeFile(outputPath, response.audioContent, 'binary', err => {// Write the binary audio content to a local file
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