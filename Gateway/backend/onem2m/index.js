var request = require('request');
const gValue = require('../globalv');
require('date-utils');

var requestNr = 0;

function createAE(name) {
  console.log("createAE()");
  conf = gValue.getOneM2MInfo();
  var options = {
    uri: conf.cse_URL + "/" + conf.cse.name,
    method: "POST",
    headers: {
      "X-M2M-Origin": "S" + name,
      "X-M2M-RI": "req" + requestNr,
      "Content-Type": "application/vnd.onem2m-res+json;ty=2"
    },
    json: {
      "m2m:ae": {
        "rn": name,
        "api": conf.api,
        "rr": false
      }
    }
  };

  var rr = "false";
  var poa = "";
  // console.log("##############");
  // console.log(templates);
  // console.log(templates[typeIndex]);
  // if(templates[typeIndex].stream=="down"){
  // 	options.json["m2m:ae"]["rr"] = true;
  // 	options.json["m2m:ae"] = Object.assign(options.json["m2m:ae"], {"poa":["http://" + config.app.ip + ":" + config.app.port + "/" + name]});
  // 	listen(name,typeIndex)
  // }

  console.log(options.method + " " + options.uri);
  console.log(options.json);

  if (conf.cseRelease != "1") {
    options.headers = Object.assign(options.headers, { "X-M2M-RVI": conf.cseRelease });
    options.json["m2m:ae"] = Object.assign(options.json["m2m:ae"], { "srv": ["2a"] });
  }

  requestNr += 1;
  request(options, function (err, resp, body) {
    if (err) {
      console.log("createAE() : " + err);
    } else {
      console.log("createAE() :" + resp.statusCode);
      if (resp.statusCode == 409) {
        console.log("createAE() [RESPONSE] - failure");
        resetAE(name);
      } else {
        console.log("createAE() [RESPONSE] - success:" + resp.statusCode);
        if (conf.acp_required) {
          console.log("createAccessControlPolicy()")
          //createAccessControlPolicy(name);
        } else {
          createDataContainer(name);
        }
      }
    }
  });
}

function resetAE(name) {
  console.log("resetAE()");
  conf = gValue.getOneM2MInfo();
  var options = {
    uri: conf.cse_URL + "/" + conf.cse_name + "/" + name,
    method: "DELETE",
    headers: {
      "X-M2M-Origin": "S" + name,
      "X-M2M-RI": "req" + requestNr,
    }
  };
  console.log(options);

  if (conf.cseRelease != "1") {
    options.headers = Object.assign(options.headers, { "X-M2M-RVI": conf.cseRelease });
  }

  requestNr += 1;
  request(options, function (error, response, body) {
    if (error) {
      console.log("resetAE() [RESPONSE] - failure");
      console.log(error);
    } else {
      console.log("resetAE() [RESPONSE] - success");
      console.log(response.statusCode);
      console.log(body);
      createAE(name);
    }
  });
}

function createDataContainer(name) {
  console.log("createDataContainer()");
  conf = gValue.getOneM2MInfo();
  var options = {
    uri: conf.cse_URL + "/" + conf.cse_name + "/" + name,
    method: "POST",
    headers: {
      "X-M2M-Origin": "S" + name,
      "X-M2M-RI": "req" + requestNr,
      "Content-Type": "application/json;ty=3"
    },
    json: {
      "m2m:cnt": {
        "rn": "DATA",
        "mni": 10000
      }
    }
  };

  options.json["m2m:cnt"] = Object.assign(options.json["m2m:cnt"], {});

  console.log(options.method + " " + options.uri);
  console.log(options.json);

  if (conf.cseRelease != "1") {
    options.headers = Object.assign(options.headers, { "X-M2M-RVI": conf.cseRelease });
  }

  requestNr += 1;
  request(options, function (error, response, body) {
    if (error) {
      console.log("createDataContainer() [RESPONSE] - failure", error);
      conf.ctnPrepared = false;
    } else {
      console.log("createDataContainer() [RESPONSE] - success", response.statusCode);
      console.log(body);
      conf.ctnPrepared = true;
      // createContentInstance(name,typeIndex,fire);

      // if(templates[typeIndex].stream=="up"){
      // 	var fire = setInterval(function() {
      // 		createContentInstance(name,typeIndex,fire);
      // 	}, templates[typeIndex].freq*1000);
      // } else if(templates[typeIndex].stream=="down"){
      // 	createCommandContainer(name,typeIndex);	
      // }

    }
  });
}

function createContentInstance(name, data) {
  console.log("createContentInstance()");
  conf = gValue.getOneM2MInfo();
  var options = {
    uri: conf.cse_URL + "/" + conf.cse_name + "/" + name + "/DATA",
    method: "POST",
    headers: {
      "X-M2M-Origin": "S" + name,
      "X-M2M-RI": "req" + requestNr,
      "Content-Type": "application/json;ty=4"
    },
    json: {
      "m2m:cin": {
        "con": data
      }
    }
  };

  console.log(options.method + " " + options.uri);
  console.log(options.json);

  if (conf.cseRelease != "1") {
    options.headers = Object.assign(options.headers, { "X-M2M-RVI": conf.cseRelease });
  }

  requestNr += 1;
  request(options, function (error, response, body) {
    if (error) {
      console.log("createContentInstance() - failure", error);
    } else {
      console.log("createContentInstance() - success", response.statusCode);
      console.log(body);
    }
  });
}