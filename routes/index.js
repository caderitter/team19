var express = require('express');
var router = express.Router();
var ToneAnalyzer = require('watson-developer-cloud/tone-analyzer/v3');
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

var Twitter = require('twitter');
var db = require('../db');

const CONSUMER_KEY = 'PtJSr4p9QagFXYhr3C93xMgX3';
const CONSUMER_SECRET = 'MN5F0GG3xudTcVun2Rm6W1UHCwIYcXvXr4qQAI5rm35BnkeSl1';
const ACCESS_TOKEN_KEY = '921107203871866880-dAZabMibKNaeYmXTA7L0YPL6iCmLjmo';
const ACCESS_TOKEN_SECRET = '2xJPmz0I0fbGA4HG4XLbfxWV3HxeaSQGZZi0wmuDXbjpy';

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


/* Setup Twitter */
var client = new Twitter({
    consumer_key: CONSUMER_KEY,
    consumer_secret: CONSUMER_SECRET,
    access_token_key: ACCESS_TOKEN_KEY,
    access_token_secret: ACCESS_TOKEN_SECRET
});

/* Twitter Request */
var name = '%23IBMfinishline17';
// client.get('statuses/user_timeline', {screen_name: "IBM"}, function(error, tweets, response) {
//     if (error) {
//         console.log("Error: " + error);
//     } else {
//         console.log("TWEETS");
//         console.log(tweets);
//     }
// });

client.get('search/tweets/', {q: name, count: 100}, function(error, tweets, response) {
    if (error) {
        console.log("Error: " + error);
        console.log(tweets);
    } else {
        console.log("Number of results: " + tweets.search_metadata.count);
        console.log(tweets.statuses.length);

        for (i in tweets.statuses) {
            var tweet = tweets.statuses[i];
            console.log("truncated: " + tweet.truncated);
            console.log(tweet.text);
        }
        // console.log(tweets);
    }
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Team 19' });
});

module.exports = router;