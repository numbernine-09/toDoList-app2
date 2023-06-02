const form = document.getElementById("add-form");
const taskList = document.getElementById("task-list");
const newTask = document.getElementById("new-task");
const upper = document.querySelector("#back-to-top");
const clearedtask = document.querySelector(".completed-task");
const cardLi = document.getElementById("task-list");
const buttonClr = document.getElementById("clear");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

document.addEventListener("DOMContentLoaded", function () {
  renderTasks();
  btnClr();
});

window.onscroll = function () {
  scrollFunction();
};

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach(function (task, index) {
    const li = document.createElement("li");
    li.setAttribute("id", "list");
    li.innerHTML = `
    <div class="card" id="${task.id}">
            <span><h1 class="wrap">Title: ${task.title}</h1></span>
            <span><p class="wrap">Desc: ${task.desc}</p></span>
            <p class="date">${task.date}</p>
    </div>
            <button class="button-completed">        
              <i class="fa-regular fa-circle-check" index="${index}"></i>
            </button>
            <div class="wrap-button">
                <button class="btn-update" data-index="${index}">Update</button>
                <button class="btn-delete" data-index="${index}">Delete</button>
            </div>
    
        `;

    taskList.appendChild(li);
  });
}

console.log(Array.from(cardLi));

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("fa-regular")) {
    const index = e.target.getAttribute("index");
    tasks[index].setAttribute("style", "text-decoration: line-through");
  }
});

form.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("submit")) {
    Swal.fire({
      title: "Add Task",
      html: `
    <form id="form-wrap">
      <label for="swal-input1">Title: </label>
      <input id="swal-input1" class="swal2-input" >
      <label for="swal-input2">Desc: </label>
      <input id="swal-input2" class="swal2-input" >
    </form>`,
      showCancelButton: true,
      confirmButtonText: "Add",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const title = Swal.getPopup().querySelector("#swal-input1").value;
        const description = Swal.getPopup().querySelector("#swal-input2").value;
        if (!title || !description) {
          Swal.showValidationMessage("Please enter task and desc name");
        }
        return { title, description };
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        const id = generateId();
        const date = new Date().toLocaleString();
        const task = {
          title: result.value.title,
          desc: result.value.description,
          date,
          id,
        };
        updateTaskfinish();
        tasks.push(task);
        reloadPage();
        finishTask();
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
      }
    });
  }
});

function reloadPage() {
  setTimeout(() => {
    location.reload();
  }, 1100);
}

function generateId() {
  return +new Date();
}

taskList.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-delete")) {
    const index = e.target.getAttribute("data-index");
    Swal.fire({
      title: "Apakah yakin untuk menghapus task ini?",
      text: "Kamu tidak bisa mengubah perintah!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus task ini!",
    }).then((result) => {
      if (result.isConfirmed) {
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
        reloadPage();
        Swal.fire("Terhapus!", "Task mu telah terhapus.", "success");
      }
    });
  } else if (e.target.classList.contains("btn-update")) {
    const index = e.target.getAttribute("data-index");
    let date = new Date().toLocaleString();

    const task = tasks[index];
    Swal.fire({
      title: "Update Task",
      html: `
      <form id="form-wrap">
        <label for="swal-input1">Title: </label>
        <input id="swal-input1" class="swal2-input" value="${task.title}" >
        <label for="swal-input2">Desc: </label>
        <input id="swal-input2" class="swal2-input" value="${task.desc}">
      </form>`,
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const title = Swal.getPopup().querySelector("#swal-input1").value;
        const description = Swal.getPopup().querySelector("#swal-input2").value;
        if (!title) {
          Swal.showValidationMessage("Please enter task name");
        }

        return { title: title, desc: description, date };
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        updateTaskfinish();
        tasks[index].title = result.value.title;
        tasks[index].desc = result.value.desc;
        tasks[index].date = result.value.date;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        reloadPage();
        renderTasks();
      }
    });
  }
});

function clearTasks() {
  Swal.fire({
    title: "Apakah yakin untuk menghapus semua task?",
    text: "Kamu tidak bisa mengubah perintah!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, hapus task ini!",
  }).then((result) => {
    if (result.isConfirmed) {
      tasks = [];
      localStorage.removeItem("tasks");
      reloadPage();
      renderTasks();
      Swal.fire("Terhapus!", "Semua Task mu telah terhapus.", "success");
    }
  });
}

function finishTask() {
  const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: "success",
    title: "list berhasil ditambahkan",
  });
}

function updateTaskfinish() {
  const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: "success",
    title: "list berhasil diupdate",
  });
}

function scrollFunction() {
  if (window.pageYOffset > 700) {
    if (!upper.classList.contains("upperIn")) {
      upper.classList.remove("upperOut");
      upper.classList.add("upperIn");
      upper.style.display = "block";
    }
  } else {
    if (upper.classList.contains("upperIn")) {
      upper.classList.remove("upperIn");
      upper.classList.add("upperOut");
      setTimeout(() => {
        upper.style.display = "none";
      }, 250);
    }
  }
}

upper.addEventListener("click", () => {
  window.scrollTo(0, 0);
});

function btnClr() {
  if (tasks.length >= 3) {
    buttonClr.setAttribute("style", "display: block");
  } else {
    buttonClr.setAttribute("style", "display: none");
  }
}

console.log(tasks);
