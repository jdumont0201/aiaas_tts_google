//IMPORTS
const fs = require('fs');
const textToSpeech = require('@google-cloud/text-to-speech');

//CONSTANTS
const client = new textToSpeech.TextToSpeechClient();// Creates a client

module.exports = {// The text to synthesize
  runTask: async function (options) {
    //READ OPTIONS
    let text = options.text;
    let outputName = options.outputName;
    let outputPath = options.outputPath;
    let format = options.format;

    console.log("TASK", options)


    const request = {
      input: { text: text },
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: format },
    };
    return new Promise((resolve, reject) => {

      return client.synthesizeSpeech(request, async (err, response) => {// Performs the Text-to-Speech request
        if (err) {
          return reject({ success: false, error: err, code: "SYNTHESIZE", output: outputName })
        }

        fs.writeFile(outputPath, response.audioContent, 'binary', err => {// Write the binary audio content to a local file
          if (err) {
            return reject({ success: false, error: err, code: "WRITE_FILE_ERROR", output: outputName })
          } else {
            return resolve({ success: true, output: outputName })
          }
        });
      });
    })
  }
}