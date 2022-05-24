const StorageController = (() => {
  function setItem(item) {
    let items;

    if (localStorage.getItem('items') === null) {
      items = [];
      items.push(item);
    } else {
      items = JSON.parse(localStorage.getItem('items'));
      items.push(item);
    }

    localStorage.setItem('items', JSON.stringify(items));
  }

  function getItems() {
    let items;

    if (localStorage.getItem('items') === null) {
      items = [];
      return items;
    } else {
      items = JSON.parse(localStorage.getItem('items'));
      return items;
    }
  }

  function updateItem(updatedItem) {
    const items = JSON.parse(localStorage.getItem('items'));

    const newItems = items.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );

    localStorage.setItem('items', JSON.stringify(newItems));
  }

  function deleteItem(id) {
    const items = getItems();

    const newItems = items.filter((item) => item.id !== id);

    localStorage.setItem('items', JSON.stringify(newItems));
  }

  function clearAllItems() {
    localStorage.removeItem('items');
  }

  return {
    setItem,
    getItems,
    updateItem,
    deleteItem,
    clearAllItems,
  };
})();

const ItemController = (() => {
  class Item {
    constructor(id, name, calories) {
      this.id = id;
      this.name = name;
      this.calories = calories;
    }
  }

  const state = {
    items: StorageController.getItems(),
    currentItem: null,
    totalCalories: 0,
  };

  function getItems() {
    return state.items;
  }

  function addItem(name, calories) {
    let ID;

    const items = getItems();

    if (items.length === 0) {
      ID = 0;
    } else {
      ID = items[items.length - 1].id + 1;
    }

    calories = parseInt(calories);

    const newItem = new Item(ID, name, calories);

    StorageController.setItem(newItem);

    return newItem;
  }

  function getTotalCalories() {
    let total = 0;

    const items = getItems();

    items.forEach((item) => (total += item.calories));

    state.totalCalories = total;

    return state.totalCalories;
  }

  function getItemById(id) {
    const items = getItems();

    const item = items.find((item) => item.id === id);

    return item;
  }

  function editItem({ id }) {
    const { name, calories } = UIController.getInputs();

    const itemToEdit = getItemById(id);

    itemToEdit.name = name;
    itemToEdit.calories = parseInt(calories);

    return itemToEdit;
  }

  function deleteItem(id) {
    const newItems = state.items.filter((item) => item.id !== id);

    state.items = newItems;
  }

  function deleteAllItems() {
    state.items = [];
  }

  function setCurrentItem(item) {
    state.currentItem = item;
  }

  function getCurrentItem() {
    return state.currentItem;
  }

  return {
    getItems,
    addItem,
    getTotalCalories,
    getItemById,
    setCurrentItem,
    getCurrentItem,
    editItem,
    deleteItem,
    deleteAllItems,
  };
})();

const UIController = (() => {
  const selectors = {
    itemList: '.collection',
    mealNameInput: '#meal',
    mealCaloriesInput: '#calories',
    totalCaloriesText: '.total-calories',
    addBtn: '.add-btn',
    editBtn: '.edit-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemForm: '.item-form',
    item: '.collection-item',
    clearBtn: '.clear-btn',
  };

  function populateListItems(items) {
    let output = '';

    items.forEach((item) => {
      output += `
      <li class="collection-item" id="item-${item.id}"><strong>${item.name}: </strong><em>${item.calories} calories</em>
        <a href="#" class="secondary-content"><i class="fa-solid fa-pen-to-square fa-lg edit-item"></i></a>
      </li>`;
    });

    document.querySelector(selectors.itemList).innerHTML = output;
  }

  function getSelectors() {
    return selectors;
  }

  function getInputs() {
    return {
      name: document.querySelector(selectors.mealNameInput).value,
      calories: document.querySelector(selectors.mealCaloriesInput).value,
    };
  }

  function addItemToList({ name, calories, id }) {
    document.querySelector(selectors.itemList).style.display = 'block';

    const li = document.createElement('li');
    li.className = 'collection-item';
    li.id = `item-${id}`;

    li.innerHTML = `
      <strong>${name}: </strong><em>${calories} calories</em>
      <a href="#" class="secondary-content"><i class="fa-solid fa-pen-to-square fa-lg edit-item"></i></a>
    `;

    document
      .querySelector(selectors.itemList)
      .insertAdjacentElement('afterbegin', li);
  }

  function clearInputs() {
    document.querySelector(selectors.mealNameInput).value = '';
    document.querySelector(selectors.mealCaloriesInput).value = '';
  }

  function hideList() {
    document.querySelector(selectors.itemList).style.display = 'none';
  }

  function showTotalCalories(totalCalories) {
    document.querySelector(selectors.totalCaloriesText).innerText =
      totalCalories;
  }

  function editListItem({ name, calories, id }) {
    const items = Array.from(document.querySelectorAll(selectors.item));

    items.forEach((item) => {
      const itemId = parseInt(item.id.split('-')[1]);

      if (itemId === id) {
        item.innerHTML = `
        <strong>${name}: </strong><em>${calories} calories</em>
        <a href="#" class="secondary-content">
          <i class="fa-solid fa-pen-to-square fa-lg edit-item"></i>
        </a>
      `;
      }
    });
  }

  function deleteListItem(id) {
    const itemId = `#item-${id}`;
    const item = document.querySelector(itemId);

    item.remove();
  }

  function hideEditState() {
    document.querySelector(selectors.mealNameInput).value = '';
    document.querySelector(selectors.mealCaloriesInput).value = '';

    document.querySelector(selectors.editBtn).style.display = 'none';
    document.querySelector(selectors.deleteBtn).style.display = 'none';
    document.querySelector(selectors.backBtn).style.display = 'none';
    document.querySelector(selectors.addBtn).style.display = 'inline';
  }

  function showEditState() {
    document.querySelector(selectors.editBtn).style.display = 'inline';
    document.querySelector(selectors.deleteBtn).style.display = 'inline';
    document.querySelector(selectors.backBtn).style.display = 'inline';
    document.querySelector(selectors.addBtn).style.display = 'none';
  }

  function addItemToForm({ name, calories }) {
    document.querySelector(selectors.mealNameInput).value = name;
    document.querySelector(selectors.mealCaloriesInput).value = calories;
    showEditState();
  }

  function clearAllItems() {
    while (document.querySelector(selectors.itemList).firstChild) {
      document.querySelector(selectors.itemList).firstChild.remove();
    }
  }

  return {
    populateListItems,
    getSelectors,
    getInputs,
    addItemToList,
    clearInputs,
    hideList,
    showTotalCalories,
    hideEditState,
    addItemToForm,
    editListItem,
    deleteListItem,
    clearAllItems,
  };
})();

