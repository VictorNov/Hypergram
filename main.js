let fileInput = document.getElementById("file-input");
const image = new Image();
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

fileInput.addEventListener("change", function (ev) {
   if (ev.target.files) {
       let file = ev.target.files[0];
       const reader = new FileReader();
       reader.readAsDataURL(file);
       reader.onloadend = function (e) {
           image.src = e.target.result;
           image.onload = function () {
               canvas.width = image.width;
               canvas.height = image.height;
               ctx.drawImage(image, 0, 0);
           }
       }
   }
});

let Truncate = (x) => {
    if (x <= 0) {
        return 0;
    } else if (x >= 255) {
        return 255;
    } else {
        return x;
    }
}

let brightness = document.getElementById("brightness");
let contrast = document.getElementById("contrast");
let transparent = document.getElementById("transparent");
let download = document.getElementById("save-button");

brightness.addEventListener("change", changeColor);
contrast.addEventListener("change", changeColor);
transparent.addEventListener("change", changeColor);
download.addEventListener("click", downloadImage);

function changeColor() {
    ctx.drawImage(image, 0, 0);
    const b = parseFloat(brightness.value);
    const c = parseFloat(contrast.value);
    const t = parseFloat(transparent.value);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const factor = 259*(255+c)/(255*(259-c));
    for (let i = 0; i < pixels.length; i += 4) {
        pixels[i] = factor * (pixels[i] - 128) + 128;
        pixels[i + 1] = factor * (pixels[i + 1] - 128) + 128;
        pixels[i + 2] = factor * (pixels[i + 2] - 128) + 128;
        pixels[i] = Truncate(pixels[i] + b);
        pixels[i + 1] = Truncate(pixels[i + 1] + b);
        pixels[i + 2] = Truncate(pixels[i + 2] + b);
        pixels[i + 3] = pixels[i + 3] * t;
    }
    ctx.putImageData(imageData, 0, 0);
}

function downloadImage() {
    const image = canvas.toDataURL("image/png");

    let tmpLink = document.createElement("a");
    tmpLink.download = 'result';
    tmpLink.href = image;

    document.body.appendChild(tmpLink);
    tmpLink.click();
    document.body.removeChild(tmpLink);
}