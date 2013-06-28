// Room events
exports.room_changed = function( data ) {
	console.log('registered');
	// set globals
	room_name = data.room.name;
	current_song = data.room.metadata.current_song;
	current_dj = data.room.metadata.current_dj;
	_.each( data.room.djids, function(id) {
		djs.push({
			id: id,
			num_songs: 0
		});
	});
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
	var metadata = data.room.metadata,
		current_song = metadata.current_song,
		artist_rules = config.rules.artist,
		table_rules = config.rules.table,
		recent_rules = config.rules.recent;

	// Get song log
	bot.roomInfo( true, function( room_info ) {
		song_log = room_info.room.metadata.songlog;
	});

	if ( table_rules.songs.on ) {
		_.each( djs, function(dj) {
			if ( dj.id == metadata.userid ) {
				// Increase number songs played.
				dj.num_songs++;
			}
		});
	}

	if ( artist_rules.on && !skip_summary ) {
		// Check if artist is in restricted artist
		skip_summary = _.some( artist_rules.restrictedartists, function( restricted_artist ) {
			if ( restricted_artist.toLowerCase().indexOf( current_song.metadata.artist.toLowerCase() ) !== -1 ) {
				// Artist restricted
				// Remove DJ to stop song.
				setTimeout( function() {
					bot.remDj( metadata.current_dj );
				}, 1000 );

				// Tell user that artist is restricted
				bot.getProfile( metadata.current_dj, function ( user ) {
					bot.speak( artist_rules.message.replace( '#{user}', '@' + user.name ) );
				});

				return true;
			}

			return false;
		});
	}

	if ( config.rules.recent.on && !skip_summary ) {
		// Check if song is in song log
		recently_played = _.some( song_log, function( song ) {
			return song._id == current_song._id;
		});

		if ( recently_played ) {
			// Song has been recently played
			skip_summary = true;

			// Remove DJ to stop song
			setTimeout( function() {
				bot.remDj( metadata.current_dj );
			}, 1000 );

			// Tell user that song has been recently played
			bot.getProfile( metadata.current_dj, function ( user ) {
				bot.speak( recent_rules.message.replace( '#{user}', '@' + user.name ) );
			});
		}
	}

	// Update data
	current_song = current_song;
	current_dj = metadata.current_dj;
}

exports.end_song = function( data ) {
	console.log('endsong');
	var metadata = data.room.metadata,
		dj_rules = config.rules.dj,
		table_rules = config.rules.table;

	if ( table_rules.songs.on && _.isEmpty( dj_to_remove) ) {
		// Check if a DJ is over the song limit
		dj_to_remove = _.find( djs, function( dj ) {
			return dj.num_songs >= table_rules.songs.numsongs;
		});

		if ( !_.isEmpty( dj_to_remove ) ) {
			// Remove dj.
			setTimeout( function() {
				skip_summary = true;

				// Remove DJ
				bot.remDj( dj_to_remove.id, function() {
					// Reset DJ to remove
					dj_to_remove = {};
				});
			}, 1000 );

			// Tell user that they reached there song limit
			bot.getProfile( metadata.current_dj, function ( user ) {
				bot.speak( table_rules.songs.message.replace( '#{user}', '@' + user.name ) );
			});
		}
	}

	// If song ended because artist was restircted, do nothing
	if ( skip_summary ) {
		// Reset restriction
		skip_summary = false;

		return;
	}

	// Set current song if not set
	if ( _.isEmpty( current_song ) ) {
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
	current_dj = {};
}

exports.snagged = function( data ) {
	// Increment snags
	snags++;
}

// Table events
exports.add_dj = function( data ) {
	var user = data.user[0],
		dj_rules = config.rules.dj;

	djs.push({
		id: user.userid,
		num_songs: 0
	});

	if ( dj_rules.on ) {
		// If DJ is not in allow DJs then remove
		if ( !_.contains( dj_rules.alloweddjs, user.userid ) ) {
			skip_summary = true; 

			setTimeout( function() { 
				bot.remDj( user.userid );
			}, 1000 );

			// Tell user they are not an allowed dj
			bot.speak( dj_rules.message.replace( '#{user}', '@' + user.name ) );
		}
	}
}

exports.remove_dj = function( data ) {
	var user = data.user[0];

	// Remove user from djs
	djs = _.reject( djs, function( dj ) {
		return dj.id = user.userid;
	});
}

exports.escort_dj = function( data ) {
	console.log( 'escort_dj' );
}