const AppController = ((ItemController, StorageController, UIController) => {
  function loadEventListeners() {
    const selectors = UIController.getSelectors();
    document
      .querySelector(selectors.addBtn)
      .addEventListener('click', submitAddItem);

    document
      .querySelector(selectors.itemList)
      .addEventListener('click', itemEditClick);

    document
      .querySelector(selectors.editBtn)
      .addEventListener('click', itemEditSubmit);

    document
      .querySelector(selectors.itemForm)
      .addEventListener('keypress', disallowEnter);

    document
      .querySelector(selectors.backBtn)
      .addEventListener('click', UIController.hideEditState);

    document
      .querySelector(selectors.deleteBtn)
      .addEventListener('click', itemDeleteSubmit);

    document
      .querySelector(selectors.clearBtn)
      .addEventListener('click', clearAllItemsClick);
  }

  function itemEditClick(event) {
    event.preventDefault();

    if (event.target.classList.contains('edit-item')) {
      const itemToEditId = parseInt(
        event.target.parentNode.parentNode.id.split('-')[1]
      );
      const itemToEdit = ItemController.getItemById(itemToEditId);
      ItemController.setCurrentItem(itemToEdit);
      UIController.addItemToForm(itemToEdit);
    }
  }

  function itemEditSubmit(event) {
    event.preventDefault();

    const item = ItemController.getCurrentItem();

    const updatedItem = ItemController.editItem(item);

    UIController.editListItem(updatedItem);

    StorageController.updateItem(updatedItem);

    const totalCalories = ItemController.getTotalCalories();
    UIController.showTotalCalories(totalCalories);

    UIController.hideEditState();
  }

  function submitAddItem(event) {
    event.preventDefault();

    const { name, calories } = UIController.getInputs();

    if (name.trim() === '' || calories.trim() === '') {
      return;
    } else {
      const newItem = ItemController.addItem(name, calories);
      UIController.addItemToList(newItem);
      UIController.clearInputs();

      const totalCalories = ItemController.getTotalCalories();
      UIController.showTotalCalories(totalCalories);
    }
  }

  function itemDeleteSubmit(event) {
    event.preventDefault();

    const item = ItemController.getCurrentItem();

    ItemController.deleteItem(item.id);
    UIController.deleteListItem(item.id);
    StorageController.deleteItem(item.id);

    const totalCalories = ItemController.getTotalCalories();
    UIController.showTotalCalories(totalCalories);

    UIController.hideEditState();
  }

  function clearAllItemsClick() {
    ItemController.deleteAllItems();
    UIController.clearAllItems();
    StorageController.clearAllItems();

    const totalCalories = ItemController.getTotalCalories();
    UIController.showTotalCalories(totalCalories);

    UIController.hideList();
  }

  function disallowEnter(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      return false;
    }
  }

  function init() {
    loadEventListeners();
    UIController.hideEditState();

    const items = ItemController.getItems();

    if (items.length === 0) {
      UIController.hideList();
    } else {
      UIController.populateListItems(items);
    }

    const totalCalories = ItemController.getTotalCalories();
    UIController.showTotalCalories(totalCalories);
  }

  return {
    init,
  };
})(ItemController, StorageController, UIController);

AppController.init();
