var winston = require( 'winston' );
var logger = new( winston.Logger )({
	transports: [
		new winston.transports.File( {
			level: 'info', // Only write logs of warn level or higher
			filename: './logDir/exceptions.log',
			colorize: true
		} )
    ],
    exitOnError: false
});
module.exports = logger;