// Includes
global.Bot = require( 'ttapi' );
global.config = require( './config.json' );
global.events = require( './events.js' );

// Globals
global.room_name;
global.current_song;
global.current_dj;
global.djs;
global.song_log;
global.snags = 0;

// Start bot
global.bot = new Bot( config.bot.auth, config.bot.userid, config.roomid );

// Room listeners
bot.on( 'roomChanged', events.room_changed );
bot.on( 'registered', events.registered );
bot.on( 'deregistered', events.deregistered );
bot.on( 'booted_user', events.booted_user );

// Chat listeners
bot.on( 'speak', events.speak );
bot.on( 'pmmed', events.pmmed );

// Song listeners
bot.on( 'nosong', events.no_song );
bot.on( 'newsong', events.new_song );
bot.on( 'endsong', events.end_song );
bot.on( 'snagged', events.snagged );

// Table listeners
bot.on( 'add_dj', events.add_dj );
bot.on( 'rem_dj', events.remove_dj );
bot.on( 'escort', events.escort_dj );