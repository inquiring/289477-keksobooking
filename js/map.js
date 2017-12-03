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

var renderOffer = function (offers) {
  for (var i = 0; i < OFFERS_COUNT; i++) {

    var offer = offerTemplate.cloneNode(true);

    var avatar = offer.querySelector('.popup__avatar');
    var title = offer.querySelector('h3');
    var address = offer.querySelector('small');
    var price = offer.querySelector('.popup__price');
    var type = offer.querySelector('h4');
    var capacity = offer.querySelector('h4 + p');
    var stayTime = offer.querySelector('h4 + p + p');
    var description = offer.querySelector('ul + p');
    var featuresList = offer.querySelector('.popup__features');

    offer.className = 'map__card';
    avatar.src = offers[i].author.avatar;
    title.textContent = offers[i].offer.title;
    address.textContent = offers[i].offer.address;
    price.innerHTML = offers[i].offer.price + '&#x20bd;/ночь';
    type.textContent = translatorInRussian(offers[i].offer.type);
    capacity.textContent = offers[i].offer.rooms + ' комнаты для ' + offers[i].offer.guests + ' гостей';
    stayTime.textContent = 'Заезд после ' + offers[i].offer.checkin + ', выезд до ' + offers[i].offer.checkout;
    description.textContent = offers[i].offer.description;
    cleanupChildNodes(featuresList);
    featuresList.appendChild(featureAdd(offers[i].offer.features));
  }
  return offersFragment.appendChild(offer);

};


map.classList.remove('map--faded');


renderOffer();
fillOffers();
