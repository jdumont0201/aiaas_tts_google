const server = require("@aheadai/unit/server/server")
const storage=require("@aheadai/unit/storage/storage")
const task=require("./task")

const path=require("path")

///////////////////////////////////////////////////////////////
//  PARAMS
///////////////////////////////////////////////////////////////
const port = 3012
const version = "1.3.4"
const name = "Text-to-Speech / Google Cloud"
const tmp = path.join(__dirname, "/data/");
const bucketName = 'aiaas_texttospeech';

let serv=server.getNewServer(name,version);


///////////////////////////////////////////////////////////////
//  TASK
///////////////////////////////////////////////////////////////
let f=async (req, res) => {

  var options = {
    task: {
      text: req.body.text,
      outputName: req.body.output + ".mp3" || "output.mp3",
      outputPath: tmp + req.body.output + ".mp3" || "output.mp3",
      text: req.body.text,
      format: 'MP3'
    },
    download: req.query.download == "true",
  
    store: {
      outputName: req.body.output + ".mp3" || "output.mp3",
      outputPath: tmp + req.body.output + ".mp3" || "output.mp3",
      bucketName: bucketName
    }
  }



  //RUN TASK
  try {
    let result = await task.runTask(options.task);
  } catch (err) {
    res.status(500).json(err)
  }


  //UPLOAD RESULT
  try {
    let result2 = await storage.storeFileInUserBucket(options.store);
    if (result2.success)
      res.json({ success: true, status: "Uploaded", path: result2.path })
    else
      res.status(500).json({ success: false, code: "UPLOAD_ERROR" })
  } catch (err) {
    res.status(500).json(err)
  }
}

server.addTask(serv,f);


server.startServer(serv);
