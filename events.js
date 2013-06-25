// Room events
exports.room_changed = function( data ) {
	console.log( 'room_changed' );
}
exports.register = function( data ) {
	console.log( 'register' );
}
exports.deregister = function( data ) {
	console.log( 'deregister' );
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
