
const mtcnnForwardParams = {minFaceSize: 200};
const display = document.getElementById('display');
const input = document.getElementById('video');
const timeline = document.getElementById('timeline');
const canvas = document.getElementById('overlay');
const context = canvas.getContext('2d');

const MAX_MIN = 600;
const SECOND = 10;
let i = 0;

let avgCollection = [];
let tempDataCollection = [];

google.charts.load("current", {packages:["timeline"]});


function getMax(obj){
    return Object.keys(obj).reduce((acc, x) => (obj[acc] < obj[x] || acc === '') ? x : acc, '');
};
  
function getAvgs(collection){
    return collection.reduce((acc, x) => (acc[x]) ? {[x] : acc[x]++, ...acc} : {[x]: 1, ...acc} , {});
}

function triggerGraph(iterator, data){
    if(data && iterator < (MAX_MIN * SECOND)){

        tempDataCollection.push(getMax(data.expressions));

        if(iterator%SECOND === 0){            
            const endTime = Math.floor(iterator/SECOND)+1;  
            const startTime = endTime - 1;
            const maxAvg = getMax(getAvgs(tempDataCollection));

            avgCollection.push([maxAvg, startTime, endTime]);
            google.charts.setOnLoadCallback(drawGraph(avgCollection))
            tempDataCollection = [];
        }
    }
}

function drawGraph(data){
    return function(){
        const chart = new google.visualization.Timeline(timeline);
        const dataTable = new google.visualization.DataTable();

        dataTable.addColumn({type: 'string', id: 'Expression'});
        dataTable.addColumn({type: 'number', id: 'Start'});
        dataTable.addColumn({type: 'number', id: 'End'});
        dataTable.addRows(data);
        chart.draw(dataTable)
    }
}

async function onPlay(videoEl) {
    const detections = await faceapi.detectAllFaces(input).withFaceExpressions();
    const displaySize = { width: input.width, height: input.height}
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    context.clearRect(0,0,canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    triggerGraph(i, detections[0]);
    ++i;
    
    setTimeout(() => onPlay(videoEl))
}

async function init(){
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/')
    await faceapi.nets.faceExpressionNet.loadFromUri('/')

    const videoEl = document.getElementById('video')
    navigator.getUserMedia(
      { video: {} },
      stream => videoEl.srcObject = stream,
      err => console.error(err)
    )      
}


$(document).ready(()=>{
    init();
});
