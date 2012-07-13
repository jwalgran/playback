on ApplicationIsRunning(appName)
    tell application "System Events" to set appNameIsRunning to exists (processes where name is appName)
    return appNameIsRunning
end ApplicationIsRunning