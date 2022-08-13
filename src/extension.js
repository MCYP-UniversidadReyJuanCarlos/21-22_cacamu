"use strict";
const { extractURLs, extractDomains } = require('ioc-extractor');

//var firebase = require('firebase');

/*const firebaseConfig = {
    apiKey: "AIzaSyBoV9fBFhcuVLEjmGa9E4_c9sNoXFh57NY",
    authDomain: "tfm-phishing-iocs-3.firebaseapp.com",
    projectId: "tfm-phishing-iocs-3",
    databaseURL: "https://tfm-phishing-iocs-3-default-rtdb.firebaseio.com",
    storageBucket: "tfm-phishing-iocs-3.appspot.com",
    messagingSenderId: "343598413138",
    appId: "1:343598413138:web:8ab3b415ad9561da0bf68b"
  };

  // Initialize Firebase
var app = firebase.initializeApp(firebaseConfig);*/

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
    detector.innerHTML = "NO SE HA DETECTADO PHISHING";
    detector.id = "phishing-detector-ok";

    var parentDiv = document.querySelector("div.AO").parentNode;
    var currentDiv = document.querySelector("div.AO");
    parentDiv.insertBefore(detector, currentDiv);
}

function possiblePhishing(){
    console.log("CUIDADO QUE PARECE QUE PUEDE HABER PHISHING");

    var detector = document.createElement("div");
    detector.innerHTML = "¡CUIDADO! POSIBLE PHISHING";
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
async function startExtension(gmail) {

    var urls = [];

    /*firebase.database().ref('/').once('value').then( snapshot => {

        if(snapshot.exists()){

            var urlsData = snapshot.val().urls;

            urls.push(urlsData['AlienVault']);

            urlsData['phishtank'].forEach(r => {
                urls.push(r.url);
            })
        }
    });*/

    /*var starCountRef = firebase.database().ref('/');
    starCountRef.on('value', (snapshot) => {
        const data = snapshot.val();
        console.log(data);
    });*/

    console.log("¡Bienvenido a Phishing Detector!");
    window.gmail = gmail;

    var phishtankData = require('./data/phishtank.json');
    var AlienVaultUrlsData = require('./data/urlsAlienVault.json');
    var AlienVaultSendersData = require('./data/sendersAlienVault.json');
    var AlienVaultHashesData = require('./data/fileHashesAlienVault.json');
    var AlienVaultDomainsData = require('./data/domainsAlienVault.json');

    await phishtankData.forEach(r => {
        urls.push(r.url);
    });

    await AlienVaultUrlsData.forEach(url => {
        urls.push(url);
    });

    urls.push("");
    
    gmail.observe.on("load", async () => {
        const userEmail = gmail.get.user_email();
        console.log("Hola, " + userEmail + ". Bienvenido.");
        //console.log(urls);
        //console.log(database);

        gmail.observe.on("view_email", async (domEmail) => {
            console.log("Entrando en el email:", domEmail);
            const emailData = gmail.new.get.email_data(domEmail);
            //console.log("Todos los datos del email:", emailData);
            console.log("Asunto del mensaje: ", emailData.subject);
            console.log("Cuerpo del mensaje: ", emailData.content_html);
            console.log("Remitente del mensaje (Nombre): ", emailData.from.name);
            console.log("Remitente del mensaje (Email): ", emailData.from.address);
            console.log("lista de destinatarios: ", emailData.to);

            let isPhishing = false;
            deleteElements();

            let emailUrls = extractURLs(emailData.content_html);
            let emailDomains = extractDomains(emailData.content_html);
            console.log("URLS DEL EMAIL", emailUrls);
            console.log("Dominios del email", emailDomains);

            setTimeout(() => console.log(urls), 1000);

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