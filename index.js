const paper = require('paper');
const fs = require('fs');
const radius = 20
var size = new paper.Size(300, 300)
paper.setup(size);

// var path = new paper.Path();
// path.strokeColor = '#348BF0';

// var start = new paper.Point(100, 100);
// var end = new paper.Point(200, 200);

// path.moveTo(start);
// path.lineTo(end);

function drawDetectors(obj){
    let center = obj.center;
    let outerRadius = !!obj.outerRadius?obj.outerRadius:40;
    let radiusRatio = !!obj.radiusRatio?obj.radiusRatio:0.4;
    let outerWidth = !!obj.outerWidth?obj.outerWidth:0.1;
    let color = !!obj.color?obj.color : 'black';

    //draw outer circle 
    var inner = new paper.Path.Circle(center, radiusRatio*outerRadius);
    inner.fillColor = color;

    var outer = new paper.Path.Circle(center, outerRadius);
    outer.strokeWidth= outerWidth*outerRadius;
    outer.strokeColor = color;

    
}

drawDetectors({"center" : new paper.Point(100,100)})

// console.log('width', path.bounds.width, 'height', path.bounds.height);

var svg = paper.project.exportSVG({asString:true});
fs.writeFileSync('punchline.svg', svg);