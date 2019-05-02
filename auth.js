const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.authenticate = (email, password) => {
	return new Promise(async (resolve, reject) => {
		try {
			//Get user By Email
			const user = await User.findOne({ email });

			//match password
			bcrypt.compare(password, user.password, (err, isMatch) => {
				if (err) throw err;
				if (isMatch) {
					resolve(user);
				} else {
					//Password didnt match
					reject('Authentication Failed');
				}
			});
		} catch (err) {
			//email not fount
			reject('Authentication Failed');
		}
	});
};
