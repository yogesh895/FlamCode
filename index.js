const paper = require('paper');
const fs = require('fs');
const path = require('path');
const { count } = require('console');
const radius = 20
let paperSize = 300
let papermargin =20;
var size = new paper.Size(paperSize, paperSize)
paper.setup(size);

// var path = new paper.Path();
// path.strokeColor = '#348BF0';

// var start = new paper.Point(100, 100);
// var end = new paper.Point(200, 200);

// path.moveTo(start);
// path.lineTo(end);
let arrCircles=[];
/**
 * 
 * @param {void}
 * @information check if detector can be drawn or numOfDetectors
 * @return flag
 */

//draw detectors--------------------------------------------------------------------------
function drawDetectors(obj){
    let center = obj.center;
    let outerRadius = !!obj.outerRadius?obj.outerRadius:20;
    let radiusRatio = !!obj.radiusRatio?obj.radiusRatio:0.4;
    let outerWidth = !!obj.outerWidth?obj.outerWidth:0.1;
    let color = !!obj.color?obj.color : 'black';
    obj.outerRadius = outerRadius;
    //draw outer circle 
    var inner = new paper.Path.Circle(center, radiusRatio*outerRadius);
    inner.fillColor = color;

    var outer = new paper.Path.Circle(center, outerRadius);
    outer.strokeWidth= outerWidth*outerRadius;
    outer.strokeColor = color;
    arrCircles.push(obj);
}

//stringToBinary-----------------------------------------------------------------------
function stringToBinary(input) {
    let output="";
    for (var i = 0; i < input.length; i++) {
       var temp = input[i].charCodeAt(0).toString(2) + " ";
        if (temp.length<9)
        {
          temp = '0'+ temp;
        }
        output += temp;
    }
    return output;
}

var codeConvaersion =stringToBinary("FlamCodeTestTexts");
var Binarybreak = codeConvaersion.split(' ');

console.log(Binarybreak.length-1);

let countC = 0;
var numOfDetectors = 5
var minDist = 80;
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
        strokeWidth: 3,
        strokeCap: "round"
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

// function drawCode(data){

//   binaryData = stringToBinary(data);
//   var binaryBreak = binaryData.split(' ');
//   len = binaryBreak.length-1;
//   let angle = 0;

//   for (let c=0; c<countC-1; c++){
//         angle = arrCircles[c+1].center.subtract(arrCircles[c].center).angle;
//         console.log(angle)
//         let cosTheta = Math.cos(angle);
//         let sinTheta = Math.sin(angle);
        
//         let changeinx = outerRadius*cosTheta;
//         let changeiny = outerRadius*sinTheta;
        
//         drawPath(new paper.Point((arrCircles[c].center.x+changeinx),arrCircles[c].center.y+changeiny) , new paper.Point(arrCircles[c+1].center.x - changeinx,arrCircles[c+1].center.y-changeiny))
      
//   }

// }
// drawDetectorsInLine(5,50,20);
// drawCode("hello",5,50,20);
// drawCode("hel",5,50,20)
// drawDetectors({"center" : new paper.Point(150,150)})

// console.log('width', path.bounds.width, 'height', path.bounds.height);









/**
 * 
 * @param {number} num number of detectors 
 */
