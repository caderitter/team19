var express = require('express');
var router = express.Router();
var ToneAnalyzer = require('watson-developer-cloud/tone-analyzer/v3');
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

var db = require('../db');

const tone_analyzer = new ToneAnalyzer({
    username: 'd609b749-ea64-4f98-8d02-f8066222a35a',
    password: 'nxz2REqlgbCh',
    version_date: '2016-05-19'
});

const nlu = new NaturalLanguageUnderstandingV1({
    username: '11c6ebc6-7d87-4d13-aa9b-ee4b09de685a',
    password: 'riQHXSMSEuPF',
    version_date: '2016-05-19'
});

router.post('/tone', function (req, res) {
  var text = JSON.parse(req.body.toneInput);
  tone_analyzer.tone_chat(text, function(err, tone) {
      if (err) {
          console.log(err);
      } else {
          console.log(JSON.stringify(tone, null, 2));

          var array = tone.utterances_tone;
          var result = {};

          for(i = 0; i < array.length; i++) {
              var tones = array[i].tones;
              for(j = 0; j < tones.length; j++) {
                  if(result.hasOwnProperty(tones[j].tone_id)){
                      result[tones[j].tone_id] = result[tones[j].tone_id] + 1;
                  }
                  else {
                      result[tones[j].tone_id] = 1;
                  }
              }
          }

          var keys = Object.keys(result);
          var vals = Object.keys(result).map(function(key){return result[key]});
          res.render('tone_results', {keys: keys, vals: vals});
      }
  });
});

router.post('/nlu', function (req, res) {
  var text = JSON.parse(req.body.nluInput);
  text['features'] = {entities: {emotion: true, limit: 1}};
  console.log(text);
  nlu.analyze(text, function (err, res) {
      if (err) {
          console.log(err);
          return;
      }
      console.log(res);
  });
});




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Team 19' });
});

module.exports = router;