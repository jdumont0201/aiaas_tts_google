const request = require('request');

const baseUrl="http://localhost:4200/"
module.exports={
  notify:function(token,serviceId){
    
    let data={serviceId:serviceId}
    let url=baseUrl+"users/"+token+'/jobs/';


var options = {
  uri: url,
  method: 'POST',
  json: data
};

request(options, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body.id) // Print the shortened url.
    

  }
});

  }
}