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

Vec.normalized = function(a){
    var mod = Vec.mod(a);
    return { x: a.x/mod, y: a.y/mod};
}