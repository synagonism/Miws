/**
 * DOING: sftp the-files in sftp.json
 * INPUT:
 * OUTPUT:
 * RUN: node sftp password
 *
 * modified: {2018-09-29}
 * created: {2018-09-27}
 */


let moFs = require('fs')
let mfClient = require('ssh2-sftp-client')
let mfEs6_promise_pool = require('es6-promise-pool')

var oConfig = {
  host: 'ftp.synagonism.net',
  port: 2234,
  username: 'kaseluri160933'
}
if (process.argv[2]) {
  oConfig.password = process.argv[2]
} else {
  console.log('type password as 3rd argument')
  process.exit()
}
var aFil = JSON.parse(moFs.readFileSync('sftp.json'))
console.log(aFil)

const fSend_file = (oConfigIn, sFileIn) => {
    return new Promise(function (resolve, reject) {
    let sftp = new mfClient();
    console.log(sFileIn);
    sftp.on('keyboard-interactive', (name, instructions, instructionsLang, prompts, finish) => { finish([oConfigIn.password]); });
    sftp.connect(oConfigIn).then(() => {
      // SPECIFIC INFO
      return sftp.put("D:/xampp/htdocs/dWstSgm/dirMiwMcs/" + sFileIn,
        "/var/www/vhosts/synagonism.net/httpdocs/dirMiwMcs/" + sFileIn);
    }).then(() => {
      console.log('finish '+sFileIn);
      sftp.end();
      resolve(sFileIn);
    }).catch((err) => {
      console.log(err, 'catch error');
    });
  });
};

var nCount = 0;
var fSend_file_producer = function () {
  console.log("count= " + nCount);
  if (nCount < aFil.length) {
    nCount++;
    return(fSend_file(oConfig, aFil[nCount-1]));
  } else {
    return null;
  }
}

// The number of promises to process simultaneously.
var nConcurrency = 10;

// Create a pool.
var oPool = new mfEs6_promise_pool(fSend_file_producer, nConcurrency)

oPool.start().then(function () {
  console.log({"message":"OK"}); // res.send('{"message":"OK"}');
});
