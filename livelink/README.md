# webxr-unreal-cinecam-control livelink

## Control an Unreal Engine CineCamera with WebXR using LiveLink.

This is for **advanced power users** who understand how to compile plugins, use LiveLink, use the command line to run a NodeJS app, etc. Unreal is a convoluted pain in the ass to get set up, so if you can't get this working, I wouldn't be surprised. But all you need is here. If you can figured out a better way to get this all working, please contact me!

Pull Requests Welcome! 


1. Need to install JSONLiveLink-Enhanced from this repo into Unreal
    - https://github.com/clintonman/JSONLiveLink/tree/enhanced
    - You may need to compile this by hand. This is what I ended up having to do (change the dirs, obviously): 
    C:\EpicGames\UE_4.24\Engine\Build\BatchFiles\RunUAT.bat BuildPlugin -Rocket -Plugin=C:\EpicGames\UE_4.24\Engine\Plugins\Animation\JSONLiveLink-enhanced\JSONLiveLink.uplugin -TargetPlatforms=Win64 -Package=C:\Users\russ\Desktop\

2. Need to install NodeJS.

3. Open the Command Prompt to the livelink folder where this readme file is.

3. 'npm install' to get packages (socket.io and express)

4. 'node app.js' to start web and websockets local server which then communicates to Unreal using the plugin above.

5. Add a new LiveLink source from the JSONLiveLink.
    - https://docs.unrealengine.com/en-US/Engine/Animation/LiveLinkPlugin/ConnectingUnrealEngine4toMayawithLiveLink/index.html

6. Use Chrome on Android to get page from local server. 
    - This will add a new LiveLink source. (it won't appear beforehand). 

7. Once the web page is started, it will start streaming location/rotation data via websockets to the local server, which will then post them to Unreal via the JSONLiveLink plugin. The dot will turn green.

8. Add a CineCamera or VPCineCamera to your project

9. Select the camera in the World Outliner, click the "+ Add Component" button and add a new Live Link Controller. Make sure it's all connected.

10. You should now be able to control the camera with the WebXR page on your phone. 

11. If you add a Take to record, make sure you add both the camera and the LiveLink source.

Good luck!

