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
    var text = {}
    text['text'] = req.body.nluInput.replace(/"/g,"\\\"");;
    text['features'] = {"concepts":{},
    "entities":{},
    "keywords":{},
    "categories":{},
    "emotion":{},
    "sentiment":{},
    "semantic_roles":{}}
    // arr = text.utterances;
    // for(let i = 0; i < arr.length; i++) {
    //   // console.log(arr[i].text);
    //   query = {};
    //   query['text'] = arr[i].text;
    //   query['features'] = {
    //     concepts:{},
    //     entities:{},
    //     keywords:{},
    //     categories:{},
    //     emotion:{},
    //     sentiment:{},
    //     semantic_roles:{}
    //   };
    //   query['language'] = 'en';

      nlu.analyze(text, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        var emot = result.emotion.document.emotion;
        var keys = Object.keys(emot);
        var vals = Object.keys(emot).map(function(key){return emot[key]});
        res.render('nlu_results', {keys: keys, vals: vals});
        // entities_array = res.entities;
        // for(let i = 0; i < entities_array.length; i++) {
        //     console.log(entities_array[i].sentiment.label);
        // }
    });

    // }
});



/* Setup Twitter */
var client = new Twitter({
    consumer_key: CONSUMER_KEY,
    consumer_secret: CONSUMER_SECRET,
    access_token_key: ACCESS_TOKEN_KEY,
    access_token_secret: ACCESS_TOKEN_SECRET
});

router.post('/tone/twitter', function (req, res) {
    var twitterToneText = { utterances: [] };
    client.get('search/tweets/', {q: encodeURIComponent(req.body.tweetInput), count: 50}, function(error, tweets, response) {
        if (error) {
            console.log("Error: " + error);
            // console.log(tweets);
        } else {
            console.log("Number of results: " + tweets.search_metadata.count);
            // console.log(tweets.statuses.length);

            for (let j in tweets.statuses) {
                var tweet = tweets.statuses[j];
                // console.log("truncated: " + tweet.truncated);
                // console.log(tweet.text);
                twitterToneText.utterances.push({ text: tweet.text });
            }
            // console.log(tweets);
            // console.log("toneText: " + twitterToneText);

            // Run Tone Analyzer
            console.log(twitterToneText.length);
            tone_analyzer.tone_chat(twitterToneText, function(err, tone) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Tone Result");
                    console.log(JSON.stringify(tone, null, 2));

                    var array = tone.utterances_tone;
                    var result = {};

                    for(let i = 0; i < array.length; i++) {
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

                    keys = Object.keys(result);
                    vals = Object.keys(result).map(function(key){return result[key]});
                    res.render('tone_results', {keys: keys, vals: vals});
                }
            });
        }
    });

});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'IFAT' });
});

module.exports = router;