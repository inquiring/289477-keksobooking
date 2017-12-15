'use strict';

var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var MIN_ROOM = 1;
var MAX_ROOM = 5;
var MIN_GUEST = 1;
var MAX_GUEST = 10;
var MIN_X = 300;
var MAX_X = 900;
var MIN_Y = 135;
var MAX_Y = 500;
var OFFERS_COUNT = 8;
var ESC_KEYCODE = 27;

// строковый массив описаний домов
var OFFER_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

// строковый массив типов домов
var OFFER_TYPES = [
  'flat',
  'house',
  'bungalo'
];

// строковый массив времени (checkin, checkout)
var OFFER_TIMES = [
  '12:00',
  '13:00',
  '14:00'
];

// строковый массив преимуществ домов
var OFFER_FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

// Получение и отображение на сайте карты с пользовательскими пинами
var map = document.querySelector('.map');
var mapFiltersContainer = map.querySelector('.map__filters-container');
// Найдем шаблон, который мы будем копировать (только из map__card)
var offerTemplate = document.querySelector('template').content.querySelector('.map__card');

// Создание фрагмента документа и заполнение его разметкой по шаблону
// Данный фрагмент создает на карте пины (<button><img></button>)
var mapPins = map.querySelector('.map__pins');

// Функция, возвращает случайное целое число между min и max(включительно)
// min - минимально допустимое число
// max - максимально допустимое число
var getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var TYPES = {
  flat: {
    ru: 'Квартира'
  },
  bungalo: {
    ru: 'Бунгало'
  },
  house: {
    ru: 'Дом'
  }
};

// Функция, удаляющая все дочерние элементы (теги) заданного родительского узла
var cleanupChildNodes = function (parentNode) {
  var childNodes = parentNode.querySelectorAll('*');

  for (var i = 0; i < childNodes.length; i++) {
    parentNode.removeChild(childNodes[i]);
  }
};
// Функция добавления доступного удобства в квартире
var featureAdd = function (array) {
  var arrayLength = array.length;
  var featuresFragment = document.createDocumentFragment();

  for (var i = 0; i < arrayLength; i++) {
    var featureTag = document.createElement('li');
    featureTag.className = 'feature';

    switch (array[i]) {
      case 'wifi':
        featureTag.classList.add('feature--wifi');
        break;
      case 'dishwasher':
        featureTag.classList.add('feature--dishwasher');
        break;
      case 'parking':
        featureTag.classList.add('feature--parking');
        break;
      case 'washer':
        featureTag.classList.add('feature--washer');
        break;
      case 'elevator':
        featureTag.classList.add('feature--elevator');
        break;
      case 'conditioner':
        featureTag.classList.add('feature--conditioner');
        break;
    }
    // добавление класса с модификатором
    featuresFragment.appendChild(featureTag);
  }
  return featuresFragment;
};

var getRandomFeatures = function () {
  var arr = [];
  OFFER_FEATURES.forEach(function (item) {
    var isPush = getRandomInteger(0, 1);
    if (isPush === 1) {
      arr.push(item);
    }
  });
  if (arr.length === 0) {
    arr.push(OFFER_FEATURES[getRandomInteger(0, (OFFER_FEATURES.length - 1))]);
  }
  return arr;
};

// Главная функция, возвращает массив из 8 сгенерированных объектов с готовыми предложениями по недвижимости
var offers = [];

var fillOffers = function () {
  for (var i = 0; i < OFFERS_COUNT; i++) {
    offers[i] = {};
    offers[i].author = {};
    offers[i].author.avatar = 'img/avatars/user0' + (i + 1) + '.png';

    offers[i].offer = {};
    offers[i].offer.title = OFFER_TITLES[i];
    offers[i].offer.price = getRandomInteger(MIN_PRICE, MAX_PRICE);
    offers[i].offer.type = OFFER_TYPES[getRandomInteger(0, OFFER_TYPES.length - 1)];
    offers[i].offer.rooms = getRandomInteger(MIN_ROOM, MAX_ROOM);
    offers[i].offer.guests = getRandomInteger(MIN_GUEST, MAX_GUEST);
    offers[i].offer.checkin = OFFER_TIMES[getRandomInteger(0, OFFER_TIMES.length - 1)];
    offers[i].offer.checkout = OFFER_TIMES[getRandomInteger(0, OFFER_TIMES.length - 1)];
    offers[i].offer.features = getRandomFeatures();
    offers[i].offer.description = '';
    offers[i].offer.photos = [];

    offers[i].location = {};
    offers[i].location.x = getRandomInteger(MIN_X, MAX_X);
    offers[i].location.y = getRandomInteger(MIN_Y, MAX_Y);

    offers[i].offer.address = offers[i].location.x + ', ' + offers[i].location.y;
  }
};

