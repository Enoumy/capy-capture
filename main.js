const startElement = document.getElementById("start");
const stopElement = document.getElementById("stop");

const displayMediaOptions = {
    audio: false
}


startElement.addEventListener("click", (_) => {
        console.log("starting capture");
        startCapture();
    }, false);


stopElement.addEventListener("click", (_) => {
        console.log("stopping capture");
        stopCapture();
    }, false);



var outerRecorder = null;

async function startCapture() {
    const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    const recorder = new MediaRecorder(stream);

    const chunks = [];
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = e => {
        const blob = new Blob(chunks, {type : chunks[0].type});
        console.log(blob);
        stream.getVideoTracks()[0].stop();
        let filename = "output.mp4";
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        } else {
            var element = window.document.createElement('a');
            element.href = window.URL.createObjectURL(blob);
            element.download = filename;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    }

    outerRecorder = recorder;
    recorder.start();
}


function stopCapture() {
    outerRecorder.stop();
}

console.log("End of transmission. Don't panic!")
