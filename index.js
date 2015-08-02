var spawn = require('child_process').spawn;
var events = require('events');
var util = require('util');
var path = require('path');

var Playback = function(opts) {
    opts = opts||{};
    if(typeof opts.fetchArtwork !== 'boolean'){
      opts.fetchArtwork = false;
    }
    var that = this;
    events.EventEmitter.call(this);

    this.isWindows = !!process.platform.match(/^win/);

    this.runTransportScript = function(command, callback) {
        var scriptPath = this.isWindows ?
            path.join(__dirname, 'windows_scripts', 'iTunes.js') :
            path.join(__dirname, 'applescripts', 'ITunesTransport.scpt');
        var scriptRunner = this.isWindows ?
            spawn('cscript', ['//Nologo', scriptPath, command]) :
            spawn('osascript', [scriptPath, command]);
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
                   playing(result);
                }
            }
        });
    };
    that.playing = null;

    function playing(track){

        //if we dont want the artwork, just send the track data immediately
        if(!opts.fetchArtwork){
            that.emit('playing', track);
            return;
        }

        //otherwise receive chunks of the file and send the whole image
        //once we have all the parts as a field called 'art' that is base64
        var file = "";
        function emitFile(){
            var f = file.substring(10,file.length-2)
            track.art = 'data:image/jpeg;base64,'+ new Buffer(f,"hex").toString('base64');
            that.emit('playing', track);
        }

        that.runTransportScript('art', function(data) {
            var d = data.toString();
            file+=d;
            if(d.indexOf("»") !== -1){
              emitFile();
            }
        });
    }

    // Poll for changes to the current track
    setInterval(function() {
        that.runTransportScript('currenttrack', function(data) {
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
                        playing(track);
                    }
                } else if (that.playing !== track) {
                    that.playing = track;
                    if (track) {
                        playing(track);
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
    this.runTransportScript('play', callback);
};

Playback.prototype.pause = function(callback) {
    this.runTransportScript('pause', callback);
};

Playback.prototype.stop = function(callback) {
    this.runTransportScript('stop', callback);
};

Playback.prototype.currentTrack = function(callback) {
    this.runTransportScript('currenttrack', callback);
};

Playback.prototype.next = function(callback) {
    this.runTransportScript('next', callback);
};

Playback.prototype.previous = function(callback) {
    this.runTransportScript('previous', callback);
};

Playback.prototype.fadeOut = function(callback) {
    this.runTransportScript('fadeout', callback);
};

Playback.prototype.fadeIn = function(callback) {
    this.runTransportScript('fadein', callback);
};

Playback.prototype.setVolume = function(volume, callback) {
    this.runTransportScript('setvolume ' + volume, callback);
};

module.exports = function(opts){
    return new Playback(opts);
};
