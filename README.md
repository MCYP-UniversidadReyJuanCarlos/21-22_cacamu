# 21-22_cacamu - PHISHING DETECTOR

# Project Description

Phishing Detector is a Chrome extension for Gmail which tries to improve the detection of phishing in emails through indicators of compromise (IoCs).
At this time there are more than 180.000 indicators of compromise which can be detected by this tool and prevent possible phishing attacks.
These IoCs consist of:
- More than 167.000 potentially malicious URLs
- More than 13.000 potentially malicious domains
- Approximately 50 potentially malicious senders

# Features / Installation
The extension will be available in the Chrome Web Store from where it can be easily installed (Recommended).
You can also download the extension locally by cloning this repository using the following command:

```bash
git clone https://github.com/MCYP-UniversidadReyJuanCarlos/21-22_cacamu.git
```

# How to run
If you have decided to download the tool from the Chrome Web Store there is nothing to do apart from enabling the extension.
If, on the other hand, you have downloaded the tool locally, follow the next steps:

```bash
cd 21-22_cacamu
npm run build
```
Once you have done this, the extension is compiled and ready to use.
Load the extension to your Chrome browser. For more info about how to install chrome extensions manually check the following link: https://www.cnet.com/tech/services-and-software/how-to-install-chrome-extensions-manually/
# Basic usage

Every time that you open an email, you will see a message on the top of the screen.
If there is no trace of phishing, you will receive the following message coloured in green: "NO SE HA DETECTADO PHISHING". This means that the email seems to be safe.
On the contrary, if phishing is detected, the following message coloured in red will appear: "¡CUIDADO! POSIBLE PHISHING". This means that the email has potentially malicious content. Next to the previous message you will see a button with the text 'more info' written on it. This button will pop an alert indicating why this email has been marked as risky.


# Architecture

This extension has been entirely developed with JavaScript, HTML, an CSS.  IoCs are stored locally in JSON files and are read every time that the user opens the Gmail App.
This tool is completely secure as no data is being sent out from the browser, everything is being analyzed in the user's computer.