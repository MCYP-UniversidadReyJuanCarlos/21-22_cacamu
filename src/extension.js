"use strict";

const fs = require('fs');
const path = require('path');

// loader-code: wait until gmailjs has finished loading, before triggering actual extensiode-code.
const loaderId = setInterval(() => {
    if (!window._gmailjs) {
        return;
    }

    clearInterval(loaderId);
    startExtension(window._gmailjs);
}, 100);

// actual extension-code
function startExtension(gmail) {
    console.log("¡Bienvenido a Phishing Detector!");
    window.gmail = gmail;

    // As with JSON, use the Fetch API & ES6
/*fetch('./data/phishtank.json')
  .then(response => response.text())
  .then(dataPhishtank => {
      console.log(dataPhishtank);
  	phishtank = JSON.parse(dataPhishtank);
    urls = phishtank.map(r = r.url);
  });*/

  var phishtankData = require('./data/phishtank.json');
  //var phishtankJson = JSON.parse(phishtankData);
  var urls = phishtankData.map(r => r.url);

    
    /*let url = 'https://data.phishtank.com/data/online-valid.json';

    fetch(url, {mode: 'no-cors', headers: {"Accept": "application/json", "Content-Type": "application/json", "User-Agent": "Phishtank/Charlie"}})
    .then(res => res.json())
    .then(out => console.log(out))
    .catch(err => console.log(err));*/

    //let urls = phishtank.map(r => r.url);

    gmail.observe.on("load", () => {
        const userEmail = gmail.get.user_email();
        console.log("Hola, " + userEmail + ". Bienvenido.");
        console.log(urls);

        gmail.observe.on("view_email", (domEmail) => {
            console.log("Entrando en el email:", domEmail);
            const emailData = gmail.new.get.email_data(domEmail);
            console.log("Todos los datos del email:", emailData);
            console.log("Asunto del mensaje: ", emailData.subject);
            console.log("Cuerpo del mensaje: ", emailData.content_html);
            console.log("Remitente del mensaje (Nombre): ", emailData.from.name);
            console.log("Remitente del mensaje (Email): ", emailData.from.address);
            console.log("lista de destinatarios: ", emailData.to);
        });

        gmail.observe.on("compose", (compose) => {
            console.log("¡Nueva ventana de redacción de correo!", compose);
        });
    });
}