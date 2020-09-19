/**** helper functions to modify the page ****/
function el(id) {
    return document.getElementById(id);
}

// show and hide a spinner (loading indicator)
function showSpinner(id) {
    el(id).style.display = 'inline-block';
}
function hideSpinner(id) {
    el(id).style.display = 'none';
}

// set the text of a result element
function showResult(id, text) {
    el(id).innerText = text;
}


/**** Exercise start here ****/

function loadSpaceHero() {
    showSpinner('spinnerSpace');

    const loadPromise = fetch('https://swapi.dev/api/people/1');
    loadPromise.then(response => {

        const convertPromise = response.json();
        convertPromise.then(spaceHero => {

            console.log(spaceHero);

            // TODO: use the Space Hero's name from the API
            
            showResult('spaceHeroName', spaceHero.name);

            hideSpinner('spinnerSpace');
        });
    });
}

function loadPokemon() {
    showSpinner('spinnerPokemon');

    const loadPromise = fetch('https://pokeapi.co/api/v2/pokemon-species/39');
    loadPromise.then(response => {

        const convertPromise = response.json();
        convertPromise.then(pokemon => {

            // TODO: show the Pokémon name from the API
            // Bonus TODO: show the name in french or german

            console.log(pokemon);
            const german = pokemon.names.find(item => item.language.name === 'de');
            const french = pokemon.names.find(item => item.language.name === 'fr');

            showResult('pokemonName', `${pokemon.name} (IN), ${german.name} (DE), ${french.name} (FR)`)

            hideSpinner('spinnerPokemon')
        });
    });
}

async function loadCatFact() {
    showSpinner('spinnerCat');

    const response = await fetch('https://cat-fact.herokuapp.com/facts/random');
    
    // TODO: show the actual cat fact from the API
    
    const catFact = await response.json();

    showResult('catFact', catFact.text);
    hideSpinner('spinnerCat');
}

async function treasureHunt() {
    showSpinner('spinnerTreasure');
    
    const startUrl = 'https://awacademy-rest-api-treasure-hunt.azurewebsites.net/start';

    // TODO: Investigate response and find the treasure!

    //step 0 ---
    const start = await fetch(startUrl)
        .then(r => r.json())
        .then(res => res.roomUrl) //res.roomUrl

    //step 1 ---
    const correctDoor = await fetch(start)
        .then(r => r.json())
        .then(res => res.doorUrls[res.doorIndex])

    //step 2 ---
    let wizardUrl;
    const boxUrl = await fetch(correctDoor)
        .then(r => r.json())
        .then(res => {
            wizardUrl = res.wizardUrl
            return res.boxUrl
        }) 

    //step 3 ----
    const wizardFood = await fetch(wizardUrl)
        .then(r => r.json())
        .then(res => {
            const food = { type: res.desiredFoodType, weight: res.desiredFoodWeight }
            console.log(food)
            return food;
        })

    //step 4 ---
    const wizardPOST = await fetch(wizardUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(wizardFood)
    })
        .then(r => r.json())
        .then(res => {
            console.log(res)
        })

    //step 5 ---
    let magicHeader = 'Magic-Token';
    const magicToken = await fetch(wizardUrl)
        .then(r => r.json())
        .then(res => {
            return res.magicToken
        })

    //setp 6 ---
    let treasureMap;
    const next6 = await fetch(boxUrl, { headers: { [magicHeader]: magicToken } })
        .then(r => r.json())
        .then(res => {
            console.log(res)
            treasureMap = res.instructions.substring(17, 1000)
        })

    //step 7 ---
    const deleteLock = await fetch(treasureMap, {
        method: 'DELETE',
        headers: { [magicHeader]: magicToken }
    })
        .then(r => r.json())
        .then(res => {
            console.log(res)
        })

    //step 8 ---
    const treasureLocation = await fetch(boxUrl, {
        method: 'GET',
        headers: { [magicHeader]: magicToken }
    })
        .then(r => r.json())
        .then(res => console.log(res))


    //step 9 ---
    const treasureChest = await fetch(boxUrl, {
        method: 'GET',
        headers: { [magicHeader]: magicToken }
    })
        .then(r => r.headers)
        .then(res => res.get('Treasure-Is-Hidden-Here'))

    //step 10 ---
    const treasure = await fetch(treasureChest)
    .then(r=> r.json())
    .then(res => showResult('treasure', res.treasure))

    hideSpinner('spinnerTreasure');
}