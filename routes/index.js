var express = require('express');
var router = express.Router();
var ToneAnalyzer = require('watson-developer-cloud/tone-analyzer/v3');
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

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
          console.log('tone endpoint:');
          console.log(JSON.stringify(tone, null, 2));
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