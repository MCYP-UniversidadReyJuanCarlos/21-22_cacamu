"use strict";
/* eslint-disable */

//const { initializeApp } = require('firebase/app');
const { extractURLs } = require('ioc-extractor');

var firebase = require('firebase');

const firebaseConfig = {
    apiKey: "AIzaSyCZlFeGtKjRDqhc6nmzlZ_VNZSTlQR3RKo",
    authDomain: "tfm-phishing-iocs.firebaseapp.com",
    databaseURL: "https://tfm-phishing-iocs-default-rtdb.firebaseio.com",
    projectId: "tfm-phishing-iocs",
    storageBucket: "tfm-phishing-iocs.appspot.com",
    messagingSenderId: "679351493087",
    appId: "1:679351493087:web:e0fd9ba1fe6a5e2cfe646a"
  };

  // Initialize Firebase
var app = firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
//const database = getDatabase(app);

// loader-code: wait until gmailjs has finished loading, before triggering actual extensiode-code.
const loaderId = setInterval(() => {
    if (!window._gmailjs) {
        return;
    }

    clearInterval(loaderId);
    startExtension(window._gmailjs);
}, 100);

function everythingOk(){
    console.log("PARECE QUE NO HAY PHISHING");

    var detector = document.createElement("div");
    detector.innerHTML = "PARECE QUE TODO OK TRANKI";
    detector.id = "phishing-detector-ok";

    var parentDiv = document.querySelector("div.AO").parentNode;
    var currentDiv = document.querySelector("div.AO");
    parentDiv.insertBefore(detector, currentDiv);
}

function possiblePhishing(){
    console.log("CUIDADO QUE PARECE QUE PUEDE HABER PHISHING");

    var detector = document.createElement("div");
    detector.innerHTML = "PARECE QUE TE JUANKEAN CUIDAO";
    detector.id = "phishing-detector-ko";

    var parentDiv = document.querySelector("div.AO").parentNode;
    var currentDiv = document.querySelector("div.AO");
    parentDiv.insertBefore(detector, currentDiv);
}

function deleteElements(){
    var ko = document.getElementById("phishing-detector-ko");
    var ok = document.getElementById("phishing-detector-ok");

    if(ko !== null) {ko.remove();}
    if(ok !== null) {ok.remove();}
    
}

// actual extension-code
function startExtension(gmail) {
    console.log("¡Bienvenido a Phishing Detector!");
    window.gmail = gmail;

    var phishtankData = require('./data/phishtank.json');
    var urls = phishtankData.map(r => r.url);
    urls.push("https://ci3.googleusercontent.com/proxy/HErSrFtf2BEIMYi6manLl9y1DJRtAI0RKk09fcf1eqpN0ninTDclOExzf0JshaxeC3HBZ_eKpCkXcJ5lQQ39GtrRSOoEYAD-Rojt2IyszVcT=s0-d-e1-ft#http://mi.udemy.com/p/rp/89123c39ab29a5f1.png?mi_u=31671973825");


    gmail.observe.on("load", () => {
        const userEmail = gmail.get.user_email();
        console.log("Hola, " + userEmail + ". Bienvenido.");
        console.log(urls);

        gmail.observe.on("view_email", (domEmail) => {
            console.log("Entrando en el email:", domEmail);
            const emailData = gmail.new.get.email_data(domEmail);
            //console.log("Todos los datos del email:", emailData);
            console.log("Asunto del mensaje: ", emailData.subject);
            console.log("Cuerpo del mensaje: ", emailData.content_html);
            console.log("Remitente del mensaje (Nombre): ", emailData.from.name);
            console.log("Remitente del mensaje (Email): ", emailData.from.address);
            console.log("lista de destinatarios: ", emailData.to);

            firebase.database().ref('/').once('value', snapshot => {
                console.log(snapshot.val());
              });

            let isPhishing = false;
            deleteElements();

            let emailUrls = extractURLs(emailData.content_html);
            console.log("URLS DEL EMAIL", emailUrls);

            emailUrls.every(url => {
                if(urls.includes(url)){
                    isPhishing = true;
                    return false;
                }
            })

            if(isPhishing){
                possiblePhishing();
            } else {
                everythingOk();
            }
        });

        gmail.observe.on("compose", (compose) => {
            console.log("¡Nueva ventana de redacción de correo!", compose);
        });
    });
}