const express = require('express')
const app = express()
const task = require("./task");
const storage=require("./storage")
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({  extended: true}));     // to support URL-encoded bodies
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use((err, request, response, next) => {
  console.log(err)
  response.status(500).send('Error 500')
})

///////////////////////////////////////////////////////////////
//  PARAMS
///////////////////////////////////////////////////////////////
const port =3001
const tmp="/tmp/ai/"
const bucketName = 'aiaas_texttospeech';

///////////////////////////////////////////////////////////////
//  TASK
///////////////////////////////////////////////////////////////
app.post('/run', (req, res) => {
  var outputName=req.body.output+".mp3" || "output.mp3";
  var outputPath=tmp+outputName;
  var text=req.body.text;
  var download=req.body.download=="true";
  task.task(text,outputName,outputPath, function(result){
    if(result.success){
      if(download){
        res.contentType("Content-Type: audio/mpeg")
        res.download(outputPath)
      } else{
        
        let store= storage.store(outputName,outputPath,bucketName,function(result2){
          if(result2.success)
          res.json({success:true,status:"Uploaded",path:result2.path})
          else
            res.status(500).json({success:false,code:"UPLOAD_ERROR"})
        });
        
      }
        
      
    }else{
      res.status(500).json(result)
    }
  })
})


app.listen(port, () => console.log(`Listening on port ${port}`))