const dropzone = document.getElementById("dropzone");
const thresholdSlider = document.getElementById("thresholdSlider");
const originalCanvas = document.getElementById("originalCanvas");
const binarizedCanvas = document.getElementById("binarizedCanvas");
const originalCtx = originalCanvas.getContext("2d");
const binarizedCtx = binarizedCanvas.getContext("2d");
let scaleFactor = 0.5;  // Default scale
const scaleSlider = document.getElementById('scaleSlider');

scaleSlider.addEventListener('input', (e) => {
    scaleFactor = scaleSlider.value / 10;  // Convert to a range of 0.1 to 1.0
    console.log(scaleFactor)
    const img = new Image();
    img.src = originalCanvas.toDataURL();
    img.onload = function() {
        binarizeImage(img);
    }
});

dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.style.backgroundColor = "#e0e0e0"; // Highlight the dropzone
});

dropzone.addEventListener("dragleave", () => {
  dropzone.style.backgroundColor = ""; // Reset dropzone color
});

dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.style.backgroundColor = ""; // Reset dropzone color
  const file = e.dataTransfer.files[0];
  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
    originalCanvas.width = img.width;
    originalCanvas.height = img.height;
    binarizedCanvas.width = img.width;
    binarizedCanvas.height = img.height;
    const scaledWidth = img.width * scaleFactor;
    const scaledHeight = img.height * scaleFactor;

// Draw the scaled image to the center of the canvas
    const offsetX = (img.width - scaledWidth) / 2;
    const offsetY = (img.height - scaledHeight) / 2;
    originalCtx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight)

      binarizeImage(img);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

thresholdSlider.addEventListener("input", (e) => {
  const img = new Image();
  img.src = originalCanvas.toDataURL();
  img.onload = function () {
    binarizeImage(img);
  };
});

function binarizeImage(img) {
  const threshold = thresholdSlider.value;

  originalCtx.drawImage(img, 0, 0);
  const imageData = originalCtx.getImageData(0, 0, img.width, img.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const grayscale = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
    const binaryColor = grayscale > threshold ? 255 : 0;
    data[i] = binaryColor;
    data[i + 1] = binaryColor;
    data[i + 2] = binaryColor;
  }

    let textOutput = '';
for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
        const index = (y * img.width + x) * 4;
        const pixelValue = data[index];  // Using red channel as representation
        textOutput += (pixelValue === 255) ? '-' : '*';
    }
    textOutput += '\n';  // Newline for each row
}
    const scaledWidth = img.width * scaleFactor;
    const scaledHeight = img.height * scaleFactor;
 const offsetX = (img.width - scaledWidth) / 2;
    const offsetY = (img.height - scaledHeight) / 2;

document.getElementById('textRepresentation').textContent = textOutput;
binarizedCtx.putImageData(imageData, offsetX, offsetY);

}
