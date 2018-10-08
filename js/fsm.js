
// Phase 0: Translation
function phase0 () {
    var diff;

    diff = vec2.sub(vec2.create(), points[0], points[1]);
    mat3.fromTranslation(matPhase0, diff);
    mat3.copy(mat, matPhase0);
    pointsTrans[0] = vec2.clone(pointsTrans[1]);
}


// Phase 1: Scaling and Rotation
function phase1 () {
    var dist1, dist2, angle, v1, v2, a1, a2, vx;

    dist1 = vec2.dist(pointsTrans[0], pointsTrans[2]);
    dist2 = vec2.dist(pointsTrans[1], pointsTrans[3]);


    mat = mat3.create(); 
    mat3.translate(matPhase1, matPhase1, pointsTrans[0]);

    mat3.scale(matPhase1, matPhase1, 
            vec2.fromValues(dist1/dist2, dist1/dist2));


    v1 = vec2.normalize(vec2.create(), vec2.sub(vec2.create(), pointsTrans[2], pointsTrans[0]));
    v2 = vec2.normalize(vec2.create(), vec2.sub(vec2.create(), pointsTrans[3], pointsTrans[1]));

    if (vec2.equals(v1, v2)) {
        angle = 0;
    } else {
        vx = vec2.fromValues(1,0);
        a1 = Math.acos(vec2.dot(vx, v1));
        a2 = Math.acos(vec2.dot(vx, v2));
        a1 = (v1[1] > 0) ? Math.PI + (Math.PI - a1) : a1;
        a2 = (v2[1] > 0) ? Math.PI + (Math.PI - a2) : a2;

        angle = a2 - a1;
        mat3.rotate(matPhase1, matPhase1, angle);
    }

    mat3.translate(matPhase1, matPhase1, 
            vec2.scale(vec2.create(), pointsTrans[0], -1));

    mat3.mul(mat, matPhase0, matPhase1);
    pointsTrans[2] = vec2.clone(pointsTrans[3]);

} 


// Phase 2: Affine
// Would only add shear which has no real application
// Possible Perspective with computed fourth point:
// Mirror forth point along perpendicular bisector 
// of points 0/1 and points 2/3
function phase2 () {
    points.push(points[4]);
    points.push(points[5]);
    //points.pop();
    //points.pop();
}


// Phase 3: Perspective
function phase3 () {

    var i;
    var matI = mat3.invert(mat3.create(), matPhase0);
    vec2.transformMat3(points[2], points[2], matPhase0);
    for (i = 4; i < 8; i+=2) {
        vec2.transformMat3(points[i], points[i], mat);
    }

    pointsTrans[4] = vec2.clone(pointsTrans[5]);
    pointsTrans[6] = vec2.clone(pointsTrans[7]);
}
