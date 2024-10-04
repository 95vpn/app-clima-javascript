const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
});

function buscarClima(e) {
    e.preventDefault();

    console.log('Buscando el Clima')

    // Validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if (ciudad === '' || pais === '') {
        //hubo un error
        mostrarError('Ambos campos son obligatorios')

        return;
    }

    // Consultariamos la API

    consultarAPI(ciudad, pais);
}

function mostrarError(mensaje) {
    console.log(mensaje)
    const alerta = document.querySelector('.mostrarError')

    if (!alerta) {
        // crear una alerta
        const alerta = document.createElement('div');
        alerta.classList.add('mostrarError')
        alerta.innerHTML = `
          <strong>Error</strong>
            <span>${mensaje}</span>
        `
        container.appendChild(alerta)

        //Se ELIMINE LA ALERTA

        setTimeout(() => {
            alerta.remove()
        }, 5000);
    }
    
}

function consultarAPI(ciudad, pais) {
    const appId = 'bcb55e8cac4d1441c4371981fc4a5b89';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`
    Spinner()

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            limpiarHTML(); // LIMPIAR EL HTML previo
            if(datos.cod === "404") {
                mostrarError('Ciudad no encontrada')
                return
            }
            //Imprime la respuesta en el HTML
            mostrarClima(datos);
        })


}

function mostrarClima(datos) {
    const {name, main: { temp, temp_max, temp_min }} = datos;

    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${name}`
    nombreCiudad.classList.add('mostrarClima')
    
    const actual = document.createElement('p')
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('mostrarClima');

    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Max: ${max} &#8451;`;
    tempMaxima.classList.add('temp-max');

    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `Min: ${min} &#8451;`;
    tempMinima.classList.add('temp-max');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('datos');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);


    resultado.appendChild(resultadoDiv)
}

const kelvinACentigrados = grados => parseInt(grados - 273.15);

function limpiarHTML() {
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
} 

function Spinner() {

    limpiarHTML();

    const divSpiner = document.createElement('div')
    divSpiner.classList.add('spinner')
    
    resultado.appendChild(divSpiner)

}