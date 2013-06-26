// Room events
exports.room_changed = function( data ) {
	console.log( 'room_changed' );
}

exports.registered = function( data ) {
	var name = data.user[0].name,
		user_id = data.user[0].userid;

	if ( user_id == config.bot.userid && name.toLowerCase() != 'guest' ) {
		return;
	}

	if ( config.greeting.on ) {
		bot.speak( config.greeting.text.replace( '#{user}', '@' + name ) );
	}
}

exports.deregistered = function( data ) {
	var name = data.user[0].name;

	if ( name.toLowerCase() != 'guest' ) {
		return;
	}

	if ( config.valediction.on ) {
		bot.speak( config.valediction.text.replace( '#{user}', '@' + name ) );
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
