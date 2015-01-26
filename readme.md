# playback

Control the iTunes transport on OS X and Windows and receive track change events

# example

If you are in public, plug in some headphones or lower your volume, then:

    var itunes = require('playback');
    itunes.on('playing', function(data){ console.dir(data);} );
    itunes.on('paused', function(data){ console.log('paused');} );
    itunes.play();

Pause, play, and change tracks in iTunes and watch the Node console.

# methods

    var itunes = require('playback')

## itunes.play([callback])

Start playing the current track. If `callback` is not defined emits a `playing` event with an object argument representing the current track:

    {
        name: 'Dance Yrself Clean',
        artist: 'LCD Soundsystem',
        album: 'This Is Happening'
    }

If `callback` is defined it is called with the same object.

## itunes.pause([callback])

Pause playback. If `callback` is not defined emits a `paused` event with the following object:

    { ok: "true" }

If `callback` is defined it is called with the same object.

## itunes.stop([callback])

Stop playback. If `callback` is not defined  emits a `stopped` event with the following object:

    { ok: "true" }

If `callback` is defined it is called with the same object.

## itunes.currentTrack([callback])

Get information about the currently playing track. If `callback` is not defined emits a `playing` event with an object argument representing the current track:

    {
        name: 'Lizzy',
        artist: 'Melvins',
        album: 'Houdini'
    }

If `callback` is defined it is called with the same object.

## itunes.next([callback])

Skip to the next song in the current playlist. Start playing if iTunes is paused or stopped. If `callback` is not defined emits a `playing` event with an object argument representing the current track:

    {
        name: 'Going Blind',
        artist: 'Melvins',
        album: 'Houdini'
    }

If `callback` is defined it is called with the same object.

## itunes.previous([callback])

Skip to the previous song in the current playlist. Start playing if iTunes is paused or stopped. If `callback` is not defined emits a `playing` event with an object argument representing the current track:

    {
        name: 'Night Goat',
        artist: 'Melvins',
        album: 'Houdini'
    }

If `callback` is defined it is called with the same object.

## itunes.fadeOut([callback])

Slowly decrease the iTunes volume to zero, stop playback, then return the volume to the level at which it was set before the fade out began.

## itunes.fadeIn([callback])

Set the iTunes volume to zero, start playback, then slowly return the volume to the original level.

# install

With [npm](https://npmjs.org) do:

    npm install playback

# release notes

## 0.2.0

Add ``setVolume`` command (Windows only)

## 0.1.0

Windows support

## 0.0.1

Initial release
