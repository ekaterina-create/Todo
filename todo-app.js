(function () {
  //создание заголовка
  function createAppTitle(title) {
    let appTitle = document.createElement("h2");
    appTitle.innerHTML = title;

    return appTitle;
  }
  //создание формы с кнопкой и инпутом
  function createTodoItemForm() {
    let form = document.createElement("form");
    let input = document.createElement("input");
    let buttonWrapper = document.createElement("div");
    let button = document.createElement("button");

    form.classList.add("input-group", "mb-3");
    input.classList.add("form-control");
    input.placeholder = "Введите название нового дела";
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Добавить дело";
    button.disabled = true;

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    input.addEventListener("input", () => {
      button.disabled = input.value.trim() ? false : true;
    });

    return {
      form,
      input,
      button,
    };
  }
  //создание списка
  function createTodoList() {
    let list = document.createElement("ul");
    list.classList.add("list-group");

    return list;
  }

  let items = [];

  //создание нового дела с кнопками сделано и удалить
  function createTodoItem(element, key) {
    let item = document.createElement("li");
    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );

    item.name = element.name;
    item.done = element.done;
    item.textContent = item.name;

    if (item.done == true) {
      item.classList.add("list-group-item-success");
    }
    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Готово";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    items.push({ name: item.name, done: item.done });
    localStorage[key] = JSON.stringify(items);

    function onDoneButtonClick() {
      let doneClass = "list-group-item-success";
      item.classList.toggle(doneClass);

      if (item.classList.contains(doneClass)) {
        let doneItem = items.find((el) => el.name === item.name);
        doneItem.done = true;

        items.forEach(function (element, i) {
          if (element === item) items[i] = doneItem;
        });

        localStorage[key] = [];
        localStorage[key] = JSON.stringify(items);
      } else {
        let notDoneItem = items.find((el) => el.name === item.name);
        notDoneItem.done = false;

        items.forEach(function (element, i) {
          if (element === item) items[i] = notDoneItem;
        });

        localStorage[key] = [];
        localStorage[key] = JSON.stringify(items);
      }
    }
    function onDeleteButtonClick() {
      if (confirm("Вы уверены?")) {
        item.remove();
        let deleteItem = items.find((el) => el.name == item.name);
        items = items.filter((item) => item !== deleteItem);
        localStorage[key] = JSON.stringify(items);
      }
    }
    doneButton.addEventListener("click", onDoneButtonClick);

    deleteButton.addEventListener("click", onDeleteButtonClick);

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  //создание приложения todo
  function createTodoApp(container, title = "Список дел", key, defaultList) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();
    todoList.innerHTML = "";

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    let data = localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : defaultList;
    if (data) {
      data.forEach(function (el) {
        let localstorageItem = createTodoItem(el, key);
        todoList.append(localstorageItem.item);
      });
    }

    //отправляем форму
    todoItemForm.form.addEventListener("submit", (e) => {
      e.preventDefault();

      document.querySelector(".btn-primary").disabled = true;

      if (!todoItemForm.input.value) {
        return;
      }
      const item = {
        name: todoItemForm.input.value,
        done: false,
      };

      let todoItem = createTodoItem(item, key);

      todoList.append(todoItem.item);

      //очищаем поле отправки
      todoItemForm.input.value = "";
    });
  }

  window.createTodoApp = createTodoApp;
})();
