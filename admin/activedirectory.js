var ActiveDirectory = require('activedirectory');
var config = require('../config/config-ldap.json')

var ad = new ActiveDirectory(config);
var username = config.username;
var password = config.password;

var query = 'physicalDeliveryOfficeName=*';
var opts = {
	filter: 'cn=*',
	attributes: ['cn', 'physicalDeliveryOfficeName']
};

ad.authenticate(username, password, function(err, auth) {
	if (err) {
		console.log('ERROR: '+JSON.stringify(err));
		return;
	}

	if (auth) {
		console.log('Authenticated!');
	}

	else {
		console.log('Authentication failed!');
	}
});

ad.findUsers(opts, function(err, users) {
	if (err) {
		console.log('ERROR: ' + JSON.stringify(err));
		return;
	}

	if((! users) || (users.length == 0)) console.log('No users found.');
	else {
		console.log('findUsers: '+JSON.stringify(users));
	}
});




///////////////////
// result: []
///////////////////
// ad.getGroupMembershipForUser(userPrincipalName, function(err, groups) {
// 	if (err) {
// 		console.log('ERROR: ' + JSON.stringify(err));
// 		return;
// 	}

// 	if (! groups) console.log('User: ' + userPrincipalName + ' not found.');
// 	else console.log(JSON.stringify(groups));
// });

// var _ = require('./node_modules/activedirectory/node_modules/underscore');
 
// var opts = {
//   includeMembership : [ 'group', 'user' ], // Optionally can use 'all'
//   includeDeleted : false
// };

// var ad = new ActiveDirectory(config);
// ad.find(query, function(err, results) {
//   if ((err) || (! results)) {
//     console.log('ERROR: ' + JSON.stringify(err));
//     return;
//   }

//   console.log('Groups');
//   _.each(results.groups, function(group) {
//     console.log('  ' + group.cn);
//   });

//   console.log('Users');
//   _.each(results.users, function(user) {
//     console.log('  ' + user.cn);
//   });

//   console.log('Other');
//   _.each(results.other, function(other) {
//     console.log('  ' + other.cn);
//   });
// });
