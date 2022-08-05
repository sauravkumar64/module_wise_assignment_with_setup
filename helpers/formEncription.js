const crypto = require("crypto");
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

module.exports = {
	decryptString: async (text) => {
		let iv = Buffer.from(text.iv, "hex");
		let encryptedText = Buffer.from(text.encryptedData, "hex");
		let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
		let decrypted = decipher.update(encryptedText);
		decrypted = Buffer.concat([decrypted, decipher.final()]);
		return decrypted.toString();
	},
	encryptString: async (text) => {
		let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
		let encrypted = cipher.update(text);
		encrypted = Buffer.concat([encrypted, cipher.final()]);
		return encrypted.toString("hex");
	},
	encryptJson: async (text) => {
		let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
		let encrypted = cipher.update(JSON.stringify(text));
		encrypted = Buffer.concat([encrypted, cipher.final()]);
		return  encrypted.toString("hex") ;
	},
	
};
