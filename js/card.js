'use strict';

// card.js — модуль для отрисовки элемента на карточке

(function () {
  // Найдем шаблон, который мы будем копировать (только из map__card)
  var offerTemplate = document.querySelector('template').content.querySelector('.map__card');
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
  window.renderOffer = function (data) {

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
})();
