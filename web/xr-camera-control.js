  
// let baseUrl = 'http://192.168.1.130:8080';

let startX = -200;
let startY = 0;
let startZ = 150;

let pitchFactor = 50;
let yawFactor = 50;
let rollFactor = 0;

let baseUrl = localStorage.getItem('baseUrl');

if(!baseUrl){
    baseUrl = 'http://192.168.1.130:8080';
}

var baseUrlEl = document.querySelector('#baseUrl');
baseUrlEl.value = baseUrl;

getCamera();

baseUrlEl.onchange = function(){
    if(baseUrlEl.value !== baseUrl){
        baseUrl = baseUrlEl.value;
        localStorage.setItem('baseUrl', baseUrl);
        getCamera();
    }
}


var command = {
    // "objectPath" : "/Game/Main.Main:PersistentLevel.VPCineCamera_C_0",
    "objectPath": '',
    "functionName" : "SetActorLocationAndRotation",
    "parameters" : {
        "NewLocation" : {"X" : startX, "Y" : startY, "Z" : startZ}, 
        "NewRotation" : {"Pitch": 0, "Roll": 0, "Yaw": 0},
        "bSweep" : true
    },
    "generateTransaction" : false
};

// XR globals.
let xrButton = document.getElementById('xr-button');
let xrSession = null;
let xrRefSpace = null;

// WebGL scene globals.
let gl = null;

function checkSupportedState() {
  navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
    if (supported) {
      xrButton.innerHTML = 'Enter AR';
    } else {
      xrButton.innerHTML = 'AR not found';
    }

    xrButton.disabled = !supported;
    
  });
}

function initXR() {
  if (!window.isSecureContext) {
    let message = 'WebXR unavailable due to insecure context. Use chrome://flags and enable "Insecure origins treated as secure" entering the web server\'s IP address and port.';
    document.getElementById('output').textContent = message;
  }

  if (navigator.xr) {
    xrButton.addEventListener('click', onButtonClicked);
    navigator.xr.addEventListener('devicechange', checkSupportedState);
    checkSupportedState();
  }

  setInterval(function(){
    sendCommand(command);
  }, 1000/60);

}

function onButtonClicked() {
  if (!xrSession) {
      navigator.xr.requestSession('immersive-ar', {
          domOverlay: {root: document.getElementById('overlay')}
      }).then(onSessionStarted, onRequestSessionError);
  } else {
    xrSession.end();
  }
}

function onSessionStarted(session) {
  xrSession = session;
  xrButton.innerHTML = 'Exit AR';

  session.addEventListener('end', onSessionEnded);
  let canvas = document.createElement('canvas');
  gl = canvas.getContext('webgl', {
    xrCompatible: true
  });
  session.updateRenderState({ baseLayer: new XRWebGLLayer(session, gl) });
  session.requestReferenceSpace('local').then((refSpace) => {
    xrRefSpace = refSpace;
    session.requestAnimationFrame(onXRFrame);
  });
}

function onRequestSessionError(ex) {
  alert('Failed to start immersive AR session.');
  console.error(ex.message);
}

function onEndSession(session) {
  session.end();
}

function onSessionEnded(event) {
  xrSession = null;
  xrButton.innerHTML = 'Enter AR';
  gl = null;
}


function onXRFrame(t, frame) {
  let session = frame.session;
  session.requestAnimationFrame(onXRFrame);
  let pose = frame.getViewerPose(xrRefSpace);

  if (pose) {

    var r = pose.transform.orientation;
    var t = pose.transform.position;

    command.parameters.NewLocation = {
      X: (t.z * -100) + startX,
      Y: (t.x * 100) + startY,
      Z: (t.y * 100) + startZ
    };

    var q = {
      x: r.z,
      y: r.x * -1,
      z: r.y * -1, 
      w: r.w
    };

    var yaw = Math.atan2(2.0*(q.y*q.z + q.w*q.x), q.w*q.w - q.x*q.x - q.y*q.y + q.z*q.z);
    var pitch = Math.asin(-2.0*(q.x*q.z - q.w*q.y));
    var roll = Math.atan2(2.0*(q.x*q.y + q.w*q.z), q.w*q.w + q.x*q.x - q.y*q.y - q.z*q.z);

    command.parameters.NewRotation = {
      "Pitch": - pitch * pitchFactor,
      "Yaw": roll * yawFactor,
      "Roll": yaw * rollFactor
    };

  }
}

function getCamera(){

  let data = JSON.stringify({
    "objectPath" : "/Script/EditorScriptingUtilities.Default__EditorLevelLibrary",
    "functionName":"GetAllLevelActors"
  });

  let xhr2 = new XMLHttpRequest();
  xhr2.open('PUT', baseUrl + '/remote/object/call', true);
  xhr2.setRequestHeader('Content-type','application/json');

  xhr2.onload = function () {
    let jsonObj = JSON.parse(xhr2.responseText);
    if (xhr2.readyState == 4 && xhr2.status == '200') {
      let actors = jsonObj.ReturnValue;

      actors.forEach((actor) => {
        console.log(actor);
        if(actor.indexOf('CineCamera') !== -1){
          command.objectPath = actor;
          document.getElementById('output').innerHTML += "<br>Camera: " + actor.substring(actor.indexOf('Level.') + 6, actor.length);
        }
      });

    }
  }

  xhr2.send(data);

}

function sendCommand(cmd){

  if(cmd.objectPath !== ''){
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', baseUrl + '/remote/object/call', true);
    xhr.setRequestHeader('Content-type','application/json');
    xhr.send(JSON.stringify(cmd));
  }

}

initXR();