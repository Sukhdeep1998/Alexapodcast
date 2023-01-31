/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
var https = require('https');
const Alexa = require('ask-sdk-core');

	
const textDocument = require('./text.json');
const AUDIO_TOKEN = "AudioToken";
const TEXT_TOKEN = "TextToken";
var resumrurl='';
var resumrname='';
var resumrtoken='';
var reumeart='';
const STREAMS = [
  {
    'token': 'dabble-radio-1',
    'url': 'https://stream.zeno.fm/efe91skxn18uv.m3u',
    'metadata': {
      'title': 'Dabble Radio',
      'subtitle': 'Music for coders',
      'art': {
        'sources': [
          {
            'contentDescription': 'Dabble Radio',
            'url': 'https://s3.amazonaws.com/cdn.dabblelab.com/img/audiostream-starter-512x512.png',
            'widthPixels': 512,
            'heightPixels': 512,
          },
        ],
      },
      'backgroundImage': {
        'sources': [
          {
            'contentDescription': 'Dabble Radio',
            'url': 'https://s3.amazonaws.com/cdn.dabblelab.com/img/wayfarer-on-beach-1200x800.png',
            'widthPixels': 1200,
            'heightPixels': 800,
          },
        ],
      },
    },
  },
];

const DOCUMENT_ID = "scrollcard";
const datasource = {
    "imageListData": {
        "type": "object",
        "objectId": "imageListSample",
        "backgroundImage": {
            "contentDescription": null,
            "smallSourceUrl": null,
            "largeSourceUrl": null,
            "sources": [
                {
                    "url": "https://d2o906d8ln7ui1.cloudfront.net/images/templates_v3/gridlist/GridListBackground_Dark.png",
                    "size": "large"
                }
            ]
        },
        "title": "Plant Stores Near Me",
        "listItems": [
            {
                "primaryText": "Peonies & Petals Nursery",
                "imageSource": "https://d2o906d8ln7ui1.cloudfront.net/images/templates_v3/gridlist/GridList_Image1.png",
                "id": "fadeHelloTextButton",
                "primaryAction": [
                  {
                        "type": "SendEvent",
                        "arguments": [
                        "user clicked the button"
                        ]
                    }
                    ]
            },
            {
                "primaryText": "Ivy Lane Nursery and Tree Farm",
                "imageSource": "https://d2o906d8ln7ui1.cloudfront.net/images/templates_v3/gridlist/GridList_Image2.png"
            },
            {
                "primaryText": "House of Hyacinth",
                "imageSource": "https://d2o906d8ln7ui1.cloudfront.net/images/templates_v3/gridlist/GridList_Image3.png"
            },
            {
                "primaryText": "Swan Nursery",
                "imageSource": "https://d2o906d8ln7ui1.cloudfront.net/images/templates_v3/gridlist/GridList_Image4.png"
            },
            {
                "primaryText": "House of Peonies",
                "imageSource": "https://d2o906d8ln7ui1.cloudfront.net/images/templates_v3/gridlist/GridList_Image5.png"
            },
            {
                "primaryText": "Spruce Nursery",
                "imageSource": "https://d2o906d8ln7ui1.cloudfront.net/images/templates_v3/gridlist/GridList_Image6.png"
            }
        ],
        "logoUrl": "https://d2o906d8ln7ui1.cloudfront.net/images/templates_v3/logo/logo-modern-botanical-white.png",
        "hintText": "Try, \"Alexa, select number 1\""
    }
};
const createDirectivePayload = (aplDocumentId, dataSources = {}, tokenId = "documentToken") => {
    return {
        type: "Alexa.Presentation.APL.RenderDocument",
        token: tokenId,
        document: {
            type: "Link",
            src: "doc://alexa/apl/documents/" + aplDocumentId
        },
        datasources: dataSources
    }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to RadioFM. To play a Radio, Say play "Radio Name". For example, if you would like to listen to Radio Hydra, Say play Radio Hydra.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const radiofmintentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (
        handlerInput.requestEnvelope.request.intent.name === 'radiofmintent'
      );
    },
    async handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const stationanme=handlerInput.requestEnvelope.request.intent.slots.action.value; if(stationanme==''){
            if(resumrurl!=''){
            handlerInput.responseBuilder
                .speak(`You are listening  ${resumrname} on RadioFM`)
                .withShouldEndSession(false)
                .addAudioPlayerPlayDirective('REPLACE_ALL',resumrurl, resumrtoken, 0,null,reumeart);
            }else{
                let repromptOutput="Please try any other radio station.";
                const speechText = "There is no station played by you please play a radio station. To play a Radio, Say play Radio Name. For example, if you would like to listen to Radio Hydra, Say play Radio Hydra.";
             handlerInput.responseBuilder
             .speak(speechText)
             .reprompt(repromptOutput);
            }
            return handlerInput.responseBuilder
            .getResponse();
        
        }
        
        const newstationaname=stationanme.split(" ").join("-");
        const response = await httpGet(newstationaname);
        const totallen = response.length;
        
        sessionAttributes.finaldata=response;
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
         
        var stnamesssx=[];
        for(var ii=0;ii<totallen;ii++){
            var jj=ii+1;
            var dstnamesssj1 = jj+". For "+sessionAttributes.finaldata[ii].metadata.title;
            var stnamesssj1 = {
                "primaryText": sessionAttributes.finaldata[ii].metadata.title,
                "imageSource": sessionAttributes.finaldata[ii].metadata.art.sources[0].url,
                "id": "fadeHelloTextButton"+ii,
                "stid":ii,
                "primaryAction": [
                  {
                        "type": "SendEvent",
                        "arguments": [
                        "user clicked the button"
                        ]
                    }
                    ]
            };
            stnamesssx.push(stnamesssj1);
        }
        
