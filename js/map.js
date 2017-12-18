'use strict';

// data.js — модуль, который создает данные

(function () {

  var ESC_KEYCODE = 27;

  // Получение и отображение на сайте карты с пользовательскими пинами
  var map = document.querySelector('.map');
  var mapFiltersContainer = map.querySelector('.map__filters-container');

  // Создание фрагмента документа и заполнение его разметкой по шаблону
  // Данный фрагмент создает на карте пины (<button><img></button>)
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

  var renderOfferPin = function (number) {

    var offer = window.card.renderOffer(window.data.offers[number]);

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
    mapPins.appendChild(window.createPin());

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

    // fillOffers();

    mapPinMain.addEventListener('mouseup', onPinMainClick);
  };

  loadPage();
})();
