var express = require('express');
var router = express.Router();

var config = require('../config.json');
var credentials = require('../credentials.json');

var fs = require('fs');
var exec = require('child_process').exec;

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.authenticated) {
    res.render('index', {
      title: 'Truck Configurator',
      content: JSON.stringify(config),
      footer: 'Powered by MEAN stack'
    });

  } else {
    res.render('login', {
      title: 'Please enter your credentials',
      content: credentials
    });
  }
});

router.post('/login',  function (req, res) {
  if (req.body.login === credentials.username && req.body.password === credentials.password) {
    req.session.authenticated = true;
    res.render('index', {
      title: 'Truck Configurator',
      content: config
    });
  } else {
    res.render('login', {
      title: 'Invalid credentials!!',
      message: 'Please enter the correct username and password'
    });
  }
  
});

router.get('/reboot', function(req, res) {
  //exec('shutdown -r now', function (error, stdout, stderr) { callback(stdout); });
  res.set('Content-Type', 'text/plain');
  res.send('reboot called');
});

router.get('/settings', function (req, res) {
  res.set('Content-Type', 'text/plain');
  res.send('settings called');
});

router.get('/logout', function (req, res) {
  req.session.authenticated = false;
  res.render('login', {
    title: 'Please enter your credentials',
    content: credentials
  });
});

router.get('/auth', function(req, res, next) {
  res.send(credentials);
});

router.get('/config', function(req, res, next) {
  res.send(config);
});

router.post('/config', function(req, res, next){
  body = req.body;
  //code to update the config file.
  fs.writeFileSync('config.json', JSON.stringify(body,null,4));
  res.render('index', {
    title: 'Configuration Successfully Updated!!',
    content: body,
    message: 'Config file for vehcile registration number: ' + body.Reg_Number + ' has been updated. Please reboot the device.'
  });
}); 

module.exports = router;
