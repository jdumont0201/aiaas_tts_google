const express = require('express')
const app = express()
const task = require("./task");
const cors=require("cors")
const storage=require("./storage")
const notify=require("./notification")
var path = require('path');
var bodyParser = require('body-parser')
app.use(cors())
app.use( bodyParser.json() );       // to support JSON-encoded bodies
//app.use(bodyParser.urlencoded({  extended: true}));     // to support URL-encoded bodies
app.use(express.json());       // to support JSON-encoded bodies
//app.use(express.urlencoded()); // to support URL-encoded bodies
app.use((err, request, response, next) => {
  console.log(err)
  response.status(500).json({error:err})
})

///////////////////////////////////////////////////////////////
//  PARAMS
///////////////////////////////////////////////////////////////
const port =3012
const version="1.3.3" 
const name="Text-to-Speech / Google Cloud"
const tmp=path.join(__dirname, "/data/");
const bucketName = 'aiaas_texttospeech';

///////////////////////////////////////////////////////////////
//  PING
///////////////////////////////////////////////////////////////
app.get('/', (req, res) => {
  res.json({status:"live",version:version,name:name})
});

///////////////////////////////////////////////////////////////
//  TASK
///////////////////////////////////////////////////////////////
app.post('/run', (req, res) => {
  var outputName=req.body.output+".mp3" || "output.mp3";
  var outputPath=tmp+outputName;
  var text=req.body.text;
  var token=req.body.token;
  var service=req.body.service;
  
  var download=req.body.download=="true";
  console.log("REQ /run",req.body,req.query,outputPath)
  notify.notify(token,service)
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
app.get('/run', (req, res) => {
  var outputName=req.query.output+".mp3" || "output.mp3";
  var outputPath=tmp+outputName;
  var text=req.query.text;
  var download=req.query.download=="true";
  console.log("REQ /run",req.body,req.query,outputPath)
  task.task(text,outputName,outputPath, function(result){
    if(result.success){
        res.contentType("Content-Type: audio/mpeg")
        res.download(outputPath)
    }else{
      res.status(500).json(result)
    }
  })
})

app.listen(port, () => console.log("NAME:"+ name+"/nVERSION:"+version+"STATUS:\nApp listening on port "+port))