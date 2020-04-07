﻿// 'Elena Hamilton'.match(/ha/gi)
(async function () {
    var state = {
        state: false,
        setState: function (valor) {
            return state.state = valor;
        },
        dados: '',
    }

    await axios({
        "method": "GET",
        "url": "https://covid-193.p.rapidapi.com/statistics",
        "headers": {
            "content-type": "application/octet-stream",
            "x-rapidapi-host": "covid-193.p.rapidapi.com",
            "x-rapidapi-key": "00c807a539msh1b3934baa63aa46p1456f6jsnbd0191efd24b"
        }
    }).then((response) => {
        return response.data;
    }).then((date) => {
        state.dados = date;
        document.querySelector("#valor").innerHTML = JSON.stringify(date);
    }).catch((error) => {
        console.log(error)
    });
    document.querySelector('button.button').addEventListener('click', loadCountry);

    function show(e) {
        return document.querySelector('[data-js="result"]').innerHTML = `
        <div>
        <h1> ${e.country} </h1>
        </div>
        <span>Data ${e.time.slice(0,10)}</span>
        <div id="estatistica">
            <div>
                <h3>Casos Novos</h3>
                <span>${e.cases.new}</span>
            </div>
            <div>
                <h3>Total</h3>
                <span>${e.cases.total}</span>
            </div>
            <div>
                <h3>Ativo</h3>
                <span>${e.cases.active}</span>
            </div>
            <div>
                <h3>Crítico</h3>
                <span>${e.cases.critical}</span>
            </div>
            <div>
                <h3>Recuperado</h3>
                <span>${e.cases.recovered}</span>
            </div>
            
            <div>
                <h3>Total de Mortes</h3>
                <span>${e.deaths.total}</span>
            </div>
        </div>
        `;
    }

    function loadCountry() {
        const input = document.querySelector('input').value;
        // img in loading 

        document.querySelector('[data-js="result"]').innerHTML = `
            <img
                src="./image/loading.gif"
                alt="Covid-19"
                class="loading"
            />`;
        state.dados.response.forEach((e, id) => {
            if (e.country.includes(input.slice(0, 1).toLocaleUpperCase() + input.slice(1))) {
                show(e);
                state.setState(true);
            }
        });
        // Fazendo requisição 

        // Caso não tiver valor 
        if (!state.state) {
            document.querySelector('[data-js="result"]').innerHTML = `
            <h2> País não encontrado ! -_- </h2>
    
    `;
        }
    }

})();

/* Auto complete */
(async function () {
    const valorCountry = {
        stateGet: [],
        stateSet: function (valor) {
            return this.stateGet = valor;
        },
        autoComplete: function (country) {
            const countryComplete = this.stateGet;
            return countryComplete.filter((value) => {
                return value.country.includes(country);
            })
        }
    };
    function addEvente(){      
        document.querySelectorAll('.sugg').forEach((a)=>{
            a.addEventListener('click', ()=>{
                document.querySelector('input').value = a.childNodes[0].wholeText;
                loadCountry();
            })
        })
    }
    await fetch('./JS/req.json')
        .then((dados) => dados.json())
        .then((dados) => {
            return valorCountry.stateSet(dados.response);
        })
        .catch((error) => {
            console.log(error)
        });

    document.querySelector('#input').addEventListener("input", autocompleteDisplay)

    function autocompleteDisplay({ target }) {
        const Sugestao = document.querySelector('#sugestao');
        const dataCamp = target.value;
        if (dataCamp.length) {
            const valueComplet = valorCountry.autoComplete(dataCamp);
            Sugestao.innerHTML = ``;
            for (let index = 0; index < 3; index++) {
                if(valueComplet[index]){
                    Sugestao.innerHTML += `
                    <p class="sugg">${valueComplet[index].country}</p>
                    `;
                }
                
            }
            if(!!valueComplet[0]){
                addEvente();
            }
        } else {
            Sugestao.innerHTML = ``;
        }

    }
})();
