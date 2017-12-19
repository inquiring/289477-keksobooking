'use strict';

// data.js — модуль, который создает данные


(function () {

  var OFFERS_COUNT = 8;

  // Массив — Заголовки объявлений
  var OFFERS_TITLES = [
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

  // Функция, возвращает случайное целое число между min и max(включительно)
  // min - минимально допустимое число
  // max - максимально допустимое число
  var getRandomInteger = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

  function fillOffers(expectedNumber) {
    var requestedOffers = [];
    var MIN_PRICE = 1000;
    var MAX_PRICE = 1000000;
    var MIN_GUEST = 1;
    var MAX_GUEST = 10;
    var MIN_X = 300;
    var MAX_X = 900;
    var MIN_Y = 135;
    var MAX_Y = 500;
    var MIN_ROOM = 1;
    var MAX_ROOM = 5;

    for (var i = 0; i < expectedNumber; i++) {
      var avatarSerial = i + 1;
      var selectedLocationX = getRandomInteger(MIN_X, MAX_X);
      var selectedLocationY = getRandomInteger(MIN_Y, MAX_Y);
      var selectedTitle = OFFERS_TITLES[i];

      requestedOffers[i] = {
        author: {
          avatar: 'img/avatars/user0' + avatarSerial + '.png'
        },

        offer: {
          title: selectedTitle,
          price: getRandomInteger(MIN_PRICE, MAX_PRICE),
          type: OFFER_TYPES[getRandomInteger(0, OFFER_TYPES.length - 1)],
          rooms: getRandomInteger(MIN_ROOM, MAX_ROOM),
          guests: getRandomInteger(MIN_GUEST, MAX_GUEST),
          checkin: OFFER_TIMES[getRandomInteger(0, OFFER_TIMES.length - 1)],
          checkout: OFFER_TIMES[getRandomInteger(0, OFFER_TIMES.length - 1)],
          features: getRandomFeatures(),
          description: '',
          photos: [],
          address: selectedLocationX + ', ' + selectedLocationY
        },

        location: {
          x: selectedLocationX,
          y: selectedLocationY
        }
      };
    }

    return requestedOffers;
  }

  window.data = {
    offersCount: OFFERS_COUNT,
    offers: fillOffers(OFFERS_COUNT)
  };

})();
