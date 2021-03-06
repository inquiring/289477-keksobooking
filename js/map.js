'use strict';

// data.js — модуль, который создает данные

(function () {

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');


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

  var removeOfferPin = function () {
    var controlPanels = map.querySelectorAll('article');
    for (var i = controlPanels.length - 1; i >= 0; i--) {
      map.removeChild(controlPanels[i]);
    }
  };

  window.deactivatePin = function (element) {
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

    window.deactivatePin(mapPins);

    addClass(pin, 'map__pin--active');

    window.showCard(getDataNum(pin));

  };

  var onPinMainClick = function () {
    // показ карты
    removeClass(map, 'map--faded');
    // активация формы (убирается opacity 0.3)
    removeClass(noticeForm, 'notice__form--disabled');
    // активация полей формы
    removeAttributeForm(fieldsetNoticeForm);
    // в блок mapPins добавляются Пины
    mapPins.appendChild(window.pin.createPin);

    // найти и записать в переменную все "map__pin"
    var pinElements = mapPins.querySelectorAll('.map__pin:not(map__pin--main)');

    for (var i = 1; i < pinElements.length; i++) {
      pinElements[i].data = i;
      pinElements[i].addEventListener('click', onPinClick);
    }

    // отключаем событие чтобы не запустить отрисовку пинов при повторном нажатие главный пин
    mapPinMain.removeEventListener('mouseup', onPinMainClick);
  };


  var loadPage = function () {
    if (noticeForm.classList.contains === 'notice__form--disabled') {
      setAttributeForm(fieldsetNoticeForm);
    } else {
      addClass(noticeForm, 'notice__form--disabled');
      setAttributeForm(fieldsetNoticeForm);
    }

    mapPinMain.addEventListener('mouseup', onPinMainClick);
  };

  loadPage();
  //
  var coords = document.querySelector('#address');
  var setInitialPosition = function () {
    var styles = window.getComputedStyle(mapPinMain);
    coords.value = 'x: ' + parseInt(styles.left, 10) + ', y: ' + parseInt(styles.top, 10);
  };
  setInitialPosition();

  mapPinMain.addEventListener('mousedown', function (evt) {

    evt.preventDefault();

    // координаты точки, с которой мы начали перемещать pin
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      var minIntervalY = 100;
      var maxIntervalY = 500;
      var minIntervalX = 300;
      var maxIntervalX = 1400;

      if ((moveEvt.clientY > minIntervalY && moveEvt.clientY < maxIntervalY) && (moveEvt.clientX > minIntervalX && moveEvt.clientX < maxIntervalX)) {
        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };
        mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
        mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';
      }
    };
    var onMouseUp = function (upEvt) {

      upEvt.preventDefault();
      var address = document.querySelector('#address');
      var addressPoint = ['x: ' + upEvt.clientX, 'y: ' + upEvt.clientY];
      address.value = addressPoint.join(', ');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

  });

})();
