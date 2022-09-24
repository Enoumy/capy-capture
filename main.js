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

const buttonsWrapper = document.getElementById("buttons");
buttonsWrapper.classList.toggle("stopped");
setFavicon("📷");

const displayMediaOptions = {
  audio: false,
};

var globalRecorder = null;

async function startCapture() {
  const stream = await navigator.mediaDevices.getDisplayMedia(
    displayMediaOptions
  );
  const recorder = new MediaRecorder(stream);

  const chunks = [];
  recorder.ondataavailable = (e) => chunks.push(e.data);
  recorder.onstop = (_) => {
    const blob = new Blob(chunks, { type: chunks[0].type });
    stream.getVideoTracks()[0].stop();
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
  };

  globalRecorder = recorder;
  buttonsWrapper.classList.toggle("stopped");
  recorder.start();
  setFavicon("🔴");
}

function stopCapture() {
  console.log("Stopping recording!");
  if (globalRecorder) {
    globalRecorder.stop();
  }
}

const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
startButton.addEventListener("click", startCapture, false);
stopButton.addEventListener("click", stopCapture, false);
