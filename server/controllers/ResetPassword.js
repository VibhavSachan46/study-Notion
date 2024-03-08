const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

exports.resetPasswordToken = async (req, res) => {
	try {
		// get email from req body
		const email = req.body.email;

		//check user fot this mail, email varification
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.json({
				success: false,
				message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
			});
		}
		const token = crypto.randomBytes(20).toString("hex");

		/// update user by adding token and expiration time
		const updatedDetails = await User.findOneAndUpdate(
			{ email: email },
			{
				token: token,
				resetPasswordExpires: Date.now() + 5*60*1000,
			},
			{ new: true } // updated document return hota hai response me
		);
		console.log("DETAILS", updatedDetails);

		const url = `http://localhost:3000/update-password/${token}`;

		// send mail containing url
		await mailSender(
			email,
			"Password Reset",
			`Your Link for email verification is ${url}. Please click this url to reset your password.`
		);

		// return response
		res.json({
			success: true,
			message:
				"Email Sent Successfully, Please Check Your Email to Continue Further",
		});
	} catch (error) {
		return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Sending the Reset Message`,
		});
	}
};

exports.resetPassword = async (req, res) => {
	try {

		// get password ,confirm password , token from req.body
		const { password, confirmPassword, token } = req.body;

		//validation
		if (confirmPassword !== password) {
			return res.json({
				success: false,
				message: "Password and Confirm Password Does not Match",
			});
		}
		//get user details from db
		const userDetails = await User.findOne({ token: token });
		if (!userDetails) {
			return res.json({
				success: false,
				message: "Token is Invalid",
			});
		}
		// token time check
		if (!(userDetails.resetPasswordExpires > Date.now())) {
			return res.status(403).json({
				success: false,
				message: `Token is Expired, Please Regenerate Your Token`,
			});
		}

		//hash password
		const encryptedPassword = await bcrypt.hash(password, 10);

		//paswword update
		await User.findOneAndUpdate(
			{ token: token },
			{ password: encryptedPassword },
			{ new: true }
		);
		res.json({
			success: true,
			message: `Password Reset Successful`,
		});
	} catch (error) {
		return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Updating the Password`,
		});
	}
};