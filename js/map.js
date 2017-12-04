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
// var MAP_PIN_WIDTH = 62;
// var MAP_PIN_HEIGHT = 83;
var OFFERS_COUNT = 8;

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
  'houses',
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
// Найдем шаблон, который мы будем копировать
var offerTemplate = document.querySelector('template').content.querySelector('.map__card');
var offersFragment = document.createDocumentFragment();

// Создание фрагмента документа и заполнение его разметкой по шаблону
// Данный фрагмент создает на карте пины (<button><img></button>)
var pinsContainer = map.querySelector('.map__pins');
var pinsFragment = document.createDocumentFragment();

// Функция, возвращает случайное целое число между min и max(включительно)
// min - минимально допустимое число
// max - максимально допустимое число
var getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Функция, перводит на русский язык тип жилья
// key — на вход принимается элемент для перевода
// translator — переведенное значение
var translatorInRussian = function (key) {
  var translator = '';
  switch (key) {
    case 'flat':
      translator = 'Квартира';
      break;
    case 'house':
      translator = 'Дом';
      break;
    case 'bungalo':
      translator = 'Бунгало';
      break;
  }
  return translator;
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
    offers[i].offer.features = getRandomInteger(OFFER_FEATURES);
    offers[i].offer.description = '';
    offers[i].offer.photos = [];

    offers[i].location = {};
    offers[i].location.x = getRandomInteger(MIN_X, MAX_X);
    offers[i].location.y = getRandomInteger(MIN_Y, MAX_Y);

    offers[i].offer.address = offers[i].location.x + ', ' + offers[i].location.y;
  }
  return offers;
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
  type.textContent = translatorInRussian(data.offer.type);
  capacity.textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
  stayTime.textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;
  description.textContent = data.offer.description;
  // cleanupChildNodes(featuresList);
  // featuresList.appendChild(featureAdd(data.offer.features));

  return offerElement;

};
// Данный фрагмент создает на карте пины (<button><img></button>)

var createPin = function (data) {
  for(var i = 0; i < 8; i++) {
    var pin = document.createElement('button');
    pin.className = 'map__pin';
    var pinShiftX = 20;// смещение пина по X с учетом его размеров (в px)
    var pinShiftY = 60;// смещение пина по Y с учетом его размеров (в px)
    pin.style.left = data[i].location.x + pinShiftX + 'px';
    pin.style.top = data[i].location.y + pinShiftY + 'px';

    var img = document.createElement('img');
    img.src = data[i].author.avatar;
    img.width = 40;
    img.height = 40;
    img.draggable = false;// нельзя перетащить элемент

    pin.appendChild(img);
    pinsFragment.appendChild(pin);
  }
  return pinsContainer.appendChild(pinsFragment);
}

var appendOffer = function () {
  var fragment = document.createDocumentFragment();

  // Отрисуем наш шаблон в документ
  for (var j = 0; j < OFFERS_COUNT; j++) {
    fragment.appendChild(renderOffer(offers[j]));
  }
  offersFragment.appendChild(fragment);
};


map.classList.remove('map--faded');

fillOffers();
appendOffer();
createPin(offers);
