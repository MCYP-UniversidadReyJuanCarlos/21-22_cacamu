(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

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

    gmail.observe.on("load", () => {
        const userEmail = gmail.get.user_email();
        console.log("Hola, " + userEmail + ". Bienvenido.");

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
},{}]},{},[1]);
