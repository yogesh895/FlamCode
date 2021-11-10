const paper = require('paper');
const fs = require('fs');
const path = require('path');
const { count } = require('console');
const radius = 20
let paperSize = 300
var size = new paper.Size(paperSize, paperSize)
paper.setup(size);

// var path = new paper.Path();
// path.strokeColor = '#348BF0';

// var start = new paper.Point(100, 100);
// var end = new paper.Point(200, 200);

// path.moveTo(start);
// path.lineTo(end);


//draw detectors--------------------------------------------------------------------------
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

//stringToBinary-----------------------------------------------------------------------
function stringToBinary(input) {
    let output="";
    for (var i = 0; i < input.length; i++) {
        output += input[i].charCodeAt(0).toString(2) + " ";
    }
    return output;
}

var codeConvaersion =stringToBinary("FlamCodeTestTexts");
var Binarybreak = codeConvaersion.split(' ');

console.log(Binarybreak.length-1);
let arrCircles=[];
let countC = 0;
var numOfDetectors = 5
var minDist = 50
var margin = 20
var outerRadius = 0.5*(paperSize/numOfDetectors-minDist);  

//drawDetectorsInLine-----------------------------------------------------------------------------------------
/**
 * @description this function draws the detectors on the paper 
 */
function drawDetectorsInLine()  //todo this function is to be added with minimum distance check and max distance
{
  for(let i = 0; i < numOfDetectors; i++) 
  {
    let circle = {"outerRadius" : outerRadius,"center": new paper.Point(0,0)};
    circle.center = new paper.Point(outerRadius+i*(2*outerRadius+minDist)+margin,outerRadius+margin);
    drawDetectors(circle);
    arrCircles.push(circle)
    countC = countC + 1;
  }  

}
/**
 * 
 * @param {*} start 
 * @param {*} end 
 * @returns path on svg
 */
function drawPath(start,end){
    let path = new paper.Path({
        strokeColor: "black",
        strokeWidth: 1
    });
    path.add(start,end);

}
/**
 * 
 * @param {String} data 
 * @param {Int} minDist 
 * @param {paper.Point} firstCenter 
 * @return draw code on the svg
 */

function drawCode(data){

  binaryData = stringToBinary(data);
  var binaryBreak = binaryData.split(' ');
  len = binaryBreak.length-1;
  let angle = 0;

  for (let c=0; c<countC-1; c++){
        angle = arrCircles[c+1].center.subtract(arrCircles[c].center).angle;
        console.log(angle)
        let cosTheta = Math.cos(angle);
        let sinTheta = Math.sin(angle);
        
        let changeinx = outerRadius*cosTheta;
        let changeiny = outerRadius*sinTheta;
        
        drawPath(new paper.Point((arrCircles[c].center.x+changeinx),arrCircles[c].center.y+changeiny) , new paper.Point(arrCircles[c+1].center.x - changeinx,arrCircles[c+1].center.y-changeiny))
      
  }

}
drawDetectorsInLine(5,50,20);
drawCode("hello",5,50,20);
// drawCode("hel",5,50,20)
// drawDetectors({"center" : new paper.Point(150,150)})

// console.log('width', path.bounds.width, 'height', path.bounds.height);

var svg = paper.project.exportSVG({asString:true});
fs.writeFileSync('punchline.svg', svg);