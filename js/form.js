'use strict';

// form.js — модуль, который работает с формой объявления

// Сценарии взаимодействия пользователя с формой отправки данных
(function () {
  var OFFER_TIMES = ['12:00', '13:00', '14:00'];

  var TYPES_OF_HOUSING = ['flat', 'bungalo', 'house', 'palace'];
  var PRICE_OF_HOUSING = ['1000', '0', '5000', '10000'];

  var form = document.querySelector('.notice__form');

  var timein = form.querySelector('select#timein');
  var timeout = form.querySelector('select#timeout');
  var type = form.querySelector('select#type');
  var price = form.querySelector('input#price');
  var submitForm = form.querySelector('.form__submit');
  var roomNumber = form.querySelector('select#room_number');
  var capacity = form.querySelector('select#capacity');
  var inputs = form.querySelectorAll('input');

  // синхронизация времени прибытия
  var syncTimeOfArrive = function (elem1, elem2, arr1, arr2) {
    var selectedIndex = arr1.indexOf(elem1.value);
    elem2.value = arr2[selectedIndex];
  };


  // Значение поля «Тип жилья» синхронизировано с минимальной ценой
  var syncHousungMinPrice = function (elem1, elem2, arr1, arr2) {
    var selectedIndex = arr1.indexOf(elem1.value);
    elem2.min = arr2[selectedIndex];
    elem2.placeholder = arr2[selectedIndex];
  };

  // Значение поля "кол-во комнат синхронизированно с ДОПУСТИМЫМ количеством мест"
  var ROOMS_CAPACITY = {
    '1': ['1'],
    '2': ['2', '1'],
    '3': ['3', '2', '1'],
    '100': ['0']
  };
  var roomNumberChangeHandler = function () {
    if (capacity.options.length > 0) {
      [].forEach.call(capacity.options, function (item) {
        item.selected = (ROOMS_CAPACITY[roomNumber.value][0] === item.value) ? true : false;
        item.hidden = (ROOMS_CAPACITY[roomNumber.value].indexOf(item.value) >= 0) ? false : true;
      });
    }
  };

  /*
  valid: false // Поле валидно
  customError: false // Установленно специальное сообщение ошибки
  patternMismatch: false // Значение не удовлетворяет шаблону, установленному в атрибуте pattern
  rangeOverflow: false // Значение превосходит атрибут max
  rangeUnderflow: true // Значение меньше атрибута min
  stepMismatch: true // Значение не соответствует указаному шагу
  tooLong: false // Значение слишком длинное
  tooShort: false // Значение слишком короткое
  typeMismatch: false // Значение не соответствует указаному атрибуту type
  valueMissing: false // Отсутствует обязательное значение
  */
  var checkValidity = function () {
    for (var i = 0; i < inputs.length; i++) {
      var userNameInput = inputs[i];

      if (userNameInput.validity.tooShort) {
        userNameInput.setCustomValidity('Имя должно состоять минимум из 30-ти символов');

      } else if (userNameInput.validity.tooLong) {
        userNameInput.setCustomValidity('Имя не должно превышать 100-ти символов');

      } else if (userNameInput.validity.valueMissing) {
        userNameInput.setCustomValidity('Отсутствует обязательное значение');

      } else if (userNameInput.validity.rangeOverflow) {
        userNameInput.setCustomValidity('Не соответствует максимальному значению');

      } else if (userNameInput.validity.rangeUnderflow) {
        userNameInput.setCustomValidity('Не соответствует минимальному значению');
      }
    }
  };

  timein.addEventListener('change', function () {
    window.synchronizeFields(timein, timeout, OFFER_TIMES, OFFER_TIMES, syncTimeOfArrive);
  });

  timeout.addEventListener('change', function () {
    window.synchronizeFields(timein, timeout, OFFER_TIMES, OFFER_TIMES, syncTimeOfArrive);
  });

  type.addEventListener('change', function () {
    window.synchronizeFields(type, price, TYPES_OF_HOUSING, PRICE_OF_HOUSING, syncHousungMinPrice);
  });

  roomNumber.addEventListener('change', roomNumberChangeHandler);

  submitForm.addEventListener('submit', checkValidity);


})();
