"use strict";

const { extractURLs } = require('ioc-extractor');

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

// actual extension-code
function startExtension(gmail) {
    console.log("¡Bienvenido a Phishing Detector!");
    window.gmail = gmail;

  var phishtankData = require('./data/phishtank.json');
  var urls = phishtankData.map(r => r.url);
  urls.push("http://magiaycardistry.activehosted.com/proc.php?nl=2&amp;c=294&amp;m=11742&amp;s=bb4584f418ac004322ff7e0746b46a63&amp;act=unsub");
  let isPhishing = false;

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