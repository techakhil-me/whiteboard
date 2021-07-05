const canvas = document.querySelector("canvas");
const stroke = document.querySelector(".stroke");

// canvas.width = 1000;
// canvas.height = 1000;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context = canvas.getContext("2d");
context.fillStyle = "white";
context.fillRect(0, 0, canvas.width, canvas.height);

let draw_color = "black";
let draw_width = 2;
let is_drawing = false;

let active_tool = null;

let restore = [];
let draw_value = 0;
function load() {
  let img = new Image();
  img.src = JSON.parse(localStorage.getItem("restore"));
  if (img.src) {
    img.onload = function () {
      context.drawImage(img, 0, 0); // Or at whatever offset you like
    };
  }
}
load();
restore.push(context.getImageData(0, 0, canvas.width, canvas.height));
// load()

// line
let x1, y1, x2, y2;

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
    context.moveTo(e.clientX, e.clientY);
  }

  if (active_tool === "line") {
    GetStartPoints();
  }
  // e.preventDefault();
}

function draw(e) {
  stroke.style.top = `${e.clientY}px`;
  stroke.style.left = `${e.clientX}px`;
  if (is_drawing && active_tool === "pencil") {
    context.lineTo(e.clientX, e.clientY);
    context.strokeStyle = draw_color;
    context.lineWidth = draw_width;
    context.lineCap = "round";
    context.stroke();
  }
}

function stop_draw(e) {
  if (is_drawing && active_tool === "pencil") {
    context.stroke();
    context.closePath();
    is_drawing = false;
  }
  if (active_tool === "line" && x1 !== null) {
    GetEndPoints();

    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.strokeStyle = draw_color;
    context.lineWidth = draw_width;
    context.lineCap = "round";
    context.stroke();
    context.closePath();
    is_drawing = false;
    x1 = null;
  }
  // e.preventDefault();

  if (event.type === "mouseup") {
    restore.push(context.getImageData(0, 0, canvas.width, canvas.height));
    let imgAsDataURL = canvas.toDataURL("image/png");
    localStorage.setItem("restore", JSON.stringify(imgAsDataURL));
    draw_value += 1;
  }
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
const colorPicker = document.querySelector("#colorPicker");
const eraser = document.querySelector("#eraser");
const clear = document.querySelector("#clear");
const undo = document.querySelector("#undo");
const redo = document.querySelector("#redo");
const line = document.querySelector("#line");

redo.addEventListener("click", () => {
  if (draw_value < restore.length - 1) {
    draw_value++;
    context.putImageData(restore[draw_value], 0, 0);
    let imgAsDataURL = canvas.toDataURL("image/png");
    localStorage.setItem("restore", JSON.stringify(imgAsDataURL));
  }
});

pencilOpen.addEventListener("click", () => {
  inactive_all();
  mainBox.classList.toggle("slide-out");
  pencilBox.classList.toggle("slide-out");
  colorPicker.classList.add("active");
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
  inactive_all();
  mainBox.classList.toggle("slide-out");
  pencilBox.classList.toggle("slide-out");
  active_tool = null;
});

function changeColor(e) {
  inactive_all();
  active_tool = "pencil";
  colorPicker.classList.add("active");
  draw_color = e.value;
  colorPicker.style.color = e.value;
}

eraser.addEventListener("click", () => {
  active_tool = "pencil";
  inactive_all();
  draw_color = "white";
  eraser.classList.toggle("active");
});

clear.addEventListener("click", () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
  document.querySelectorAll(".textbox").forEach((textbox) => {
    textbox.remove();
  });
  restore = [];
  draw_value = -1;
  let imgAsDataURL = canvas.toDataURL("image/png");
  localStorage.setItem("restore", JSON.stringify(imgAsDataURL));
});

undo.addEventListener("click", () => {
  if (draw_value > 0) {
    // restore.pop();
    draw_value -= 1;
    context.putImageData(restore[draw_value], 0, 0);
    let imgAsDataURL = canvas.toDataURL("image/png");
    localStorage.setItem("restore", JSON.stringify(imgAsDataURL));
  }
});

line.addEventListener("click", () => {
  active_tool = "line";
  inactive_all();
  line.classList.toggle("active");
});

function GetStartPoints() {
  x1 = event.clientX;
  y1 = event.clientY;
}

function GetEndPoints() {
  x2 = event.clientX;
  y2 = event.clientY;
}

document.body.addEventListener("wheel", function (e) {
  if (e.deltaY < 0 && draw_width < 40) {
    draw_width++;
  } else if (draw_width > 0) {
    draw_width--;
  }
  stroke.style.visibility = "visible";
  stroke.style.width = `${draw_width}px`;
  stroke.style.height = `${draw_width}px`;
  setTimeout(() => {
    stroke.style.visibility = "hidden";
  }, 1000);
});

const theme = document.querySelector("#theme");

theme.addEventListener("click", () => {
  theme.classList.toggle("ri-sun-line");
  theme.classList.toggle("ri-moon-line");
  document.body.classList.toggle("dark");
});

const addText = document.querySelector("#addText");

addText.addEventListener("click", () => {
  let textbox = document.createElement("span");
  textbox.setAttribute("role", "textbox");
  textbox.setAttribute("contenteditable", "true");
  textbox.className = "textbox";
  textbox.innerHTML = "type";
  document.body.appendChild(textbox);
  dragElement(textbox);
  textbox.focus();
});

const addTodo = document.querySelector("#addTodo");

addTodo.addEventListener("click", () => {
  let todoContainer = document.createElement("div");
  todoContainer.className = "todo";
  let todoTitle = document.createElement("div");
  todoTitle.className = "todo-title";
  todoTitle.setAttribute("contenteditable", "true");
  todoTitle.innerHTML = "ToDo List";
  let listedTask = document.createElement("div");
  listedTask.className = "listedtask";

  let newTask = document.createElement("input");
  newTask.className = "newtask";
  newTask.setAttribute("type", "text");
  newTask.setAttribute("placeholder", "Enter Task");

  todoContainer.append(todoTitle);
  todoContainer.append(listedTask);
  todoContainer.append(newTask);

  newTask.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addtask();
    }
  });

  function addtask() {
    let listitem = document.createElement("li");

    listitem.className = "list-group-item";
    listitem.innerHTML = newTask.value;

    listitem.addEventListener("click", () => {
      listitem.classList.toggle("done");
    });
    let deleteitem = document.createElement("i");
    deleteitem.className = "ri-delete-bin-2-line todo-delete";

    deleteitem.addEventListener("click", () => {
      listitem.remove();
    });
    listitem.append(deleteitem);
    listedTask.append(listitem);

    newTask.value = "";
  }

  document.body.appendChild(todoContainer);
  dragElement(todoContainer);
  // textbox.focus();
});

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    // e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;

    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    // e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

window.onresize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

document.querySelector(".infoIcon").addEventListener("click", () => {
  document.querySelector(".info").classList.toggle("info-in");
});

document.querySelector(".close").addEventListener("click", () => {
  document.querySelector(".info").classList.toggle("info-in");
});

let link = document.createElement("a");
link.download = "whiteboard.png";
document.querySelector("#save").addEventListener("click", () => {
  link.href = canvas
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream");
  link.click();
  link.remove();
});
