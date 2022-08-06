/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable spellcheck/spell-checker */
function resetPassword(email, userType, env) {
	// $(".loader-wrapper").show();
	console.log("check erorr sad asasd", email, baseUrl);
	var newPassword = $("#newPassword").val();
	var confirmPassword = $("#confirmPassword").val();
	var token = $("#token").val();
	//var regexTest = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/g;
	var regexTest = /^\S*$/g;
	if (!newPassword) {
		$("#confirmPasswordErrDiv").html("");
		$("#newPasswordErrDiv").show().html("New Password is required");
		return false;
	} else if (!newPassword.match(regexTest)) {
		$("#confirmPasswordErrDiv").html("");
		$("#newPasswordErrDiv").show().html("New Password should not allows blank spaces. Please enter a valid password").css("color", "red");
		return false;
	} else if (newPassword.length < 8 || newPassword.length > 16) {
		$("#confirmPasswordErrDiv").html("");
		$("#newPasswordErrDiv").show().html("New Password should be between 8 to 16 characters").css("color", "red");
		return false;
	} else if (!confirmPassword) {
		$("#newPasswordErrDiv").html("");
		$("#confirmPasswordErrDiv").show().html("Confirm Password is required").css("color", "red");
		return false;
	} else if (confirmPassword.length < 8 || confirmPassword.length > 16) {
		$("#newPasswordErrDiv").html("");
		$("#confirmPasswordErrDiv").show().html("Confirm Password should be a minimum of 8 characters and a maximum of 16 characters").css("color", "red");
		return false;
	} else if (newPassword != confirmPassword) {
		$("#confirmPasswordErrDiv").show().html("");
		$("#newPasswordErrDiv").show().html("New Password and Confirm Password do not match").css("color", "red");
		return false;
	} else {
		$("#newPasswordErrDiv").show().html("");
		$("#confirmPasswordErrDiv").show().html("");
		// var accessToken="bearer "+localStorage.getItem("accessTokenAdmin");
		var url = baseUrl + "";
		if (userType == "admin") {
			url = baseUrlAdmin + "admin/v1/admin/reset-password";
			// url = "http://localhost:3000" + '/api/v1/admin/admins/resetNewPassword';
		}
		if (userType == "user") {
			url = baseUrl + "api/v1/user/resetEmailPassword";
		}
		var data = {
			email: email,
			newPassword: newPassword,
			token: token
		};
		$.ajax({
			type: "PUT",
			url: url,
			data: data,
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				console.log("errorrrrr -----");
				if ((XMLHttpRequest) && (XMLHttpRequest.responseJSON) && (XMLHttpRequest.responseJSON.message)) {
					$("#confirmPasswordErrDiv").html(XMLHttpRequest.responseJSON.message).css("color", "red");
				} else {
					$("#confirmPasswordErrDiv").html("Something went wrong!").css("color", "red");
				}
				console.log("window.location.hrefwindow.location.href .....", window.location.href);
			},
			success: function (data) {
				if (userType == "admin") {
					location.href = baseUrlAdmin + "admin/v1/admin/password-success";
				} else {
					location.href = baseUrl + "api/v1/user/passwordSuccess";
				}
			}
		});
	}
}