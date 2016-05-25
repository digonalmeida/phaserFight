function Vec(){

}

Vec.distance = function(a, b){
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

Vec.mod = function(a){
    return Vec.distance(a, {x:0, y:0});   
}

Vec.sum = function(a, b){
    return {x: a.x + b.x, y: a.y + b.y};
}

Vec.sub = function(a, b){
    return {x: a.x - b.x, y: a.y - b.y};   
}

Vec.dot = function(a, b){
    console.log("mult: %o", b);
    return (a.x * b.x) + (a.y * b.y);   
}

Vec.angle = function(a, b){
    return Vec.dot(a,b) / ( Vec.mod(a) * Vec.mod(b));   
}

Vec.mult = function(v, f){
    
    return {x: v.x * f, y: v.y *f};
    
}

Vec.normalized = function(a){
    var mod = Vec.mod(a);
    return { x: a.x/mod, y: a.y/mod};
}

Vec.projection = function(v,w){
    return Vec.mult(w,(Vec.dot(v,w)/(Math.pow(Vec.mod(w),2))));
    
}
//idea from: http://danikgames.com/blog/how-to-intersect-a-moving-target-in-2d/
Vec.aimDirection = function(bullet, bulletSpeed, target, targetDir){
    var jAxis = Vec.sub(target, bullet);
    jAxis = Vec.normalized(jAxis);
        
    //targetDir Projected into jAxis
    var targetDirJProjection = Vec.projection(targetDir, jAxis);
    
    //subtract JProjection from targetDir to get IProjection
    var targetDirIProjection = Vec.sub(targetDirJProjection, targetDir);

    //IAxis projection should be the same. thats the trick
    var bulletDirIProjection = targetDirIProjection;
    
    var bulletDirJProjection = Vec.mult(jAxis, bulletSpeed);
    console.log("targetDir %o", bulletSpeed);
    var bulletDir = (Vec.sum(bulletDirIProjection, bulletDirJProjection));
    bulletDir = Vec.normalized(bulletDir);
    return bulletDir;

}