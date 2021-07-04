const canvas = document.querySelector("canvas");
const stroke = document.querySelector(".stroke")

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context = canvas.getContext("2d");
context.fillStyle = "white";
context.fillRect(0, 0, canvas.width, canvas.height);

let draw_color = "black";
let draw_width = 2;
let is_drawing = false;

let active_tool = null;

// is_drawing = true on click begin path
canvas.addEventListener("touchstart", start_draw);
canvas.addEventListener("mousedown", start_draw);

// on mouse move draw line id is_drawing
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("mousemove", draw);

// on click leave stop drawing
canvas.addEventListener("touchend", stop_draw);
canvas.addEventListener("mouseup", stop_draw);

function start_draw(e) {
  stop_draw();
  is_drawing = true;
  if (active_tool === "pencil") {
    context.beginPath();
    context.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  }
  // e.preventDefault();
}

function draw(e) {
stroke.style.top = `${e.clientY}px`
stroke.style.left = `${e.clientX}px`
  if (is_drawing && active_tool === "pencil") {
    context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    context.strokeStyle = draw_color;
    context.lineWidth = draw_width;
    context.lineCap = "round";
    context.stroke();
  }
}

function stop_draw(e) {
  if (is_drawing) {
    context.stroke();
    context.closePath();
    is_drawing = false;
  }
  // e.preventDefault();
}

function inactive_all() {
  document.querySelectorAll(".active").forEach((icon) => {
    icon.classList.remove("active");
  });
}

const mainBox = document.querySelector("#mainBox");
const pencilOpen = document.querySelector("#pencilOpen");
const pencilClose = document.querySelector("#pencilClose");
const pencilBox = document.querySelector("#pencilBox");
const eraser = document.querySelector("#eraser");
const clear = document.querySelector("#clear");

pencilOpen.addEventListener("click", () => {
  inactive_all();
  mainBox.classList.toggle("slide-out");
  pencilBox.classList.toggle("slide-out");
  draw_color = "black";
  document.querySelector(".color-picker").classList.add("active");
  active_tool = "pencil";
});

document.querySelectorAll(".ri-pencil-fill").forEach((pencil) => {
  pencil.addEventListener("click", () => {
    inactive_all();
    active_tool = "pencil";
    draw_color = pencil.style.color;
    pencil.classList.add("active");
  });
});

pencilClose.addEventListener("click", () => {
  mainBox.classList.toggle("slide-out");
  pencilBox.classList.toggle("slide-out");
  active_tool = null;
});


eraser.addEventListener('click',()=>{
  active_tool = "pencil"
  inactive_all()
  draw_color = "white"
  eraser.classList.toggle("active")
})

clear.addEventListener('click',()=>{
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
})



document.body.addEventListener('wheel', function(e) {
  
  if (e.deltaY<0 && draw_width<40){
    draw_width++
  } else if(draw_width>0){
    draw_width--
  }
  stroke.style.visibility = "visible"
  stroke.style.width=`${draw_width}px`
  stroke.style.height=`${draw_width}px`
  setTimeout(()=>{stroke.style.visibility = "hidden"}, 1000);
})


const theme = document.querySelector("#theme")

theme.addEventListener('click',()=>{
  theme.classList.toggle("ri-sun-line")
  theme.classList.toggle("ri-moon-line")
  document.body.classList.toggle("dark")
})

window.onresize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
