//Создай фронтенд часть приложения поиска данных о стране по её частичному 
//или полному имени.

//HTTP-запросы
//Используй публичный API Rest Countries, а именно ресурс name, возвращающий 
//массив объектов стран удовлетворивших критерий поиска.Добавь минимальное 
//оформление элементов интерфейса.

//Напиши функцию fetchCountries(name) которая делает HTTP-запрос на ресурс name 
//и возвращает промис с массивом стран - результатом запроса.Вынеси её в 
//отдельный файл fetchCountries.js и сделай именованный экспорт.

//Фильтрация полей
//В ответе от бэкенда возвращаются объекты, большая часть свойств которых тебе 
//не пригодится.Чтобы сократить объем передаваемых данных добавь строку 
//параметров запроса - так этот бэкенд реализует фильтрацию полей.Ознакомься 
//с документацией синтаксиса фильтров.

//Тебе нужны только следующие свойства:

//name.official - полное имя страны
//capital - столица
//population - население
//flags.svg - ссылка на изображение флага
//languages - массив языков
//Поле поиска
//Название страны для поиска пользователь вводит в текстовое поле 
//input#search - box.HTTP - запросы выполняются при наборе имени страны, 
//то есть по событию input.Но, делать запрос при каждом нажатии клавиши нельзя, 
//так как одновременно получится много запросов и они будут выполняться в 
//непредсказуемом порядке.

//Необходимо применить приём Debounce на обработчике события и делать 
//HTTP - запрос спустя 300мс после того, как пользователь перестал вводить 
//текст.Используй пакет lodash.debounce.

//Если пользователь полностью очищает поле поиска, то HTTP-запрос не выполняется,
// а разметка списка стран или информации о стране пропадает.

//Выполни санитизацию введенной строки методом trim(), это решит проблему когда
// в поле ввода только пробелы или они есть в начале и в конце строки.

//Интерфейс
//Если в ответе бэкенд вернул больше чем 10 стран, в интерфейсе пояляется 
//уведомление о том, что имя должно быть более специфичным.Для уведомлений 
//используй библиотеку notiflix и выводи такую строку "Too many matches found.
// Please enter a more specific name.".

//Если результат запроса это массив с одной страной, в интерфейсе отображается
// разметка карточки с данными о стране: флаг, название, столица, население и 
//языки.

//Обработка ошибки
//Если пользователь ввёл имя страны которой не существует, бэкенд вернёт не 
//пустой массив, а ошибку со статус кодом 404 - не найдено.Если это не 
//обработать, то пользователь никогда не узнает о том, что поиск не дал 
//результатов.Добавь уведомление "Oops, there is no country with that name" в 
//случае ошибки используя библиотеку notiflix.




import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from "./fetchCountries.js";

const DEBOUNCE_DELAY = 300;

const refs =  {
        searchBox: document.querySelector("#search-box"),
        countryList: document.querySelector(".country-list"),
        countryInfo: document.querySelector(".country-info"),
};

refs.searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
    // метод preventDefault() запрещает странице перезагружаться во время введения запроса
    event.preventDefault();
    
    // метод trim() выполняет санитизацию введенной строки (срезает пробелы по бокам при вводе текста)
    const inputText = refs.searchBox.value.trim();
    
        if (inputText === '') {
            resetMarkup();
            return;
    }
        // вызывает функцию, которая делает запрос на back-end
        fetchCountries(inputText)
        // при успешном выполнении промиса -> выполняет функцию, котрая добавляет разметку
        .then(renderCountryCard)
        // в случае наличия ошибки -> вызывает функцию, которая показывает ошибку
        .catch(onFetchError);
    }


function resetMarkup() {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
}

function renderCountryCard(data) {
    resetMarkup();
    
    // если количество найденых стран больше 10 - показывает предупреждение
    if (data.length > 10) { 
        return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');      
        } 
    
    // если количество найденых стран больше 1 и меньше 10 - создается разметка со списокм стран
    if (data.length > 1 && data.length <= 10) {
        refs.countryList.innerHTML = createMarkupList(data);
    }

    // если найдена 1 страна - создается разметка информации о стране
    if (data.length === 1) {
        refs.countryInfo.innerHTML = createMarkupCountryInfo(data[0]);
    }
}

function createMarkupList(data) {
    return data
    .map(({ name, flags }) => {
        return `
        <li class="country-list__item">
            <img class="country-list__img" src="${flags.svg}" alt="Flag of ${name.official}">
            <span>${name.official}</span>
        </li>
        `;
    })
    .join('');
}

function createMarkupCountryInfo({ name, capital, population, flags, languages }) {
    return `
        <p>
            <img class="country-list__img" src="${flags.svg}" alt="Flag of ${name.official}">
            <span class="country-list__name">${name.official}</span>
        </p>
        <p>
            <span class="country-list__label">Capital: </span>
            ${capital}
        </p>
        <p>
            <span class="country-list__label">Population: </span>
            ${population}
        </p>
        <p>
            <span class="country-list__label">Languages: </span>
            ${Object.values(languages).join(', ')}
        </p>
        `;
}


function onFetchError(error) {
        resetMarkup();
        return Notiflix.Notify.failure('Oops, there is no country with that name');
}
