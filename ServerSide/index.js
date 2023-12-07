const express = require("express");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
const SpeechToTextV1 = require("ibm-watson/speech-to-text/v1");
const { IamAuthenticator } = require("ibm-watson/auth");
const env = require("dotenv").config();

const languageTranslator = [
  { code: "en-US", model: "en-GB_BroadbandModel" },
  { code: "fr-FR", model: "fr-FR_BroadbandModel" },
  { code: "de-DE", model: "de-DE_BroadbandModel" },
  { code: "es-ES", model: "es-ES_BroadbandModel" },
  { code: "it-IT", model: "it-IT_BroadbandModel" },
  { code: "pt-BR", model: "pt-BR_BroadbandModel" },
  { code: "zh-CN", model: "zh-CN_BroadbandModel" },
  { code: "ja-JP", model: "ja-JP_BroadbandModel" },
  { code: "ko-KR", model: "ko-KR_BroadbandModel" },
  { code: "ru-RU", model: "ru-RU_BroadbandModel" },
];

const upload = multer({
  dest: "uploads/",
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== "audio/mpeg") {
      return cb(null, false, new Error("Only .mp3 files are allowed!"));
    }
    cb(null, true);
  },
});

const app = express();
app.use(cors());
const port = 3000;

app.post("/speech-to-text", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded or file is not a .mp3");
  }
  const speechToText = new SpeechToTextV1({
    authenticator: new IamAuthenticator({
      apikey: process.env.API_KEY,
    }),
    serviceUrl:
      "https://api.eu-de.speech-to-text.watson.cloud.ibm.com/instances/91b43b12-5a51-425e-bde8-844029516373/v1/recognize",
  });

  languageSelected = languageTranslator.find(
    (language) => language.code === req.body.language
  );

  console.log("languageSelected", languageSelected);

  const params = {
    objectMode: true,
    model: languageSelected.model,
    redaction: true,
    keywords: [
      "guerre",
      "france",
      "allemand",
      "anglais",
      "amÃ©ricain",
      "rÃ©sistance",
    ],
    keywordsThreshold: 0.5,
    maxAlternatives: 3,
  };

  const recognizeStream = speechToText.recognizeUsingWebSocket(params);
  console.log("API request to speechToText launched.");

  fs.createReadStream(req.file.path).pipe(recognizeStream);

  const outputFile = fs.createWriteStream("transcription1.txt");
  let transcription = "";
  let size = 0;
  let confidence = 0;

  recognizeStream.on("data", function (event) {
    for (var i = 0; i < event.results.length; i++) {
      transcription += event.results[i].alternatives[0].transcript + "\n";
      confidence += event.results[i].alternatives[0].confidence;
      outputFile.write(event.results[i].alternatives[0].transcript + "\n");
      size++;
    }
    onEvent("Data:", event);
  });

  recognizeStream.on("error", function (event) {
    onEvent("Error:", event);
  });

  recognizeStream.on("close", function (event) {
    onEvent("Close:", event);
    if (!res.headersSent) {
      res.status(200).send({
        transcription: transcription,
        confidence: (confidence / size) * 100,
      });
    }
  });

  function onEvent(name, event) {
    console.log(name, JSON.stringify(event, null, 2));
  }
});

app.listen(process.env.port || port, () => {
  console.log(`listening at http://localhost:${port}`);
});
