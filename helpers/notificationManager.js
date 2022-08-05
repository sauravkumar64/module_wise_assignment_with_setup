var FCM = require("fcm-node");
var serverKey = "xyz";
var fcm = new FCM(serverKey);
var sendNotification = (data, deviceTokensArr, deviceType) => {
	if (deviceType == "ANDROID") {
		sendNotificationAndroid(data, deviceTokensArr);
	}
	else if (deviceType == "IOS") {
		sendNotificationIos(data, deviceTokensArr);
	}
	else {
		console.log("--inside all--");
		sendNotificationAll(data, deviceTokensArr);
	}
};
/*******
* @function sendPushNotificationAndroid
* @description Used to send the push notifications to the device 
********/
var sendNotificationAndroid = async (data, deviceTokensArr) => {
	let token;
	for (let i = 0; i < deviceTokensArr.length; i++) {
		if (deviceTokensArr[i] != null) {
			token = deviceTokensArr[i];
			var message = {
				to: token,
				collapse_key: "your_collapse_key",
				priority: "high",
				notification: {
					title: data.title,
					body: data.message,
					sound: "default",
					badge: 1,
					id: data.id,
				},
				data: data,
			};
			fcm.send(message, function (err, response) {
				if (err) {
					console.log("push error: ", err, "\nfor token: ", token);
				} else {
					console.log("Successfully sent with response: backend ", response, "\nfor token: " , token);
				}
			});
		}
	}
};
var sendNotificationIos = async (data, deviceTokensArr) => {
	let token;
	for (let i = 0; i < deviceTokensArr.length; i++) {
		if (deviceTokensArr[i] != null) {
			token = deviceTokensArr[i];
			var message = {
				to: token,
				collapse_key: "your_collapse_key",
				priority: "high",
				notification: {
					title: data.title,
					body: data.message,
					sound: "default",
					badge: 1,
					id: data.id,
				},
				data: data,
			};
			fcm.send(message, function (err, response) {
				if (err) {
					console.log("push error: ", err, "\nfor token: ", token);
				} else {
					console.log("Successfully sent with response: backend ", response, "\nand for token: " , token);
				}
			});
		}
	}
};
var sendNotificationAll = async (data, deviceTokensArr) => {
	let token;
	for (let i = 0; i < deviceTokensArr.length; i++) {
		if (deviceTokensArr[i] != null) {
			token = deviceTokensArr[i];
			var message = {
				to: token,
				collapse_key: "your_collapse_key",
				priority: "high",
				notification: {
					title: data.title,
					body: data.message,
					sound: "default",
					badge: 1,
					id: data.id,
				},
				data: data,
			};
			fcm.send(message, function (err, response) {
				if (err) {
					console.log("push error: ", err, "\nfor token: ", token);
				} else {
					console.log("Successfully sent with response: backend ", response, "\nand for token: " , token);
				}
			});
		}
	}
};
module.exports = {
	sendNotificationAndroid: sendNotificationAndroid,
	sendNotificationIos: sendNotificationIos,
	sendNotification: sendNotification
};