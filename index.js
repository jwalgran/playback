var spawn = require('child_process').spawn;
var events = require('events');
var util = require('util');
var path = require('path');

var Playback = function() {
    var that = this;
    events.EventEmitter.call(this);

    this.runTransportApplescript = function(command, callback) {
        var scriptPath = path.join(__dirname, 'applescripts', 'ITunesTransport.scpt');
        var scriptRunner = spawn('osascript', [scriptPath, command]);
        scriptRunner.stdout.on('data', function (data) {
            var result;
            try {
                result = JSON.parse(data);
            } catch(e) {
                result = data;
            }

            if (command === 'play') {
                that.playing = result;
            }

            if (callback) {
                callback(result);
            } else {
                if (command === 'play') {
                    that.playing = result;
                    that.emit('playing', result);
                } else if (command === 'stop') {
                    that.emit('stopped', result);
                } else if (command === 'pause') {
                    that.emit('paused', result);
                } else if (command === 'currenttrack') {
                    that.emit('playing', result);
                }
            }
        });
    };

    that.playing = null;

    // Poll for changes to the current track
    setInterval(function() {
        that.runTransportApplescript('currenttrack', function(data) {
            if (data || that.playing) {
                var track;
                try {
                    track = JSON.parse(data);
                } catch(e) {
                    track = data;
                }
                if (that.playing && track) {
                    if (track.artist !== that.playing.artist ||
                    track.album !== that.playing.album ||
                    track.name !== that.playing.name ) {
                        that.playing = track;
                        that.emit('playing', track);
                    }
                } else if (that.playing !== track) {
                    that.playing = track;
                    if (track) {
                        that.emit('playing', track);
                    } else {
                        that.emit('paused', track);
                    }
                }
            } else {
                that.playing = null;
            }
        });
    }, 200 );
};
util.inherits(Playback, events.EventEmitter);

Playback.prototype.play = function(callback) {
    this.runTransportApplescript('play', callback);
};

Playback.prototype.pause = function(callback) {
    this.runTransportApplescript('pause', callback);
};

Playback.prototype.stop = function(callback) {
    this.runTransportApplescript('stop', callback);
};

Playback.prototype.currentTrack = function(callback) {
    this.runTransportApplescript('currenttrack', callback);
};

Playback.prototype.next = function(callback) {
    this.runTransportApplescript('next', callback);
};

Playback.prototype.previous = function(callback) {
    this.runTransportApplescript('previous', callback);
};

Playback.prototype.fadeOut = function(callback) {
    this.runTransportApplescript('fadeout', callback);
};

Playback.prototype.fadeIn = function(callback) {
    this.runTransportApplescript('fadein', callback);
};

module.exports = new Playback();
