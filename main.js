const displayMediaOptions = {
  audio: false,
};

var outerRecorder = null;

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
  };

  outerRecorder = recorder;
  recorder.start();
}

function stopCapture() {
  console.log("Stopping recording!");
  outerRecorder.stop();
}

const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
startButton.addEventListener("click", startCapture, false);
stopButton.addEventListener("click", stopCapture, false);

