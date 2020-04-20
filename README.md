# webxr-unreal-cinecam-control

## Control an Unreal Engine CineCam with WebXR 

This uses Unreal's [Web Remote Control](https://docs.unrealengine.com/en-US/Engine/Editor/ScriptingAndAutomation/WebControl/index.html) to control a CineCamera position. 


To Run:

1. Start Unreal Project
    - Make sure there's at least one CineCamera or VPCineCamera in your project. It will use the first one it finds.

2. Turn on WebControl in Unreal:
    - Window -> Developer Tools -> Output Log
    - In the Cmd window enter: WebControl.StartServer

3. Use Chrome for Android to load web/index.html from an https website.
    - See instructions below to use via local web server.

4. In the "WebXR Camera Control" web page, enter the IP address of computer where Unreal is running with port 8080.
    - Example: http://192.168.1.119:8080

5. Tap "Enter AR"




To Run locally: 

1. Install web server: Example: 
    - Install Node (http://nodejs.org) if not installed, 
    - Open Command Prompt 
        - npm -g install serve
        - cd to project's web directory
        - serve . 
    - Server is running on port 5000 by default.

2. Enable Local XR in Chrome for Android:
    - Start Chrome
    - Enter chrome://flags
    - Search for "Insecure origins treated as secure"
    - Enter current IP address with port 5000. Example: http://192.168.1.119:5000
    - Relaunch Chrome

3. Load web page from computer's IP address above.
    - Example: http://192.168.1.119:5000




To use the Live Link server, see the /livelink directory. It's complicated.


Check out this YouTube video to see it in action: 


Forum post: 

Pull Requests welcome!

