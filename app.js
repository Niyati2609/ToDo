// Initialize Firebase

    const firebaseConfig = {
    
  };
  
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  
  document.addEventListener("DOMContentLoaded", function () {
  const createButton = document.getElementById("createButton");
  createButton.addEventListener("click", addTodo);
  
  const voiceButton = document.getElementById("voiceButton");
  voiceButton.addEventListener("click", startVoiceRecognition);
});

function startVoiceRecognition() {
  const recognition = new window.webkitSpeechRecognition();
  recognition.lang = "en-US";

  recognition.onresult = function (event) {
    const recognizedText = event.results[0][0].transcript;
    const recognizedElement = document.getElementById("recognizedText");
    recognizedElement.textContent = recognizedText;

    if (recognizedText.trim().toLowerCase().startsWith("create")) {
      const todoText = recognizedText.trim().substring("create".length).trim();
      if (todoText !== "") {
        const newTodoRef = database.ref("todos").push();
        newTodoRef.set({
          text: todoText,
          completed: false
        });
      }
    }
  };

  recognition.start();
}
  
  function addTodo() {
    const todoInput = document.getElementById("todoInput");
    const todoText = todoInput.value;
    
    if (todoText.trim() !== "") {
      const newTodoRef = database.ref("todos").push();
      newTodoRef.set({
        text: todoText,
        completed: false
      });
      
      todoInput.value = "";
    }
  }
  
  function renderTodos(snapshot) {
    const todoList = document.getElementById("todoList");
    todoList.innerHTML = "";
    
    snapshot.forEach(function(childSnapshot) {
      const todo = childSnapshot.val();
      const todoItem = document.createElement("li");
  
      const textSpan = document.createElement("span");
      textSpan.innerText = todo.text;
      todoItem.appendChild(textSpan);
  
      const editButton = document.createElement("button");
      editButton.innerText = "Edit";
      editButton.addEventListener("click", function () {
        const newText = prompt("Edit the todo:", todo.text);
        if (newText !== null && newText.trim() !== "") {
          childSnapshot.ref.update({ text: newText });
        }
      });
      todoItem.appendChild(editButton);
  
      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Delete";
      deleteButton.addEventListener("click", function () {
        childSnapshot.ref.remove();
      });
      todoItem.appendChild(deleteButton);
  
      todoList.appendChild(todoItem);
    });
  }
  
  database.ref("todos").on("value", function(snapshot) {
    renderTodos(snapshot);
  });

