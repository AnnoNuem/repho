
// applies curves for red green toning to image
function appRgt (img, v) {
    img.curves([[0,0], [.5,.5+v], [1,1]],
           [[0,0], [.5,.5-v], [1,1]],
           [[0,0], [.5,.5-v], [1,1]]);
}   


// get index of nearest point in pointlist next to vec2 mp
// check only every stepsize point
function getNIdx (mp, points, stepsize) {
    var i, dist, nIdx;
    var min = Infinity;

    for (i=0; i < 8; i+=stepsize) {
        dist = vec2.dist(mp, points[i]);
        if (dist < min) {
            min = dist;
            nIdx = i;
        }
    }
    return nIdx;
}