var renderOffer = function (data) {

  var offerElement = offerTemplate.cloneNode(true);

  var avatar = offerElement.querySelector('.popup__avatar');
  var title = offerElement.querySelector('h3');
  var address = offerElement.querySelector('small');
  var price = offerElement.querySelector('.popup__price');
  var type = offerElement.querySelector('h4');
  var capacity = offerElement.querySelector('h4 + p');
  var stayTime = offerElement.querySelector('h4 + p + p');
  var description = offerElement.querySelector('ul + p');
  var featuresList = offerElement.querySelector('.popup__features');

  offerElement.className = 'map__card';
  avatar.src = data.author.avatar;
  title.textContent = data.offer.title;
  address.textContent = data.offer.address;
  price.innerHTML = data.offer.price + '&#x20bd;/ночь';
  type.textContent = TYPES[data.offer.type].ru;
  capacity.textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
  stayTime.textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;
  description.textContent = data.offer.description;
  cleanupChildNodes(featuresList);
  featuresList.appendChild(featureAdd(data.offer.features));

  return offerElement;

};

// Функция, создает на карте пины (<button><img></button>)
var createPin = function () {
  var pinFragment = document.createDocumentFragment();
  for (var i = 1; i < OFFERS_COUNT; i++) {
    var buttonPin = document.createElement('button');
    buttonPin.className = 'map__pin';
    buttonPin.setAttribute('data-num', i);
    buttonPin.setAttribute('tabinex', '0');
    var pinShiftX = 20; // смещение пина по X с учетом его размеров (в px)
    var pinShiftY = 60; // смещение пина по Y с учетом его размеров (в px)
    buttonPin.style.left = offers[i].location.x + pinShiftX + 'px';
    buttonPin.style.top = offers[i].location.y + pinShiftY + 'px';

    var imgPin = document.createElement('img');
    imgPin.src = offers[i].author.avatar;
    imgPin.width = 40;
    imgPin.height = 40;
    imgPin.draggable = false; // нельзя перетащить элемент

    buttonPin.appendChild(imgPin);
    pinFragment.appendChild(buttonPin);
  }
  return pinFragment;
};

// Получение пользовательского пина
var mapPinMain = document.querySelector('.map__pin--main');
// Получение пользовательской формы
var noticeForm = document.querySelector('.notice__form');
//
var fieldsetNoticeForm = noticeForm.querySelectorAll('fieldset');

// функция удаления класса
var removeClass = function (element, className) {
  return element.classList.remove(className);
};
// функция добавления класса
var addClass = function (element, className) {
  return element.classList.add(className);
};

// функция добавления атрибута
var setAttributeForm = function (elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].disabled = true;
  }
};

// функция удаления атрибута
var removeAttributeForm = function (elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].disabled = false;
  }
};

// получение номера из data - атрибута
var getDataNum = function (dataNum) {
  return parseInt(dataNum.data, 10);
};

var renderOfferPin = function (number) {

  var offer = renderOffer(offers[number]);

  map.insertBefore(offer, mapFiltersContainer);


  var mapCard = document.querySelector('.map__card');
  var popupClose = mapCard.querySelector('.popup__close');
  popupClose.addEventListener('click', onPopupClose);
  document.addEventListener('keydown', onKeyEscPress);
};

var removeOfferPin = function () {
  var controlPanels = map.querySelectorAll('article');
  for (var i = controlPanels.length - 1; i >= 0; i--) {
    map.removeChild(controlPanels[i]);
  }
};

var deactivatePin = function (element) {
  var statusPin = element.querySelector('.map__pin--active');

  if (statusPin) {
    removeClass(statusPin, 'map__pin--active');
    removeOfferPin();

  }
};

