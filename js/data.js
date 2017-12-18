'use strict';

// data.js — модуль, который создает данные

(function () {
  window.getData = (function () {
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
    var getRandomInteger = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    var getRandomFeatures = function() {
      var arr = [];
      OFFER_FEATURES.forEach(function(item) {
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

    // Функция, удаляющая все дочерние элементы (теги) заданного родительского узла
    var cleanupChildNodes = function(parentNode) {
      var childNodes = parentNode.querySelectorAll('*');

      for (var i = 0; i < childNodes.length; i++) {
        parentNode.removeChild(childNodes[i]);
      }
    };


    // Главная функция, возвращает массив из 8 сгенерированных объектов с готовыми предложениями по недвижимости
    var offers = [];

    var fillOffers = function() {
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
      return offers;
    };
  });
})();

