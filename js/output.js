var canvas = document.getElementById("canvas");
var leftCWidth = Math.min(maxX, 
    document.getElementById("leftC").clientWidth);
var rightCWidth = Math.min(maxMagWidth, 
    document.getElementById("rightC").clientWidth);
var canvasMag = document.getElementById("canvasMag");
var canvasImg1;
var canvasImg2;
var aRange = document.getElementById("alphaRange"); 
var sRange = document.getElementById("scaleRange"); 
var img1 = new Image();
var img2 = new Image();
var texture1, texture2, maxY, ctx, ctxMag;
var alpha = alphaInit;
var rgt = rgtInit; 

var cornerPoints = [];
// array of points selected by mouse; first entry: image 1, second
// entry: image 2, third entry: iamge 1, ...
var points = [];
var pointsTrans = [];

var mat = mat3.create();
var matPhase1 = mat3.create();
var matPhase0 = mat3.create();
var i1Height;
var i1Width;
var i2Height;
var i2Width;



function saveImg() {   
    var MIME_TYPE = 'image/octet-stream';

    var link1 = document.getElementById("link1");
    var link2 = document.getElementById("link2");
    link1.href = Canvas2Image.convertToImage(canvasImg1, canvasImg1.width, canvasImg1.height, "JPEG").src;
    link2.href = Canvas2Image.convertToImage(canvasImg2, canvasImg2.width, canvasImg2.height, "JPEG").src;

    link1.textContent = 'Download Image 1';
    link2.textContent = 'Download Image 2';
    link1.download = 'Image1.jpg';
    link2.download = 'Image2.jpg';
    link1.dataset.downloadurl = [MIME_TYPE, link1.download, link1.href].join(':');
    link2.dataset.downloadurl = [MIME_TYPE, link2.download, link2.href].join(':');

}

function drawMagni(x, y) {
//    var img;
    ctxMag.clearRect(0,0,img1.width, img1.height);

    if (points.length == 8) {
        var z = canvasImg1.width/20; 
        ctxMag.drawImage(canvasImg1,x-z, y-z, 2*z, 2*z, 0,0,canvasMag.width, canvasMag.height);
        ctxMag.globalAlpha= alpha;
        ctxMag.drawImage(canvasImg2,x-z, y-z, 2*z, 2*z, 0,0,canvasMag.width, canvasMag.height);
        ctxMag.globalAlpha= 1;
    } else if (points.length % 2 == 1) {
        var z = canvasImg1.width/20; 
        ctxMag.strokeStyle = col2;
        ctxMag.drawImage(canvasImg1,x-z, y-z, 2*z, 2*z, 0,0,canvasMag.width, canvasMag.height);
    } else {
        var z = canvasImg2.width/20; 
        ctxMag.strokeStyle = col1;
        ctxMag.drawImage(canvasImg2,x-z, y-z, 2*z, 2*z, 0,0,canvasMag.width, canvasMag.height);
    }

    ctxMag.lineWidth = 3;
    ctxMag.beginPath();
    var c = [canvasMag.width/2, canvasMag.height/2];
    var dIn = 2;
    var dOut = 20;
    ctxMag.moveTo(c[0]-dIn, c[1]);
    ctxMag.lineTo(c[0]-dOut, c[1]);
                                
    ctxMag.moveTo(c[0]+dIn, c[1]);
    ctxMag.lineTo(c[0]+dOut, c[1]);
                                
    ctxMag.moveTo(c[0], c[1]-dIn);
    ctxMag.lineTo(c[0], c[1]-dOut);
                                
    ctxMag.moveTo(c[0], c[1]+dIn);
    ctxMag.lineTo(c[0], c[1]+dOut);

    ctxMag.stroke();

    
}


function drawPoint(c, i) {
    var s;
    var start = 1;
    var end = 10;

    if (i) {
        ctx.strokeStyle = col1;
        s = 1;
    } else {
        ctx.strokeStyle = col2;
        s = -1;
    }
        
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(c[0]+start*s, c[1]+start);
    ctx.lineTo(c[0]+end*s, c[1]+end);
    ctx.moveTo(c[0]+start*s, c[1]-start);
    ctx.lineTo(c[0]+end*s, c[1]-end);
    ctx.stroke();
}
    


function drawPoints() {
    var i;
    for (i = 0; i < points.length; i++) {
        (i % 2 == 0) ? drawPoint(pointsTrans[i], true) : drawPoint(pointsTrans[i], false);
    }
}
    
    
function draw() {
    //var mat = mat3.mul(mat3.create(), matPhase1, matPhase0);
    ctx.clearRect(0,0,img1.width, img1.height);

    canvasImg1.draw(texture1).hueSaturation(0,-rgt);
    appRgt(canvasImg1, -rgt/2);
    canvasImg1.update();
    ctx.drawImage(canvasImg1,0,0, img1.width, img1.height);

    canvasImg2.draw(texture2).hueSaturation(0,-rgt);
    appRgt(canvasImg2, rgt/2);
    if (points.length < 8) {
        canvasImg2.matrixWarp(mat, false, false).update();
    } else {
        canvasImg2.perspective(
            [points[0][0], points[0][1],
            points[2][0], points[2][1],
            points[4][0], points[4][1],
            points[6][0], points[6][1]],
            [points[1][0], points[1][1],
            points[3][0], points[3][1],
            points[5][0], points[5][1],
            points[7][0], points[7][1]]).update();
    }

    ctx.globalAlpha= alpha;
    ctx.drawImage(canvasImg2, 0, 0, img2.width, img2.height);
    ctx.globalAlpha= 1;

    drawPoints();
}
    

function init () {
    // Resize images
    maxY = leftCWidth *
        Math.max(i1Height/i1Width, i2Height/i2Width);

    img1.width = leftCWidth;
    img1.height = maxY;
    img2.width = leftCWidth;
    img2.height = maxY;
    canvas.width = leftCWidth;
    canvas.height = maxY;
    
    ctx = canvas.getContext("2d");

    ctxMag = canvasMag.getContext("2d");
    canvasMag.width = rightCWidth;
    canvasMag.height = rightCWidth;



    // try to create a WebGL canvas (will fail if WebGL isn't supported)
    try {
        canvasImg1 = fx.canvas();
        texture1 = canvasImg1.texture(img1);
        canvasImg2 = fx.canvas();
        texture2 = canvasImg2.texture(img2);
        canvasImg1.width = leftCWidth;
        canvasImg1.height = maxY;
        canvasImg2.width = leftCWidth;
        canvasImg2.height = maxY;
    } catch (e) {
        alert(e);
        return;
    }

    reset();
}


img2.onload = function() {
    i1Height = img1.height;
    i1Width = img1.width;
    i2Height = img2.height;
    i2Width = img2.width;
    
    init();
//    saveImg();
};




img1.src = img1Name;
img2.src = img2Name;
