'use strict';

// Функция показывает карточку выбранного жилья по нажатию на метку на карте

window.showCard = (function () {
  var ESC_KEYCODE = 27;
  var map = document.querySelector('.map');
  var mapFiltersContainer = map.querySelector('.map__filters-container');
  var mapPins = map.querySelector('.map__pins');

  var onPopupClose = function () {
    var mapCard = document.querySelector('.map__card');
    var popupClose = mapCard.querySelector('.popup__close');
    mapCard.classList.add('hidden');
    window.deactivatePin(mapPins);
    popupClose.addEventListener('click', onPopupClose);
  };

  var onKeyEscPress = function (event) {
    if (event.keyCode === ESC_KEYCODE) {
      onPopupClose();
      document.removeEventListener('keydown', onKeyEscPress);
    }
  };

  return function (number) {

    var offer = window.renderOffer(window.data.offers[number]);

    map.insertBefore(offer, mapFiltersContainer);


    var mapCard = document.querySelector('.map__card');
    var popupClose = mapCard.querySelector('.popup__close');
    popupClose.addEventListener('click', onPopupClose);
    document.addEventListener('keydown', onKeyEscPress);
  };


})();