//  ---- ОБРАБОТЧИКИ СОБЫТИЙ ---  //
var onPinClick = function (evt) {

  evt.preventDefault();
  var pin = evt.currentTarget;

  deactivatePin(mapPins);

  addClass(pin, 'map__pin--active');

  renderOfferPin(getDataNum(pin));

};

var onPinMainClick = function () {
  // показ карты
  removeClass(map, 'map--faded');
  // активация формы (убирается opacity 0.3)
  removeClass(noticeForm, 'notice__form--disabled');
  // активация полей формы
  removeAttributeForm(fieldsetNoticeForm);
  // в блок mapPins добавляются Пины
  mapPins.appendChild(createPin());

  // найти и записать в переменную все "map__pin"
  var pinElements = mapPins.querySelectorAll('.map__pin:not(map__pin--main)');

  for (var i = 1; i < pinElements.length; i++) {
    pinElements[i].data = i;
    pinElements[i].addEventListener('click', onPinClick);
  }

  // отключаем событие чтобы не запустить отрисовку пинов при повторном нажатие главный пин
  mapPinMain.removeEventListener('mouseup', onPinMainClick);
};

var onPopupClose = function () {
  var mapCard = document.querySelector('.map__card');
  var popupClose = mapCard.querySelector('.popup__close');
  mapCard.classList.add('hidden');
  deactivatePin(mapPins);

  popupClose.addEventListener('click', onPopupClose);
};

var onKeyEscPress = function (event) {
  if (event.keyCode === ESC_KEYCODE) {
    onPopupClose();
    document.removeEventListener('keydown', onKeyEscPress);
  }
};

var loadPage = function () {
  if (noticeForm.classList.contains === 'notice__form--disabled') {
    setAttributeForm(fieldsetNoticeForm);
  } else {
    addClass(noticeForm, 'notice__form--disabled');
    setAttributeForm(fieldsetNoticeForm);
  }

  fillOffers();

  mapPinMain.addEventListener('mouseup', onPinMainClick);
};

loadPage();

// Сценарии взаимодействия пользователя с формой отправки данных
var validateForm = function () {
  var form = document.querySelector('.notice__form');

  var timein = form.querySelector('select#timein');
  var timeout = form.querySelector('select#timeout');
  var type = form.querySelector('select#type');
  var price = form.querySelector('input#price');
  var submitForm = form.querySelector('.form__submit');
  var roomNumber = form.querySelector('select#room_number');
  var capasityGuest = form.querySelector('select#capacity');
  var inputs = form.querySelectorAll('input');

  // синхронизация времени прибытия
  var syncTimeOfArrive = function (evt) {
    timeout.value = evt.target.value;
    timein.value = evt.target.value;
  };

  // Значение поля «Тип жилья» синхронизировано с минимальной ценой
  var syncHousungMinPrice = function (evt) {
    switch (evt.target.value) {
      case 'flat':
        price.value = 1000;
        break;
      case 'bungalo':
        price.value = 0;
        break;
      case 'house':
        price.value = 5000;
        break;
      case 'palace':
        price.value = 10000;
        break;
    }
  };

  type.addEventListener('change', function (evt) {

    var bungaloMinPrice = 0;
    var flatMinPrice = 1000;
    var houseMinPrice = 5000;
    var palaceMinPrice = 10000;

    switch (evt.target.value) {
      case 'bungalo':
        price.min = bungaloMinPrice;
        break;
      case 'flat':
        price.min = flatMinPrice;
        break;
      case 'house':
        price.min = houseMinPrice;
        break;
      case 'palace':
        price.min = palaceMinPrice;
        break;
    }
  });

  var setGuestInRooms = function (evt) {
    var quantityRooom = evt.target;

    switch (quantityRooom.value) {
      case '1':
        capasityGuest.value = 1;
        break;
      case '2':
        capasityGuest.value = 2;
        break;
      case '3':
        capasityGuest.value = 3;
        break;
      case '100':
        capasityGuest.value = 0;
        break;
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

  timein.addEventListener('change', syncTimeOfArrive);
  timeout.addEventListener('change', syncTimeOfArrive);
  type.addEventListener('change', syncHousungMinPrice);
  roomNumber.addEventListener('change', setGuestInRooms);
  submitForm.addEventListener('submit', checkValidity);
};

validateForm();
