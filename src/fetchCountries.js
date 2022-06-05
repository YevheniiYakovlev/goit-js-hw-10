export function fetchCountries(name) {
    
    const BASE_URL = `https://restcountries.com/v3.1/name/`
    const options = `?fields=name,capital,population,flags,languages`;
    
    return fetch(`${BASE_URL}/${name}${options}`)
            .then(response => {
                if (!response.ok) {
                    // throw если видит ошибку - прерывает выполнение кода и отправляет ошибку в catch
                    throw new Error(response.status);
                }

                return response.json();
    });
}
