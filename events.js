// Room events
exports.room_changed = function( data ) {
	console.log( 'room_changed' );
	room_name = data.room.name;
}

exports.registered = function( data ) {
	var user = data.user[0];

	if ( user.userid == config.bot.userid ) {
		return;
	}

	if ( config.rules.pmonjoin.on && room_name ) {
		setTimeout( function() {
			bot.pm( config.rules.pmonjoin.text.replace( '#{room}', room_name ), user.userid );
		}, 1000 );
	}

	if ( !user.registered ) {
		return;
	}

	if ( config.greeting.on ) {
		setTimeout( function() {
			bot.speak( config.greeting.text.replace( '#{user}', '@' + user.name ) );
		}, 1000 );
	}
}

exports.deregistered = function( data ) {
	var user = data.user[0];

	if ( !user.registered ) {
		return;
	}

	if ( config.valediction.on ) {
		bot.speak( config.valediction.text.replace( '#{user}', '@' + user.name ) );
	}
}

exports.booted_user = function( data ) {
	console.log( 'booted_user' );
}

// Chat events
exports.speak = function( data ) {
	console.log( 'speak' );
}

exports.pmmed = function( data ) {
	console.log( 'pmed' );
}

// Song events
exports.no_song = function( data ) {
	console.log( 'no_song' );
}

exports.new_song = function( data ) {
	console.log( 'new_song' );
}

exports.end_song = function( data ) {
	console.log( 'end_song' );
}

// Table events
exports.add_dj = function( data ) {
	console.log( 'add_dj' );
}

exports.remove_dj = function( data ) {
	console.log( 'remove_dj' );
}

exports.escort_dj = function( data ) {
	console.log( 'escort_dj' );
}
