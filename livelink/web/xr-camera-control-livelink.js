      
var socket = io();

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
    let message = "WebXR unavailable due to insecure context. Use chrome://flags and enable 'Insecure origins treated as secure' entering this computer's IP address.";
    document.getElementById("warning").innerText = message;
  }

  if (navigator.xr) {
    xrButton.addEventListener('click', onButtonClicked);
    navigator.xr.addEventListener('devicechange', checkSupportedState);
    checkSupportedState();
  }

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
  alert("Failed to start immersive AR session.");
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

    socket.emit('message', {r: [ r.z, r.x * -1, r.y * -1, r.w], t: [t.z * -100, t.x * 100, t.y * 100] } );

  }
}


initXR();