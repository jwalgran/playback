function IsRunning () {
  ObjC.import('stdlib')
  ObjC.import('AppKit')
  var isRunning = false
  var apps = $.NSWorkspace.sharedWorkspace.runningApplications
  apps = ObjC.unwrap(apps)
  var app
  for (var i = 0, j = apps.length; i < j; i++) {
    app = apps[i]
    if (typeof app.bundleIdentifier.isEqualToString === 'undefined') {
      continue;
    }
    if (app.bundleIdentifier.isEqualToString('com.apple.iTunes')) {
      isRunning = true;
      break;
    }
  }
  return isRunning
}

function IsPlaying() {
  if (IsRunning()) {
    return Application('iTunes').playerState() === 'playing'
  }
  return false
}

function GetCurrentTrack() {
  if (!IsPlaying()) {
    return null
  }
  var iTunes = Application('iTunes')
  var track = iTunes.currentTrack
  return JSON.stringify({
    name: track.name(),
    artist: track.artist(),
    album: track.album()
  })
}

function PausePlaying() {
  if (!IsRunning) {
    Application('iTunes').pause()
  }
  return JSON.stringify({ok: true})
}

function StartPlaying() {
  var iTunes = Application('iTunes')
  iTunes.launch()
  iTunes.play()
  return GetCurrentTrack()
}

function StopPlaying() {
  if (IsRunning()) {
    Application('iTunes').stop()
  }
  return JSON.stringify({ok: true})
}

function PlayNextTrack() {
  var iTunes = Application('iTunes')
  if (!IsRunning()) {
    iTunes.activate()
  }
  iTunes.nextTrack()
  StartPlaying()
}

function PlayPreviousTrack() {
  var iTunes = Application('iTunes')
  if (!IsRunning()) {
    iTunes.activate()
  }
  iTunes.previousTrack()
  StartPlaying()
}

function FadeOut () {
  if (IsRunning() && IsPlaying()) {
    var iTunes = Application('iTunes')
    var originalVol = iTunes.soundVolume()
    var currentVol = iTunes.soundVolume()
    while(currentVol > 0) {
      currentVol--
      iTunes.soundVolume = currentVol
      delay(0.02)
    }
    StopPlaying()
    iTunes.soundVolume = originalVol
  }
}

function FadeIn () {
  var iTunes = Application('iTunes')
  if (!IsRunning()) {
    iTunes.activate()
  }
  if (!IsPlaying()) {
    var originalVol = iTunes.soundVolume()
    var currentVol = 0
    iTunes.soundVolume = currentVol
    iTunes.play()
    while(currentVol < originalVol) {
      currentVol++
      iTunes.soundVolume = currentVol
      delay(0.02)
    }
    return GetCurrentTrack()
  }
}

function run(argv) {
  var command = argv[0]
  if (command === "currenttrack") {
    return GetCurrentTrack()
  } else if( command === "play") {
    return StartPlaying()
  } else if( command === "pause") {
    return PausePlaying()
  } else if( command === "stop") {
    return StopPlaying()
  } else if( command === "next") {
    return PlayNextTrack()
  } else if( command === "previous") {
    return PlayPreviousTrack()
  } else if( command === "fadeout") {
    return FadeOut()
  } else if( command === "fadein") {
    return FadeIn()
  } else {
    return JSON.stringify({error: 'this command is not supported'})
  }
}
