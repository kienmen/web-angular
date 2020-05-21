import { Injectable, OnInit } from '@angular/core';
import { Buffer } from 'buffer';
import { md5 } from 'js-md5';
import { environment as config } from '../../../../environments/environment';
const encodeDecodeKey = config.encodeDecode;
@Injectable()
export class EncodeDecodeService {
baseSecret: string;
baseContent: string;
constructor() {
let secretKey = encodeDecodeKey.clientKey;
this.setBaseInfor(secretKey);
}

encodeBase64(data) {
return Buffer.from(data).toString('base64');
}

decodeBase64(data) {
return Buffer.from(data, 'base64').toString();
}

encodeMd5(data) {
data += '';
return md5(data);
}

encode(content) {
let newContent = 'E';
const baseString = this.getBaseString(this.baseSecret);
const baseNumber = baseString;
let character;
let characterBaseString;
let characterBaseNumber;
let indexContent = 0;
let indexBase = 0;
let indexNumber = 0;
let number;
let mod;
let div;
const lengthContent = content.length;
const lengthBaseString = baseString.length;
const lengthNumber = baseNumber.length;
const lengthBaseContent = this.baseContent.length;

let numberRandom;
let numberInsert;
let minPosition;
let symbolRandom;
let count = 0;

numberRandom = 97 + this.getRandomInt(25);
numberInsert = 65 + this.getRandomInt(25);
symbolRandom = String.fromCharCode(numberRandom) + String.fromCharCode(numberInsert);
numberRandom = 1 + this.getRandomInt(9);
minPosition = Math.min(lengthContent, 20);
numberInsert = Math.floor(this.getRandomInt(minPosition) / 2);
while (indexContent < lengthContent) {
character = content.charCodeAt(indexContent);
if (character >= 32 && character <= 126) {
characterBaseString = baseString.charCodeAt(indexBase);
characterBaseNumber = baseNumber.charCodeAt(indexNumber);
number = character + characterBaseString + characterBaseNumber + numberRandom;
mod = number % lengthBaseContent;
div = Math.floor(number / lengthBaseContent);
newContent += div + this.baseContent.charAt(mod);
if (count == numberInsert)
newContent += symbolRandom + numberRandom.toString();
count++;
} else {
newContent += String.fromCharCode(character);
}
indexContent++;
indexBase = (indexBase + 1) % lengthBaseString;
indexNumber = (indexNumber + 1) % lengthNumber;
}
if (content !== this.decode(newContent)) {
throw Error("There was an error! Please contact administrator!!!");
}
return newContent;
}

decode(content) {
let newContent = '';
const baseString = this.getBaseString(this.baseSecret);
const baseNumber = baseString;
let character;
let characterBaseString;
let characterBaseNumber;
let indexContent = 1;
let indexBase = 0;
let indexNumber = 0;
let number;
let mod;
let div;
const lengthContent = content.length;
const lengthBaseString = baseString.length;
const lengthNumber = baseNumber.length;
const lengthBaseContent = this.baseContent.length;
let numberRandom = 0;
let countLetter = 0;
let indexRandom = 0;
let isFindRandom = false;

while (indexContent < lengthContent) {
div = 0;
character = content.charCodeAt(indexContent);
if (!isFindRandom) {
indexContent++;
if (this.isLetter(character)) {
countLetter++;
if (countLetter >= 2 && indexContent < lengthContent && this.isNumber(content.charCodeAt(indexContent))) {
numberRandom = content.charCodeAt(indexContent) - 48;
indexRandom = indexContent - 2;
indexContent = 1;
isFindRandom = true;
}
} else {
countLetter = 0;
}
continue;
} else if (indexContent >= indexRandom && indexContent <= indexRandom + 2) {
indexContent++;
continue;
}

if (this.isNumber(character)) {
div = character - 48;
indexContent++;
character = content.charCodeAt(indexContent);
}

mod = this.baseContent.indexOf(String.fromCharCode(character));

if (mod >= 0) {
number = div * lengthBaseContent + mod;
characterBaseString = baseString.charCodeAt(indexBase);
characterBaseNumber = baseNumber.charCodeAt(indexNumber);
character = (number - characterBaseString - characterBaseNumber - numberRandom);
}

newContent += String.fromCharCode(character);
indexContent++;
indexBase = (indexBase + 1) % lengthBaseString;
indexNumber = (indexNumber + 1) % lengthNumber;
}

return newContent;
}

getBaseString(content) {
const length = content.length;
return content.substring(0, length - 8);
}

getBaseNumber(content) {
const length = content.length;
return content.substring(length - 8, length);
}

setBaseInfor(secretKey) {
const LENGTH_BASE_CONTENT = 64;
if (!secretKey) {
return;
}
const length = secretKey.length;
const indexStart = length - LENGTH_BASE_CONTENT;
this.baseContent = secretKey.substring(indexStart + 2, length - 1);
this.baseSecret = secretKey.substring(1, indexStart);
}

isNumber(index) {
return (index >= 48 && index <= 57);
}

isLetter(index) {
return ((index >= 65 && index <= 90) || (index >= 97 && index <= 122));
}
getRandomInt(max) {
return Math.floor(Math.random() * Math.floor(max));
}
}