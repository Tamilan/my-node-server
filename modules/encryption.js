'use strict';

const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.ENC_KEY; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text) {
	let iv = crypto.randomBytes(IV_LENGTH);
	let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
	let encrypted = cipher.update(text);

	encrypted = Buffer.concat([encrypted, cipher.final()]);

	return iv.toString('hex') + '.' + encrypted.toString('hex');
}

function decrypt(text) {
	let text_parts = text.split('.');
	let iv = Buffer.from(text_parts.shift(), 'hex');
	let encrypted_text = Buffer.from(text_parts.join('.'), 'hex');
	let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
	let decrypted = decipher.update(encrypted_text);

	decrypted = Buffer.concat([decrypted, decipher.final()]);

	return decrypted.toString();
}

module.exports = { decrypt, encrypt };