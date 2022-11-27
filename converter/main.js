const convertButton = document.getElementById("convert-button");
const urlTextBox = document.getElementById("url-text-box");


function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL("image/png");
}


function startConversion() {
    const url = urlTextBox.value;
    const resultsDiv = document.getElementById("results");
    const imageElement = document.createElement('img');
    imageElement.src = url;
    imageElement.crossOrigin = "anonymous"
    imageElement.classList.add("image-preview");
    resultsDiv.replaceChildren(imageElement);
    setTimeout(() => {
      const didImageLoadCorrectlyish = imageElement.complete && imageElement.naturalHeight !== 0
      if (didImageLoadCorrectlyish) {
        const element = document.createElement("button");
        element.replaceChildren("Copy converted URL!");
        const base64Url = getBase64Image(imageElement);
        element.href = base64Url;
        resultsDiv.prepend(element);
        element.addEventListener("click", () => {
          navigator.clipboard.writeText(base64Url);
        }, false);
      } else {
        const element = document.createElement("div");
        element.classList.add("error");
        element.replaceChildren("Whoops! Unable to find image!");
        resultsDiv.prepend(element);
      }
    }, 2000);
}


convertButton.addEventListener("click", startConversion, false);
