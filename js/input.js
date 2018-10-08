
// Alpha Slider
var alphaV = document.getElementById("alphaV");
var slider = document.getElementById("alphaRange");
alphaV.innerHTML = slider.value; 
alpha = slider.value;
slider.oninput = function() {
    alphaV.innerHTML = this.value;
    alpha = this.value;
    draw();
}


// Rgt Slider
var rgtV = document.getElementById("rgtV");
var slider = document.getElementById("rgtRange");
rgtV.innerHTML = slider.value; 
rgt = slider.value;
slider.oninput = function() {
    rgtV.innerHTML = this.value;
    rgt = this.value;
    draw();
}


// mouse funcionality
var mouseDown = false;
var mousePosOld = null;
var marking = true;
var nIdx = -1;
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return vec2.fromValues((evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height);
}


document.getElementById('fi1').onchange = function (e) {
    loadImage(
    e.target.files[0],
    function (img) {
        i1Width = img.width;
        i1Height = img.height;
        img1 = img;
        init();
    },
    );
};

document.getElementById('fi2').onchange = function (e) {
    loadImage(
    e.target.files[0],
    function (img) {
        i2Width = img.width;
        i2Height = img.height;
        
        img2 = img;
        init();
    },
    );
};


function mouse_action(event, clicked) {
    var mousePos = getMousePos(canvas, event);

    if (clicked == 1) {
        mouseDown = true;
        mousePosOld = getMousePos(canvas, event); 
        if (marking) {
            points.push(mousePos);
            pointsTrans.push(vec2.clone(mousePos));
            if (points.length == 2) {
                phase0();
            } else if (points.length == 4) {
                phase1();
            } else if (points.length == 6) {
        //        phase2();
            } else if (points.length == 8 && marking) {
                marking = false;
                phase3();
            }
            draw()
        } else {
            nIdx = getNIdx(mousePos, points, 2);
        }
    } else if ( clicked == 0 ) {
        drawMagni(mousePos[0], mousePos[1]);
        if (!marking && mouseDown) {
            var diff = vec2.sub(vec2.create(), mousePosOld, mousePos);
            vec2.scale(diff, diff, mouseScale);
            vec2.add(points[nIdx], points[nIdx], diff);
            vec2.add(pointsTrans[nIdx], pointsTrans[nIdx], vec2.scale(vec2.create(), diff, -1));
            mousePosOld = vec2.clone(mousePos);
            draw()
        }
    } else if ( clicked == -1) {
        mouseDown = false;
    }
}


// resset 
function reset() {
    marking = true;
    pointsTrans = [];
    points = [];
    mat = mat3.create();
    matPhase0 = mat3.create();
    matPhase1 = mat3.create();
    draw();
}


// save image 
function saveImgCB() {
    saveImg();
}
