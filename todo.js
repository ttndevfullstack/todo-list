//Variables
let todoItems = [];
const todoInput = document.querySelector(".todo-input");
const completedTodoDiv = document.querySelector(".completed-todo");
const uncompletedTodoDiv = document.querySelector(".uncompleted-todo");
const completedTitle = document.querySelector(".completed-title");
const audio = new Audio("./assets/audio/audio1.mp3");

//Get todo list on the first boot
window.onload = function () {
  let storageTodoItems = localStorage.getItem("todoItems");

  if (storageTodoItems !== null) {
    todoItems = JSON.parse(storageTodoItems);
  }
  render();
};

//Get the content typed into the input
todoInput.onkeyup = (e) => {
  const value = e.target.value.replace(/^\s+/, "");

  if (value && e.keyCode === 13) {
    addTodo(value);
    todoInput.value = "";
    todoInput.focus();
  }
};

//Add todo
function addTodo(text) {
  todoItems.unshift({
    id: Date.now(),
    text,
    completed: false,
  });
  audio.play();
  saveAndRender();
}

//Edit todo
function editTodo(id) {
  todoItems = todoItems.forEach((todo) => {
    if (todo.id === Number(id)) {
      // const editInput = document.createElement('input');
      // editInput.type = 'text';
      // editInput.className = 'edit-input';
      // editInput.value = todo.text;
      // todo.parentNode.replaceChild('.todo-item', editInput);
    }
  });
  // todoInput.value = todoEdit.text;
  // todoInput.focus();
  // console.log(todoEdit);

  // todoEdit = {
  //     id,
  //     text: todoInput.value,
  //     completed,
  // }
}

//Remove todo
function removeTodo(id) {
  todoItems = todoItems.filter((todo) => todo.id !== Number(id));
  audio.play();
  saveAndRender();
}

//Mark as completed
function markAsCompleted(id) {
  todoItems = todoItems.filter((todo) => {
    if (todo.id === Number(id)) {
      todo.completed = true;
    }
    return todo;
  });
  audio.play();
  saveAndRender();
}

//Mark as uncompleted
function markAsUncompleted(id) {
  todoItems = todoItems.filter((todo) => {
    if (todo.id === Number(id)) {
      todo.completed = false;
    }
    return todo;
  });
  audio.play();
  saveAndRender();
}

//Save in localStorage
function save() {
  localStorage.setItem("todoItems", JSON.stringify(todoItems));
}

//Render in HTML
function render() {
  let uncompletedTodos = todoItems.filter((todo) => !todo.completed);
  let completedTodos = todoItems.filter((todo) => todo.completed);

  uncompletedTodoDiv.innerHTML = "";
  completedTodoDiv.innerHTML = "";
  completedTitle.innerHTML = "";

  if (uncompletedTodos.length > 0) {
    uncompletedTodos.forEach((todo) => {
      uncompletedTodoDiv.append(createTodoElement(todo));
    });
  } else
    uncompletedTodoDiv.innerHTML = `<div class='empty'>No todo misson</div>`;

  if (completedTodos.length > 0) {
    completedTitle.innerHTML = `Completed (${completedTodos.length}/${todoItems.length})`;
    completedTodos.forEach((todo) => {
      completedTodoDiv.append(createTodoElement(todo));
    });
  }
}

//Save and render
function saveAndRender() {
  save();
  render();
}

//Create todo list item
function createTodoElement(todo) {
  //Create todo item
  const todoItemDiv = document.createElement("div");
  todoItemDiv.className = "todo-item";
  todoItemDiv.setAttribute("data-id", todo.id);

  //Create todo item text
  const todoTextSpan = document.createElement("span");
  todoTextSpan.innerHTML = todo.text;

  //Checkbox for list
  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.checked = todo.completed;
  checkBox.onclick = (e) => {
    let id = e.target.closest(".todo-item").dataset.id;
    todo.completed ? markAsUncompleted(id) : markAsCompleted(id);
  };

  //Edit button for list
  const todoIconDiv = document.createElement("div");
  todoIconDiv.className = "todo-icon";
  const editIcon = document.createElement("a");
  editIcon.href = "#";
  editIcon.className = "pen-icon";
  editIcon.innerHTML = `<i class='fa-solid fa-pen'></i>`;
  editIcon.onclick = (e) => {
    editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "edit-input";
    editInput.value = todo.text;
    todoItemDiv.parentNode.replaceChild(todoItemDiv, editInput);
    let id = e.target.closest(".todo-item").dataset.id;
    editTodo(id);
  };

  //Delete button for list
  const xmarkIcon = document.createElement("a");
  xmarkIcon.href = "#";
  xmarkIcon.className = "xmark-icon";
  xmarkIcon.innerHTML = `<i class='fa-solid fa-xmark'></i>`;
  xmarkIcon.onclick = (e) => {
    let id = e.target.closest(".todo-item").dataset.id;
    removeTodo(id);
  };

  todoTextSpan.prepend(checkBox);
  todoIconDiv.prepend(editIcon);
  todoIconDiv.appendChild(xmarkIcon);
  todoItemDiv.prepend(todoTextSpan);
  todoItemDiv.append(todoIconDiv);
  todoItemDiv.append(todoIconDiv);

  return todoItemDiv;
}
