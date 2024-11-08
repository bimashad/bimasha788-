// Toggle Section Display
function showSection(section) {
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(sec => sec.classList.remove('active'));
  document.getElementById(section).classList.add('active');
}

// Photo Upload and Preview
let uploadedImage;
function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (file.type.startsWith("image")) {
    uploadedImage = file;
    previewImage(file);
  }
}

function previewImage(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const image = document.getElementById("imagePreview");
    image.src = e.target.result;
    document.getElementById("photoEditing").style.display = "block";
  };
  reader.readAsDataURL(file);
}

// Adjust Image with Range Inputs
function adjustImage() {
  const image = document.getElementById("imagePreview");
  const brightness = document.getElementById("brightness").value;
  const contrast = document.getElementById("contrast").value;
  const saturation = document.getElementById("saturation").value;
  
  image.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
}

// Apply Filters
function applyFilter(filter) {
  const image = document.getElementById("imagePreview");
  switch (filter) {
    case 'grayscale':
      image.style.filter = 'grayscale(100%)';
      break;
    case 'sepia':
      image.style.filter = 'sepia(100%)';
      break;
    case 'invert':
      image.style.filter = 'invert(100%)';
      break;
    case 'blur':
      image.style.filter = 'blur(5px)';
      break;
  }
}

// Rotate Image
function rotateImage() {
  const image = document.getElementById("imagePreview");
  let rotation = image.style.transform || 'rotate(0deg)';
  const newRotation = parseInt(rotation.replace('rotate(', '').replace('deg)', '')) + 90;
  image.style.transform = `rotate(${newRotation}deg)`;
}

// Reset Image
function resetImage() {
  const image = document.getElementById("imagePreview");
  image.style.transform = 'rotate(0deg)';
  image.style.filter = 'none';
  document.getElementById("brightness").value = 100;
  document.getElementById("contrast").value = 100;
  document.getElementById("saturation").value = 100;
}

// Save Edited Image
function saveImage() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const image = document.getElementById("imagePreview");
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
  canvas.toBlob(function(blob) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "edited-image.png";
    link.click();
  });
}

// Photo to PDF Conversion
function handlePhotoToPdfUpload(event) {
  const file = event.target.files[0];
  if (file.type.startsWith("image")) {
    uploadedImage = file;
  }
}

function convertImageToPdf() {
  if (!uploadedImage) {
    alert("Please upload an image first!");
    return;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const image = document.getElementById("imagePreview");
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  const pdfDoc = PDFLib.PDFDocument.create();
  const page = pdfDoc.addPage([canvas.width, canvas.height]);
  const pngImage = pdfDoc.embedPng(canvas.toDataURL());
  page.drawImage(pngImage, { x: 0, y: 0 });

  pdfDoc.save().then((pdfBytes) => {
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "image-to-pdf.pdf";
    link.click();
  });
}
