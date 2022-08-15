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

var iocType = "URL";
var ioc = "https://www.phishing.com/";

function infoMessage(iocType, ioc) {
    var message = "The " + iocType + " " + ioc + " has previously been marked as possible phishing. Be careful."
    alert(message);
}

function everythingOk(){
    console.log("PARECE QUE NO HAY PHISHING");

    var detector = document.createElement("div");
    detector.innerHTML = "NO SE HA DETECTADO PHISHING";
    detector.id = "phishing-detector-ok";

    var parentDiv = document.querySelector("div.AO").parentNode;
    var currentDiv = document.querySelector("div.AO");
    parentDiv.insertBefore(detector, currentDiv);
}

function possiblePhishing(typePhishing, iocPhishing){
    console.log("CUIDADO QUE PARECE QUE PUEDE HABER PHISHING");

    var detector = document.createElement("div");
    detector.innerHTML = "¡CUIDADO! POSIBLE PHISHING";
    detector.id = "phishing-detector-ko";

    var parentDiv = document.querySelector("div.AO").parentNode;
    var currentDiv = document.querySelector("div.AO");
    parentDiv.insertBefore(detector, currentDiv);

    var button = document.createElement("button");
    button.innerHTML = "More info";
    button.id = "button-info-ko"
    button.onclick = function()
    {
        infoMessage(typePhishing, iocPhishing);
    }

    document.getElementById("phishing-detector-ko").append(button);
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
    var senders = [];
    var domains = [];
    var hashes = [];

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
    await phishtankData.forEach(r => {
        urls.push(r.url);
    });

    var AlienVaultUrlsData = require('./data/urlsAlienVault.json');
    await AlienVaultUrlsData.forEach(url => {
        urls.push(url);
    });

    var TweetFeedUrlsData = require('./data/urlsTweetFeed.json');
    await TweetFeedUrlsData.forEach(url => {
        urls.push(url);
    });

    var AlienVaultSendersData = require('./data/sendersAlienVault.json');
    await AlienVaultSendersData.forEach(sender => {
        senders.push(sender);
    });

    var AlienVaultHashesData = require('./data/fileHashesAlienVault.json');
    await AlienVaultHashesData.forEach(hash => {
        hashes.push(hash);
    });

    var AlienVaultDomainsData = require('./data/domainsAlienVault.json');
    await AlienVaultDomainsData.forEach(domain => {
        domains.push(domain);
    });

    var TweetFeedDomainsData = require('./data/domainsTweetFeed.json');
    await TweetFeedDomainsData.forEach(url => {
        domains.push(url);
    });

    senders.push("marketing@tribalchimp.com");
    
    gmail.observe.on("load", async () => {
        const userEmail = gmail.get.user_email();
        console.log("Hola, " + userEmail + ". Bienvenido.");

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
            setTimeout(() => console.log(senders), 1000);
            setTimeout(() => console.log(domains), 1000);
            setTimeout(() => console.log(hashes), 1000);

            //urls
            emailUrls.every(url => {
                if(urls.includes(url)){
                    isPhishing = true;
                    possiblePhishing("url", url);
                    return false;
                }
            })

            //senders
            if(senders.includes(emailData.from.address)){
                isPhishing = true;
                possiblePhishing("sender", emailData.from.address);
            }

            //domains
            emailDomains.every(domain => {
                if(domains.includes(domain)){
                    isPhishing = true;
                    possiblePhishing("domain", domain);
                    return false;
                }
            })

            if(!isPhishing){
                everythingOk();
            }
            
            window.onhashchange = function() {
                //deleteElements();
                console.log("me he ido patras como los cangrejos");
            }  

        });

        gmail.observe.on("compose", (compose) => {
            console.log("¡Nueva ventana de redacción de correo!", compose);
        });
    });
}