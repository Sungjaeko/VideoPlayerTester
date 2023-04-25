// Canvas Screenshot Function
export function canvasCapture(canvas, ctx, playerRef) {
  //let video = document.getElementById("videoSource");
  console.log(playerRef.current);
  let video = playerRef.current.player.player.player;
  //let w = video.videoWidth;
  //let h = video.videoHeight;
  let w = 200;
  let h = 200;
  //canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  //var ctx = canvas.getContext("2d");
  //ctx.drawImage(video, 0, 0, w - imageWidth, h - imageHeight);
  ctx.drawImage(video, 0, 0, 200, 200);
  //let cloneHolder = cloneCanvas(canvas);
  //document.body.appendChild(canvas);
  document.getElementById("screenshot").appendChild(canvas);
  return canvas;
}

// canvas cloning for screenshot function
// function cloneCanvas(oldCanvas) {
//   //create a new canvas
//   var newCanvas = document.createElement("canvas");
//   var context = newCanvas.getContext("2d");

//   //set dimensions
//   newCanvas.width = oldCanvas.width;
//   newCanvas.height = oldCanvas.height;

//   //apply the old canvas to the new one
//   context.drawImage(oldCanvas, 0, 0);

//   //return the new canvas
//   return newCanvas;
// }

// canvas Downloading
export function canvasDownload(canvas, ctx) {
  let image = new Image();
  image.crossOrigin = "anonymous";
  image.onload = function () {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    canvas.toDataURL("image/png", 1.0);
    console.log(".onload");
  };
  image.src = "http://localhost:3000/img";
  // console.log(cloneCanvas(canvas).toDataURL());
  // var canvasCloneHolder = cloneCanvas(canvas);
  var imageExport = canvas
    .toDataURL("image/png", 1.0)
    .replace("image/png", "image/octet-stream");
  var link = document.createElement("a");
  link.download = "my-image.png";
  link.href = imageExport;
  link.click();
}
