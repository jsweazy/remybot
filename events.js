// Room events
exports.room_changed = function( data ) {
	console.log('registered');
	// set globals.
	room_name = data.room.name;
	current_song = data.room.metadata.current_song;
	current_dj = data.room.metadata.current_dj;
	djs = data.room.djids;
	song_log = data.room.metadata.songlog;

	// If there are at least 3 upvotes, vote up
	if ( data.room.metadata.upvotes >= 3 ) {
		bot.bop();
	} 
}

exports.registered = function( data ) {
	var user = data.user[0];

	// Dont not go further if user joined is bot
	if ( user.userid == config.bot.userid ) {
		return;
	}

	if ( config.rules.pmonjoin.on && room_name ) {
		// PM user rules/info
		setTimeout( function() {
			bot.pm( config.rules.pmonjoin.text.replace( '#{room}', room_name ), user.userid );
		}, 1000 );
	}

	// Do not go any further if user is guest.
	if ( !user.registered ) {
		return;
	}

	if ( config.greeting.on ) {
		// Greet user
		setTimeout( function() {
			bot.speak( config.greeting.text.replace( '#{user}', '@' + user.name ) );
		}, 1000 );
	}
}

exports.deregistered = function( data ) {
	var user = data.user[0];

	// Do not go any further if user is guest.
	if ( !user.registered ) {
		return;
	}

	if ( config.valediction.on ) {
		// Bid user farewell
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
	// Get song log
	bot.roomInfo( true, function( data ) {
		song_log = data.room.metadata.songlog;
	});

	// Update data
	current_song = data.room.metadata.current_song;
	current_dj = data.room.metadata.current_song;
}

exports.end_song = function( data ) {
	var metadata = data.room.metadata;

	// Do nothing if song is from an allowed dj
	if ( !_.contains( config.rules.dj.alloweddjs, metadata.current_dj ) ) {
		return
	}

	// Set current song if not set.
	if ( !current_song ) {
		current_song = metadata.current_song;
	}

	var summary = '"' + current_song.metadata.song + '" ' +
		'by ' + current_song.metadata.artist + ' summary: ' +
		metadata.upvotes + ' :thumbsup:, ' +
		metadata.downvotes + ' :thumbsdown:, ' +
		snags + ' :heart:';

	// Output song summary
	bot.speak( summary );

	// Reset items
	snags = 0;
	current_song = {};
}

exports.snagged = function( data ) {
	// Increment snags
	snags++;
}

// Table events
exports.add_dj = function( data ) {
	var user = data.user[0],
		dj_rules = config.rules.dj;

	if ( dj_rules.on ) {
		// If DJ is not in allow DJs then remove.
		if ( !_.contains( dj_rules.alloweddjs, user.userid ) ) {
			bot.remDj( user.userid );
			bot.speak( dj_rules.message.replace( '#{user}', '@' + user.name ) );
		}
	}
}

exports.remove_dj = function( data ) {
	console.log( 'remove_dj' );
}

exports.escort_dj = function( data ) {
	console.log( 'escort_dj' );
}