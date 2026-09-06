let countries = {}
let mapReady = false

const map = new maplibregl.Map({
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: [0, 0],
    zoom: 2,
    container: document.getElementById('map')
})

map.on('load', () => {
    mapReady = true
})

fetch("countries.json")
    .then(res => res.json())
    .then(data => { countries = data; })
    .catch(() => console.error("Load failed"))

// const names = countries.keys()

document.getElementById("lookup-btn")
    .addEventListener("click", () => {
        clearCountryCard()
        const key = document.getElementById("country-name").value.trim().toLowerCase()
        const newKey = filterCountryNames(key)
        const data = countries[newKey]
        if (data) {
            renderCountryCard(data)
        } else {
            showError('Country not found')
        }
    })

document.getElementById('lookup-btn')
    .addEventListener('keydown', (e) => {
        if (e.key === 'Enter') document.getElementById('lookup-btn').click()
    })

document.getElementById('random-country-btn')
    .addEventListener('click', () => {
        clearCountryCard()
        const number = Math.round(Math.random() * (names.length - 1))
        const data = countries[names[number]]
        if (data) {
            renderCountryCard(data)
        } else {
            showError('Cannot provide random country')
        }
    })

document.getElementById('random-country-btn')
    .addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('random-country-btn').click()
        }
    })

function renderCountryCard(data) {
    document.getElementById('name').textContent = `${data['Name']}`
    document.getElementById('capital').textContent = `${data['Capital']}`
    document.getElementById('continent').textContent = `${data['Continent']}`
    document.getElementById('population').textContent = `${data['Population'].toString()}`
    document.getElementById('language').textContent = `${data['Language']}`
    document.getElementById('total-area').textContent = `${data['Area'].toString()} square km`
    document.getElementById('currency').textContent = `${data['Currency']}`
    if (mapReady) {
        map.flyTo({center: data['Center'], zoom: data['Zoom']})
    } else {
        map.on('load', () => {
            map.flyTo({center: data['Center'], zoom: data['Zoom']})
        })
    }
    document.getElementById('country-card').style.display = 'block'
}

function clearCountryCard() {
    document.getElementById('name').textContent = ''
    document.getElementById('capital').textContent = ''
    document.getElementById('continent').textContent = ''
    document.getElementById('population').textContent = ''
    document.getElementById('currency').textContent = ''

    const err = document.getElementById('error-msg')
    err.style.display = 'none'
    err.textContent = ''

    if (mapReady) {
        map.center = [0, 0]
        map.zoom = 2
    }
}

function showError(msg) {
    const err = document.getElementById('error-msg')
    err.textContent = msg
    err.style.display = 'flex'
}

function filterCountryNames(name) {
    let newName
    if (name === 'czech republic') {
        newName = 'czechia'
    } else if (['usa', 'us', 'united states of america'].includes(name)) {
        newName = 'united states'
    } else if (name === 'uk') {
        newName = 'united kingdom'
    } else if (name === 'ivory coast') {
        newName = 'cote d\'ivoire'
    } else if (['republic of congo', 'roc'].includes(name)) {
        newName = 'congo'
    } else if (['bosnia', 'herzegovina', 'bosnia and herzegovina'].includes(name)) {
        newName = 'bosnia & herzegovina'
    } else {
        newName = name
    }
    return newName
}
