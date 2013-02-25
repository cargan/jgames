//code taken from http://will.thimbleby.net/a-shortest-path-in-javascript/
var map, canvas, ctx, allowDiagonals, nodesSearched;

var mDown = false;
var dragMode;
var start = {x:5,y:2};
var end = {x:8,y:10};

var xcord = 15;
var ycord = 25;


function createArray(length) {
  var a = makeArrayOf(0, new Array(length || 0));

  if (arguments.length > 1) {
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < length; i++) {
      a[i] = createArray.apply(this, args);
    }
  }

  return a;
}

function makeArrayOf(value, arr) {
  var i = arr.length;
  while (i--) {
    arr[i] = value;
  }
  return arr;
}

var startMap = createArray(xcord, ycord);
console.log(startMap);
// var startMap =
// [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
// [0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,],
// [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,],
// [0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,],
// [0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,],
// [0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,],
// [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,],
// [1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,],
// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
// [0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,],
// [0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,],
// [0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,],
// [0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,],
// [0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,],
// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]];

function findPosX(obj)
{
  var curleft = 0;
  if(obj.offsetParent)
      while(1)
      {
        curleft += obj.offsetLeft;
        if(!obj.offsetParent)
          break;
        obj = obj.offsetParent;
      }
  else if(obj.x)
      curleft += obj.x;
  return curleft;
}

function findPosY(obj)
{
  var curtop = 0;
  if(obj.offsetParent)
      while(1)
      {
        curtop += obj.offsetTop;
        if(!obj.offsetParent)
          break;
        obj = obj.offsetParent;
      }
  else if(obj.y)
      curtop += obj.y;
  return curtop;
}

function mouseDown(event) {
  var pos = {x:Math.floor((event.clientX-findPosX(canvas))/10), y:Math.floor((event.clientY-findPosY(canvas))/10)};

  mDown = true;
  dragMode = 0;
  if(pos.x==start.x && pos.y==start.y)
    dragMode = 2;
  else if(pos.x==end.x && pos.y==end.y)
    dragMode = 3;
  else if(map[pos.x][pos.y].solid)
    dragMode = 1;
  mouseMoved(e);
}
function mouseMoved(event) {
  if(mDown) {
    var pos = {x:Math.floor((event.clientX-findPosX(canvas))/10), y:Math.floor((event.clientY-findPosY(canvas))/10)};

    switch(dragMode) {
      case 0:
        map[pos.x][pos.y].solid = true;
        break;
      case 1:
        map[pos.x][pos.y].solid = false;
        break;
      case 2:
        start.x = pos.x;
        start.y = pos.y;
        break;
      case 3:
        end.x = pos.x;
        end.y = pos.y;
        break;
    }

    draw();
  }
}
function mouseUp(e) {
  mDown = false;
}

function clearMap() {
  for(var i=0;i<20;i++) {
    for(var j=0;j<20;j++) {
      map[i][j].solid = false;
    }
  }
  draw();
}

function randomMap() {
  for(var i=0;i<20;i++) {
    for(var j=0;j<20;j++) {
      map[i][j].solid = Math.random() > 0.8;
    }
  }
  draw();
}

function init() {
  map = new Array;
  for(var i=0;i<xcord;i++) {
    map[i] = new Array;
    for(var j=0;j<ycord;j++) {
      map[i][j] = new Node(i, j, startMap[i][j]);
    }
  }

  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  canvas.onmousedown = mouseDown;
  canvas.onmousemove = mouseMoved;
  canvas.onmouseup = mouseUp;

  draw();
}

function draw() {
  nodesSearched = 0;
  allowDiagonals = document.getElementById("diagonals").checked;
  diagonalCost = document.getElementById("diagonalcost").checked? 1.01 : 1.0;
  dotTiebreaker = document.getElementById("dotTiebreaker").checked;
  badSorting = !(document.getElementById("badSorting").checked);

  ctx.fillStyle = '#EEE';
  ctx.strokeStyle = '#888';
  ctx.fillRect(0,0,500,500);

  var r = pathFind(start.x, start.y, end.x, end.y);

  ctx.strokeRect(0.5, 0.5, 200, 200);
  ctx.fillStyle = '#333';
  for(i=0;i<xcord;i++) {
    for(j=0;j<ycord;j++) {
      if(map[i][j].solid) {
        ctx.fillRect(i*10, j*10, 10, 10);
      }
      else {
        ctx.strokeRect(i*10-0.5, j*10-0.5, 10, 10);
      }
    }
  }


  ctx.fillStyle = '#F77';
  ctx.fillRect(start.x*10, start.y*10, 10, 10);
  ctx.fillStyle = '#77F';
  ctx.fillRect(end.x*10, end.y*10, 10, 10);

  ctx.strokeStyle = '#F00';
  ctx.beginPath();
  for(i=0;i<r.length;i++) {
    if(i==0) ctx.moveTo(r[i].x*10+5.5, r[i].y*10+5.5);
    else ctx.lineTo(r[i].x*10+5.5, r[i].y*10+5.5);
  }
  ctx.stroke();

  document.getElementById("pathlength").innerHTML = r.length;
  document.getElementById("nodes").innerHTML = nodesSearched;
}

