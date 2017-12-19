'use strict';

// pin.js — модуль для отрисовки пина и взаимодействия с ним

// Функция, создает на карте пины (<button><img></button>)
(function () {
  var createPin = function () {

    var pinFragment = document.createDocumentFragment();
    for (var i = 1; i < window.data.offersCount; i++) {
      var buttonPin = document.createElement('button');
      buttonPin.className = 'map__pin';
      buttonPin.setAttribute('data-num', i);
      buttonPin.setAttribute('tabinex', '0');
      var pinShiftX = 20; // смещение пина по X с учетом его размеров (в px)
      var pinShiftY = 60; // смещение пина по Y с учетом его размеров (в px)
      buttonPin.style.left = window.data.offers[i].location.x + pinShiftX + 'px';
      buttonPin.style.top = window.data.offers[i].location.y + pinShiftY + 'px';

      var imgPin = document.createElement('img');
      imgPin.src = window.data.offers[i].author.avatar;
      imgPin.width = 40;
      imgPin.height = 40;
      imgPin.draggable = false; // нельзя перетащить элемент

      buttonPin.appendChild(imgPin);
      pinFragment.appendChild(buttonPin);
    }
    return pinFragment;
  };

  window.pin = {
    createPin: createPin()
  };

})();
