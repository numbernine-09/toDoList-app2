const form = document.getElementById("add-form");
const taskList = document.getElementById("task-list");
const newTask = document.getElementById("new-task");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach(function (task, index) {
    const li = document.createElement("li");
    li.innerHTML = `
            <span>${task.title}</span>
            <span>${task.desc}</span>
            <div class="wrap-button">
                <button class="btn-update" data-index="${index}">Update</button>
                <button class="btn-delete" data-index="${index}">Delete</button>
            </div>
        `;
    taskList.appendChild(li);
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const task = { title: newTask.value, desc: newTask.value };
  tasks.push(task);
  finishTask();
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  newTask.value = "";
});

taskList.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-delete")) {
    const index = e.target.getAttribute("data-index");
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  } else if (e.target.classList.contains("btn-update")) {
    const index = e.target.getAttribute("data-index");
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
        return { title: title, desc: description };
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        updateTaskfinish();
        tasks[index].title = result.value.title;
        tasks[index].desc = result.value.desc;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
      }
    });
  }
});

function clearTasks() {
  tasks = [];
  localStorage.removeItem("tasks");
  renderTasks();
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
    title: "list berhasil diubah",
  });
}

renderTasks();
console.log(tasks);
