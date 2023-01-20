let favicon = Object.assign(document.createElement("link"), { rel: "icon" });
document.head.appendChild(favicon);

function createFavicon(c) {
  return (
    "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='1em' font-size='75'>" +
    c +
    "</text></svg>"
  );
}

function setFavicon(c) {
  favicon.setAttribute("href", createFavicon(c));
}


let mediaConstraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 44100
  }
}

async function captureMicrophone() {
  const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
  return stream
}

const buttonsWrapper = document.getElementById("buttons");
buttonsWrapper.classList.toggle("stopped");
setFavicon("📷");

const displayMediaOptions = {
  audio: false,
};

var globalRecorder = null;
var shouldRecordMicrophone = false;

async function startCapture() {
  const shouldRecordMicrophone = document.querySelector('#capture-microphone').checked;
  const screenStream = await navigator.mediaDevices.getDisplayMedia(
    displayMediaOptions
  );

  var stream;
  if (shouldRecordMicrophone) {
    const microphoneStream = await captureMicrophone();
    stream = new MediaStream([...screenStream.getTracks(), ...microphoneStream.getTracks()]);
  } else {
    stream = screenStream;
  }

  const recorder = new MediaRecorder(stream);

  const chunks = [];
  let i = 0;
  recorder.ondataavailable = (e) => {
    console.log("chunk!", ++i);
    chunks.push(e.data);
  };
  function stop() {
    console.log("stop", {actual_chunks : chunks.length, expected_chunks : i});
    const blob = new Blob(chunks, { type: chunks[0].type });
    stream.getVideoTracks()[0].stop();
    if (stream.getAudioTracks().length > 0) {
      stream.getAudioTracks()[0].stop();
    }
    let filename = "output.mp4";
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, filename);
    } else {
      var element = window.document.createElement("a");
      element.href = window.URL.createObjectURL(blob);
      element.download = filename;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
    buttonsWrapper.classList.toggle("stopped");
    setFavicon("📷");
    globalRecorder = null;
  }
  recorder.onstop = (_) => {
    stop();
  };
  stream.getVideoTracks()[0].onended = () => {
    if (recorder.state === "recording") {
      recorder.stop();
    }
  };

  globalRecorder = recorder;
  buttonsWrapper.classList.toggle("stopped");
  recorder.start(100);
  setFavicon("🔴");
}

function stopCapture() {
  if (globalRecorder) {
    globalRecorder.stop();
  }
}

const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
startButton.addEventListener("click", startCapture, false);
stopButton.addEventListener("click", stopCapture, false);



