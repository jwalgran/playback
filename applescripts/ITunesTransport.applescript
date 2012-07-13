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
            return "{\"name\":\"" & trackName & "\",\"artist\":\"" & trackArtist & "\",\"album\":\"" & trackAlbum & "\"}"
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
    else
        return "{\"error\":\"Unsupported command\"}"
    end if
end run