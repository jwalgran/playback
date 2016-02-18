property ApplicationLib : load script POSIX file "ApplicationLib.scpt"

on IsRunning()
    tell ApplicationLib
        return ApplicationIsRunning("iTunes")
    end tell
end IsRunning

on IsPlaying()
    tell ApplicationLib
        if ApplicationIsRunning("iTunes") then
            tell application "iTunes"
                return player state is playing
            end tell
        else
            return false
        end if
    end tell
end IsPlaying

on GetCurrentTrack()
    if IsPlaying() then
        tell application "iTunes"
            if not (exists current track) then return null
            set trackName to (get name of current track)
            set trackArtist to (get artist of current track)
            set trackAlbum to (get album of current track)
            set trackDuration to (get duration of current track)
            return "{\"name\":\"" & trackName & "\",\"artist\":\"" & trackArtist & "\",\"album\":\"" & trackAlbum & "\",\"duration\":\"" & trackDuration & "\"}"
        end tell
    else
        return "null"
    end if
end GetCurrentTrack

on PausePlaying()
    if IsRunning() then
        tell application "iTunes"
            pause
        end tell
    end if
    return "{\"ok\":true}"
end PausePlaying

on StartPlaying()
    tell application "iTunes"
        launch
        play
    end tell
    return GetCurrentTrack()
end StartPlaying

on StopPlaying()
    if IsRunning() then
        tell application "iTunes" to stop
    end if
    return "{\"ok\":true}"
end StopPlaying

on PlayNextTrack()
    if not IsRunning() then
        tell application "iTunes"
            activate
        end tell
    end if
    tell application "iTunes"
        next track
    end tell
    StartPlaying()
end PlayNextTrack

on PlayPreviousTrack()
    if not IsRunning() then
        tell application "iTunes"
            activate
        end tell
    end if
    tell application "iTunes"
        previous track
    end tell
    StartPlaying()
end PlayPreviousTrack

on FadeOut()
    if IsRunning() and IsPlaying()
        tell application "iTunes"
            set originalVol to sound volume
            set currentVol to sound volume
            repeat with currentVol from sound volume to 0 by -1
                set sound volume to currentVol
                delay 0.02
            end repeat
        end tell
        StopPlaying()
        tell application "iTunes"
            set sound volume to originalVol
        end tell
    end if
end FadeOut

on FadeIn()
    if not IsRunning() then
        tell application "iTunes"
            activate
        end tell
    end if
    if not IsPlaying() then
        tell application "iTunes"
            set originalVol to sound volume
            set currentVol to 0
            set sound volume to 0
            play
            repeat with currentVol from 0 to originalVol by 1
                set sound volume to currentVol
                delay 0.02
            end repeat
        end tell
        return GetCurrentTrack()
    end if
end FadeIn

on run argv
    set command to item 1 of argv
    if command is "currenttrack" then
        return GetCurrentTrack()
    else if command is "play"
        StartPlaying()
    else if command is "pause"
        PausePlaying()
    else if command is "stop"
        StopPlaying()
    else if command is "next"
        PlayNextTrack()
    else if command is "previous"
        PlayPreviousTrack()
    else if command is "fadeout"
        FadeOut()
    else if command is "fadein"
        FadeIn()
    else
        return "{\"error\":\"Unsupported command\"}"
    end if
end run