function generateDetectors(num)
{

  
  let max_iterations = 1000;
  let arrPoints = []

  for(let i=0;i<num;i++)
  {
    let run = true;
    while (max_iterations && run)
    {
      max_iterations--;
      var temppoint  = new paper.Point(papermargin+(paperSize-2*papermargin)*Math.random(),papermargin+(paperSize-2*papermargin)*Math.random());
      let add =true; 
      arrPoints.forEach(
        (val)=>{
          if(temppoint.subtract(val.center).length <minDist)
          {
              add =false;
          }
        }
      )

      if(add)
      {
        arrPoints.push({"center":temppoint});
        run = false;
      }

    }

    if(max_iterations <=0)
    {
      console.error("paper too small");
      break;
    }
    max_iterations =1000;

  }


  //calcuting centroid

  let centroid = new paper.Point(0,0);

  arrPoints.forEach(
    (val)=> {
      centroid.add(val.center.multiply(1/arrPoints.length));
    }
  )

  //calculating all angles 
  arrPoints.forEach(
    (val)=> {
      let Cangle = val.center.subtract(centroid).angle;
      let Dist = val.center.subtract(centroid).length;
      val["Cangle"] = Cangle;
      val["dist"] = Dist;
    }
  )




/**
 * Sorting Detectors
 * @
 */

function compare(a,b)
{
    if(a.Cangle<b.Cangle){
      return -1;
    }
    else if(a.Cangle==b.Cangle){
      if(a.dist<b.dist)
        return -1;
      else return 1;
    }
    else 
      return 1;
  }




  arrPoints.sort(compare);






  console.log("number of detectors"+arrPoints.length);

  arrPoints.forEach((val)=>{drawDetectors(val)});


}




















/**
 * 
 * @param {string} data the data to be encoded 
 * @param {array} detectorCircles circles stord in a n object array
 */
function drawCode(data,detectorCircles)
{

  //---------------------------------------------------------------
    let marginRatio = 0.4;
  //--------------------------------------------------------------

  let binaryData = stringToBinary(data).split(' ');;
  console.log("binary form is  " +stringToBinary(data));
  binaryData.pop();
  console.log("biary data ready with lenght " + binaryData.length);
  let numberOfSection = detectorCircles.length-1;
  let amountData =(numberOfSection)*3;
  if(amountData >= binaryData.length)
  {
    console.log("Data Fully Encodeable");
  }
  else
  {
    console.log("Data Not Fully Encodeable "  + amountData);
    
  }
  
  let magnitudeChange =detectorCircles[0].outerRadius;
  magnitudeChange = magnitudeChange*(1+marginRatio);
  
  for (let i =0 ;i < numberOfSection;i++)
  {
    var circlefrom = detectorCircles[i];
    var circleto = detectorCircles[i+1];
    // let change = new paper.Point(
    //     circlefrom.outerRadius*(1+marginRatio)*Math.cos(180-circleto.center.subtract(circlefrom.center).angle),
    //     circlefrom.outerRadius*(1+marginRatio)*Math.sin(180-circleto.center.subtract(circlefrom.center).angle)
    // )

    
    // var a =new paper.Point(circlefrom.center.x+change.x, circlefrom.center.y+change.y);
    // var b =new paper.Point(circleto.center.x-change.x, circleto.center.y-change.y);
    // // console.log(circleto.center.subtract(circlefrom.center).angle);
    // console.log(change);
    // console.log(circlefrom.center);
    // console.log(circlefrom.center.add(change));

    // console.log();
    
    
    
    
    let change = circleto.center.subtract(circlefrom.center);
    change =change.normalize();
    
    let start = circlefrom.center.add(change.multiply(magnitudeChange));
    let end =circleto.center.subtract(change.multiply(magnitudeChange));
    
    // drawPath(start,end);

    console.log("length of first binary " + binaryData[i].length);
    
    let unitBinary  = (end.subtract(start).length)/ binaryData[i].length;
    for(let j =0;j < binaryData[i].length;j++)
    {
      if(binaryData[i][j] == '1')
      {
        drawPath(start.add(change.multiply(unitBinary*j)),start.add(change.multiply(unitBinary*(j+1))));
      }

    }



  }


}


// drawDetectors({"center":new paper.Point(100,100)});
// drawDetectors({"center":new paper.Point(160,60)});
// drawDetectors({"center":new paper.Point(220,60)});
// drawDetectors({"center":new paper.Point(225,180)});

generateDetectors(4);
drawCode("FlamCodeadsffgdsaffgdfsghh",arrCircles);



var svg = paper.project.exportSVG({asString:true});
fs.writeFileSync('punchline.svg', svg);