const datasource = {
    "imageListData": {
        "type": "object",
        "objectId": "imageListSample",
        "backgroundImage": {
            "contentDescription": null,
            "smallSourceUrl": null,
            "largeSourceUrl": null,
            "sources": [
                {
                    "url": "https://exec.aprocsocial.radiofm.net.in/radiobg.jpg",
                    "size": "large"
                }
            ]
        },
        "title": "Radio FM",
        "listItems":stnamesssx,
        "logoUrl": "https://exec.aprocsocial.radiofm.net.in/logo_purple.png",
        "hintText": "Try, \"select any radio\""
    }
};
const createDirectivePayload = (aplDocumentId, dataSources = {}, tokenId = "documentToken") => {
    return {
        type: "Alexa.Presentation.APL.RenderDocument",
        token: tokenId,
        document: {
            type: "Link",
            src: "doc://alexa/apl/documents/" + aplDocumentId
        },
        datasources: dataSources
    }
};
        
        
        const speakOutput = 'Please slect any radio station.';
        const aplDirective = createDirectivePayload(DOCUMENT_ID, datasource);
                    // add the RenderDocument directive to the responseBuilder
                    handlerInput.responseBuilder.speak(speakOutput).addDirective(aplDirective);
                    return handlerInput.responseBuilder.getResponse();
        } else {
        if(totallen > 1){
        var stnamesss=[];
        for(var i=0;i<totallen;i++){
            var j=i+1;
            var stnamesss1 = j+". For "+sessionAttributes.finaldata[i].metadata.title;
            stnamesss.push(stnamesss1);
        }
        
        //const stream = response;
        let repromptOutput="Please try any other radio station.";
        
         const speechText = `For ${stationanme} we have the following radio stations.  ${stnamesss}`;
             handlerInput.responseBuilder
             .speak(speechText)
             .reprompt(repromptOutput);
        }else if(totallen > 0){
            
             const stream = response[0];
             sessionAttributes.resumedata=response[0];
            sessionAttributes.pausedata=response[0];
            
             let repromptOutput="Please try any other radio station.";
             if(stream.url===''){
            const speechText = "The requested station couldn't be found. Please try again with some other Radio Station.";
             handlerInput.responseBuilder
             .speak(speechText)
             .reprompt(repromptOutput);
                }else{
                resumrurl=stream.url;
                resumrname=stream.metadata.title;
                resumrtoken=stream.token;
                reumeart=stream.metadata;
                 if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
                           const datasource = {
                            "audioPlayerTemplateData": {
                                "type": "object",
                                "properties": {
                                    "audioControlType": "pause",
                                    "audioSources": [stream.url],
                                    "backgroundImage": "https://d2o906d8ln7ui1.cloudfront.net/images/response_builder/background-rose.png",
                                    "coverImageSource": "https://d2o906d8ln7ui1.cloudfront.net/images/response_builder/card-rose.jpeg",
                                    "headerTitle": "My favorite flower songs",
                                    "logoUrl": "https://d2o906d8ln7ui1.cloudfront.net/images/response_builder/logo-world-of-plants-2.png",
                                    "primaryText": "Roses",
                                    "secondaryText": "My favourite album",
                                    "sliderType": "determinate"
                                }
                            }
                        };
                        
                        const createDirectivePayload = (aplDocumentId, dataSources = {}, tokenId = "documentToken") => {
                            return {
                                type: "Alexa.Presentation.APL.RenderDocument",
                                token: tokenId,
                                document: {
                                    type: "Link",
                                    src: "doc://alexa/apl/documents/" + aplDocumentId
                                },
                                datasources: dataSources
                            }
                        };
                             
                        const speakOutput = 'Please slect any radio station.';
                        const aplDirective = createDirectivePayload(DOCUMENT_ID, datasource);
                                    // add the RenderDocument directive to the responseBuilder
                                    handlerInput.responseBuilder.speak(speakOutput).addDirective(aplDirective);
                                    
                        }
        }
        }else{
            let repromptOutput="Please try any other radio station.";
            const speechText = "The requested station couldn't be found. Please try again with some other Radio Station.";
             handlerInput.responseBuilder
             .speak(speechText)
             .reprompt(repromptOutput);
        }
        return handlerInput.responseBuilder
          .getResponse();
        }
  },
};
const resumeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
           && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.ResumeIntent';
    },
   async handle(handlerInput) {
      let repromptOutput="Please try any other radio station.";
             if(resumrurl===''){
             const speechText = "There is no station played by you please play a radio station. To play a Radio, Say play Radio Name. For example, if you would like to listen to Radio Hydra, Say play Radio Hydra.";
             handlerInput.responseBuilder
             .speak(speechText)
             .reprompt(repromptOutput);
                }else{
                handlerInput.responseBuilder
                .speak(`You are listening  ${resumrname} on RadioFM`)
                .withShouldEndSession(false)
                .addAudioPlayerPlayDirective('REPLACE_ALL',resumrurl, resumrtoken, 0,null,reumeart);
        }
        return handlerInput.responseBuilder
          .getResponse();
    },
};
const selectradiointentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (
        handlerInput.requestEnvelope.request.intent.name === 'selectradiointent'
      );
    },
    async handle(handlerInput) {
        
                 if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
                     
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        const stationanme=handlerInput.requestEnvelope.request.intent.slots.number.value;
        let repromptOutput="Please try any other radio station.";
        var jii = stationanme-1;
        const stream = sessionAttributes.finaldata[jii];
        const DOCUMENT_ID = "newcard";
const datasource = {
    "audioPlayerTemplateData": {
                                "type": "object",
                                "properties": {
                                    "audioControlType": "pause",
                                    "audioSources": [stream.url],
                                    "backgroundImage": "https://exec.aprocsocial.radiofm.net.in/radiobg.jpg",
                                    "coverImageSource": stream.metadata.art.sources[0].url,
                                    "headerTitle": stream.metadata.title,
                                    "logoUrl": "https://exec.aprocsocial.radiofm.net.in/logo_purple.png",
                                    "primaryText": stream.metadata.title,
                                    "secondaryText": "Radio FM",
                                    "sliderType": "determinate"
                                }
                            }
};
const createDirectivePayload = (aplDocumentId, dataSources = {}, tokenId = "documentToken") => {
    return {
        type: "Alexa.Presentation.APL.RenderDocument",
        token: tokenId,
        document: {
            type: "Link",
            src: "doc://alexa/apl/documents/" + aplDocumentId
        },
        datasources: dataSources
    }
};
                    // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID, datasource);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);        // send out skill response
        return handlerInput.responseBuilder.getResponse();
    
                 }else{
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const stationanme=handlerInput.requestEnvelope.request.intent.slots.number.value;
        let repromptOutput="Please try any other radio station.";
        var ji = stationanme-1;
        const stream = sessionAttributes.finaldata[ji];
        
        sessionAttributes.resumedata=sessionAttributes.finaldata[ji];
        sessionAttributes.pausedata=sessionAttributes.finaldata[ji];
        
        if(stream.url===''){
            const speechText = "The requested station is down. Please try with some other Radio Station.";
             handlerInput.responseBuilder
             .speak(speechText)
             .reprompt(repromptOutput);
        }else{
            
        resumrurl=stream.url;
        resumrname=stream.metadata.title;
        resumrtoken=stream.token;
        reumeart=stream.metadata;
        handlerInput.responseBuilder
        .speak(`You are listening  ${stream.metadata.title} on RadioFM`)
        .withShouldEndSession(false)
        .addAudioPlayerPlayDirective('REPLACE_ALL', stream.url, stream.token, 0,null,stream.metadata);
}
            
        return handlerInput.responseBuilder
          .getResponse();
    }
  },
};
const ButtonEventHandler = {
    canHandle(handlerInput){
        
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
            && (
                handlerInput.requestEnvelope.request.source.id === 'fadeHelloTextButton0' || 
                handlerInput.requestEnvelope.request.source.id === 'fadeHelloTextButton1' || 
                handlerInput.requestEnvelope.request.source.id === 'fadeHelloTextButton2' || 
                handlerInput.requestEnvelope.request.source.id === 'fadeHelloTextButton3' || 
                handlerInput.requestEnvelope.request.source.id === 'fadeHelloTextButton4' ||  
                handlerInput.requestEnvelope.request.source.id === 'fadeHelloTextButton5'
                );
    },
    handle(handlerInput){
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        var id = handlerInput.requestEnvelope.request.source.id;
        var isd = id.split("HelloTextButton");
        var ji =isd[1];
        const stream = sessionAttributes.finaldata[ji];
        const DOCUMENT_ID = "newcard";
const datasource = {
    "audioPlayerTemplateData": {
                                "type": "object",
                                "properties": {
                                    "audioControlType": "pause",
                                    "audioSources": [stream.url],
                                    "backgroundImage": "https://exec.aprocsocial.radiofm.net.in/radiobg.jpg",
                                    "coverImageSource": stream.metadata.art.sources[0].url,
                                    "headerTitle": stream.metadata.title,
                                    "logoUrl": "https://exec.aprocsocial.radiofm.net.in/logo_purple.png",
                                    "primaryText": stream.metadata.title,
                                    "secondaryText": "Radio FM",
                                    "sliderType": "determinate"
                                }
                            }
};
const createDirectivePayload = (aplDocumentId, dataSources = {}, tokenId = "documentToken") => {
    return {
        type: "Alexa.Presentation.APL.RenderDocument",
        token: tokenId,
        document: {
            type: "Link",
            src: "doc://alexa/apl/documents/" + aplDocumentId
        },
        datasources: dataSources
    }
};
                    // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID, datasource);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);        // send out skill response
        return handlerInput.responseBuilder.getResponse();
    }
}
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        
        const speakOutput = 'To play a Radio, Say play "Radio Name". For example, if you would like to listen to Radio Hydra, Say play Radio Hydra.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const UnsupportedAudioIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (
                Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.LoopOffIntent'
                    || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.LoopOnIntent'
                    || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NextIntent'
                    || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.PreviousIntent'
                    || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.RepeatIntent'
                    || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.ShuffleOffIntent'
                    || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.ShuffleOnIntent'
                    || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StartOverIntent'
                );
    },
    async handle(handlerInput) {
        const speakOutput = 'Sorry, I can\'t support that yet.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt("What do you want to do ?")
            .getResponse();
    }
};

const PauseAudioIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.PauseIntent';
    },
    async handle(handlerInput) {
        
        const speakOutput = 'Station paused';
        return handlerInput.responseBuilder
            .speak(speakOutput)  
            .addAudioPlayerClearQueueDirective('CLEAR_ALL')
            .reprompt("What do you want to do ?")
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
      );
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .addAudioPlayerStopDirective()
            .addAudioPlayerClearQueueDirective('CLEAR_ALL')
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I am unable to find. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};


const PlaybackControllerHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type.startsWith('PlaybackController.');
  },
  async handle(handlerInput) {
    const playbackInfo = await getPlaybackInfo(handlerInput);
    const playBehavior = 'REPLACE_ALL';
    const podcastUrl = resumrurl;
    const playbackControllerEventName = handlerInput.requestEnvelope.request.type.split('.')[1];
    let response;
    switch (playbackControllerEventName) {
      case 'PlayCommandIssued':
        response = handlerInput.responseBuilder
            .addAudioPlayerPlayDirective(
                playBehavior,
                podcastUrl,
                playbackInfo.token,
                playbackInfo.offsetInMilliseconds
                )
            .getResponse();
        break;
      case 'PauseCommandIssued':
        response = handlerInput.responseBuilder
            .addAudioPlayerStopDirective()
            .getResponse();
        break;
      default:
        break;
    }
    setPlaybackInfo(handlerInput, playbackInfo);
    console.log(`PlayCommandIssued event encountered: ${handlerInput.requestEnvelope.request.type}`);
    return response;
  },
};

const AudioPlayerEventHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type.startsWith('AudioPlayer.');
  },
  async handle(handlerInput) {
    const playbackInfo = await getPlaybackInfo(handlerInput);
    
    const audioPlayerEventName = handlerInput.requestEnvelope.request.type.split('.')[1];
    console.log(`AudioPlayer event encountered: ${handlerInput.requestEnvelope.request.type}`);
    let returnResponseFlag = false;
    switch (audioPlayerEventName) {
      case 'PlaybackStarted':
        playbackInfo.token = handlerInput.requestEnvelope.request.token;
        playbackInfo.inPlaybackSession = true;
        playbackInfo.hasPreviousPlaybackSession = true;
        returnResponseFlag = true;
        break;
      case 'PlaybackFinished':
        playbackInfo.inPlaybackSession = false;
        playbackInfo.hasPreviousPlaybackSession = false;
        playbackInfo.nextStreamEnqueued = false;
        returnResponseFlag = true;
        break;
      case 'PlaybackStopped':
        playbackInfo.token = handlerInput.requestEnvelope.request.token;
        playbackInfo.inPlaybackSession = true;
        playbackInfo.offsetInMilliseconds = handlerInput.requestEnvelope.request.offsetInMilliseconds;
        break;
      case 'PlaybackNearlyFinished':
        break;
      case 'PlaybackFailed':
        playbackInfo.inPlaybackSession = false;
        console.log('Playback Failed : %j', handlerInput.requestEnvelope.request.error);
        break;
      default:
        break;
    }
    setPlaybackInfo(handlerInput, playbackInfo);
    return handlerInput.responseBuilder.getResponse();
  },
};
async function getPlaybackInfo(handlerInput) {
  const attributes = await handlerInput.attributesManager.getPersistentAttributes();
  return attributes.playbackInfo;
}
async function setPlaybackInfo(handlerInput, playbackInfoObject) {
  await handlerInput.attributesManager.setPersistentAttributes({
      playbackInfo: playbackInfoObject
      });
}
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const PlaybackStoppedIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'PlaybackController.PauseCommandIssued'
      || handlerInput.requestEnvelope.request.type === 'AudioPlayer.PlaybackStopped';
  },
  handle(handlerInput) {
    handlerInput.responseBuilder
      .addAudioPlayerClearQueueDirective('CLEAR_ALL')
      .addAudioPlayerStopDirective();

    return handlerInput.responseBuilder
      .getResponse();
  },
};
const PlaybackStartedIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'AudioPlayer.PlaybackStarted';
  },
  handle(handlerInput) {
    handlerInput.responseBuilder
      .addAudioPlayerClearQueueDirective('CLEAR_ENQUEUED');

    return handlerInput.responseBuilder
      .getResponse();
  },
};
function httpGet(stationanme) {
  return new Promise(((resolve, reject) => {
    var options = {
        host: 'exec.aprocsocial.radiofm.net.in',
        port: 443,
        path:'/alexa_test.php?search='+stationanme,
        method: 'GET',
    };
    
    const request = https.request(options, (response) => {
      response.setEncoding('utf8');
      let returnData = '';

      response.on('data', (chunk) => {
        returnData += chunk;
      });

      response.on('end', () => {
        resolve(JSON.parse(returnData));
      });

      response.on('error', (error) => {
        reject(error);
      });
    });
    request.end();
  }));
}
/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        radiofmintentHandler,
        HelpIntentHandler,
        AudioPlayerEventHandler,
        selectradiointentHandler,
        PlaybackControllerHandler,
        ButtonEventHandler,
        resumeIntentHandler,
        PauseAudioIntentHandler,
        UnsupportedAudioIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        PlaybackStartedIntentHandler,
        SessionEndedRequestHandler,
        PlaybackStoppedIntentHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();