// #region Global Variables

let waterSources = [
    {
        name: 'Stream',
        cost: 100,
        basePrice: 100,
        flowRate: .15,
        amount: 0
    },
    {
        name: 'Creek',
        cost: 300,
        basePrice: 300,
        flowRate: .725,
        amount: 0
    }
]
let flowControllers = [
    {
        name: 'Bigger Inlets',
        cost: 200,
        basePrice: 800,
        deltaFlow: .1,
        amount: 0
    },
    {
        name: 'Turbine',
        cost: 1000,
        basePrice: 1000,
        deltaFlow: 1,
        amount: 1
    }
]
let clickUpgrades = [
    {
        name: 'Water Drop',
        cost: 10,
        basePrice: 10,
        power: 1,
        amount: 0
    },
    {
        name: 'Rain Storm',
        cost: 100,
        basePrice: 100,
        power: 5,
        amount: 0
    }
]

let electricity = 0
let electricityEarnedLifetime = 0
let maxElectricityOwned = 0
let water = 0
let waterCeiling = 100
let flow = .1
let multiplier = 1

// #endregion


// #region Game Logic

function clickDam() {
    let total = 1
    clickUpgrades.forEach(upgrade => total += upgrade.power * upgrade.amount)
    if (multiplier == 1) {
        water += total
    } else {
        electricity += total * multiplier
    }
}

function transferWater() {
    addWater()
    calculateFlow()
    draw()
    if (water > 0 && multiplier == 1) {
        electricity += flow
        electricityEarnedLifetime += flow
        water -= flow
    } else if (multiplier > 1) {
        electricity += water
        electricityEarnedLifetime += water
        water = 0
    }
    if (water < 0) {
        water = 0
    }
    recordElectricityRecord()
}

function calculateFlow() {
    flowControllers.forEach(controller => flow += (controller.deltaFlow * controller.amount))
    flow *= water / 100
}

function addWater() {
    waterSources.forEach(source => {
        water += source.flowRate * source.amount * multiplier
    })
    if (water > waterCeiling && multiplier == 1)
        water = waterCeiling
}

// #endregion


// #region Purchase Handlers

function purchaseSourceUpgrade(name) {
    let waterSource = waterSources.find(source => source.name == name)
    if (electricity >= waterSource.cost) {
        waterSource.amount++
        electricity -= waterSource.cost
        findPrice(waterSource)
        document.getElementById(waterSource.name + '-amount').innerText = waterSource.amount
    } else {
        sweetAlert('Not enough Electricity', 'error')
    }
}

function purchaseFlowController(name) {
    let flowController = flowControllers.find(controller => controller.name == name)
    if (electricity >= flowController.cost) {
        flowController.amount++
        electricity -= flowController.cost
        findPrice(flowController)
        document.getElementById(flowController.name + '-amount').innerText = flowController.amount
    } else {
        sweetAlert('Not enough Electricity', 'error')
    }
}

function purchaseClickUpgrade(name) {
    let clickUpgrade = clickUpgrades.find(upgrade => upgrade.name == name)
    if (electricity >= clickUpgrade.cost) {
        clickUpgrade.amount++
        electricity -= clickUpgrade.cost
        findPrice(clickUpgrade)
        document.getElementById(clickUpgrade.name + '-amount').innerText = clickUpgrade.amount
    } else {
        sweetAlert('Not enough Electricity', 'error')
    }
}

// #endregion


// #region Draw/element constructors

function makeSourceUpgradeDivs() {
    waterSources.forEach(source => {
        let element = document.createElement('div')
        element.innerHTML = `
        <div class="row justify-content-between fs-5">
            <div class="col-12">
                <p>${source.name}</p>
            </div>
            <div class="col-12">
                <div class="row info">
                    <div class="col-7">
                        <p>+${source.flowRate} Water Flow</p>
                    </div>
                    <div class="col-5 text-end">
                        <p>Owned: <span id="${source.name}-amount">${source.amount}</span></p>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <button id="${source.name}-button" class="btn btn-success w-100" onclick="purchaseSourceUpgrade('${source.name}')"><i
                        class="mdi mdi-flash"></i><span id="${source.name}-cost">${source.cost}</span></button>
            </div>
        </div>
    `
        element.classList = 'col-12 col-lg-12 col-xl-6 upgrade-card hidden'
        element.id = source.name
        document.getElementById('water-source-upgrades').appendChild(element)
    })
}

function makeClickUpgradeDivs() {
    clickUpgrades.forEach(upgrade => {
        let element = document.createElement('div')
        element.innerHTML = `
        <div class="row justify-content-between">
            <div class="col-12 fs-5">
                <p>${upgrade.name}</p>
            </div>
            <div class="col-12">
                <div class="row info">
                    <div class="col-7">
                        <p>+${upgrade.power} Click Strength</p>
                    </div>
                    <div class="col-5 text-end">
                        <p>Owned: <span id="${upgrade.name}-amount">${upgrade.amount}</span></p>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <button id="${upgrade.name}-button" class="btn btn-success w-100" onclick="purchaseClickUpgrade('${upgrade.name}')"><i
                        class="mdi mdi-flash"></i><span id="${upgrade.name}-cost">${upgrade.cost}</span></button>
            </div>
    `
        element.classList = 'col-12 col-lg-12 col-xl-6 upgrade-card hidden'
        element.id = upgrade.name
        document.getElementById('click-strength-upgrades').appendChild(element)
    })
}

function makeFlowUpgradeDivs() {
    flowControllers.forEach(flow => {
        let element = document.createElement('div')
        element.innerHTML = `
        <div class="row justify-content-between fs-5">
            <div class="col-12">
                <p>${flow.name}</p>
            </div>
            <div class="col-12">
                <div class="row info">
                    <div class="col-7">
                        <p>+${flow.deltaFlow} Throughput</p>
                    </div>
                    <div class="col-5 text-end">
                        <p>Owned: <span id="${flow.name}-amount">${flow.amount}</span></p>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <button id="${flow.name}-button" class="btn btn-success w-100" onclick="purchaseFlowController('${flow.name}')">
                <i class="mdi mdi-flash"></i><span id="${flow.name}-cost">${flow.cost}</span></button>
            </div>
        </div>
    `
        element.classList = 'col-12 col-lg-12 col-xl-6 upgrade-card hidden'
        element.id = flow.name
        document.getElementById('flow-controller-upgrades').appendChild(element)
    })
}

function draw() {
    // Stats updates
    document.getElementById('all-time-electricity').innerText = condenseNum(electricityEarnedLifetime)

    // Currency Updates
    document.getElementById('water').innerText = condenseNum(water)
    document.getElementById('electricity').innerText = condenseNum(electricity)
    document.getElementById('flow').innerHTML = multiplier == 1 ? condenseNum(flow) : '<i class="mdi mdi-all-inclusive"></i>'

    // water flow bar
    document.getElementById('water-div').style.background = multiplier == 1 ? `linear-gradient(90deg, #0d6efd ${water}%, #ffffff ${water}%)` : 'gold'
    document.getElementById('flow-div').style.backgroundColor = (water > 90 ? 'red' : '#198754')

    // click Power calculation
    let clickPower = 1
    clickUpgrades.forEach(upgrade => clickPower += upgrade.power * upgrade.amount)
    document.getElementById('click-strength').innerText = condenseNum(clickPower)

    // flow throughput calculation
    let throughput = 0
    flowControllers.forEach(controller => throughput += controller.deltaFlow * controller.amount)
    document.getElementById('flow-throughput').innerText = condenseNum(throughput)

    //  water flow calculation
    let waterFlow = 0
    waterSources.forEach(source => waterFlow += source.flowRate * source.amount)
    document.getElementById('water-rate').innerText = condenseNum(waterFlow)

    // Button cost updates
    clickUpgrades.forEach(upgrade => {
        document.getElementById(upgrade.name + '-amount').innerText = upgrade.amount
        document.getElementById(upgrade.name + '-cost').innerText = condenseNum(upgrade.cost)
        if (upgrade.cost > electricity) {
            document.getElementById(upgrade.name + '-button').classList.add('disabled')
        } else {
            document.getElementById(upgrade.name + '-button').classList.remove('disabled')
        }
        if (upgrade.cost <= maxElectricityOwned + 50) {
            document.getElementById(upgrade.name).classList.remove('hidden')
        }
    })
    waterSources.forEach(source => {
        document.getElementById(source.name + '-amount').innerText = source.amount
        document.getElementById(source.name + '-cost').innerText = condenseNum(source.cost)
        if (source.cost > electricity) {
            document.getElementById(source.name + '-button').classList.add('disabled')
        } else {
            document.getElementById(source.name + '-button').classList.remove('disabled')
        }
        if (source.cost <= maxElectricityOwned + 50) {
            document.getElementById(source.name).classList.remove('hidden')
        }
    })
    flowControllers.forEach(controller => {
        document.getElementById(controller.name + '-amount').innerText = controller.amount
        document.getElementById(controller.name + '-cost').innerText = condenseNum(controller.cost)
        if (controller.cost > electricity) {
            document.getElementById(controller.name + '-button').classList.add('disabled')
        } else {
            document.getElementById(controller.name + '-button').classList.remove('disabled')
        }
        if (controller.cost <= maxElectricityOwned + 50) {
            document.getElementById(controller.name).classList.remove('hidden')
        }
    })
}

function sweetAlert(message, icon, timer) {
    Swal.fire({
        position: 'top-end',
        icon: icon,
        title: message,
        showConfirmButton: false,
        timer: timer ? timer : 1500,
        toast: true
    })
}

function makeBonusButton() {
    let randY = Math.floor(Math.random() * 80) + 10
    let randX = Math.floor(Math.random() * 80) + 10
    let element = document.createElement('div')
    let timeout = setTimeout(removeElement, 7000, element)
    element.innerHTML = `
    <img id="${timeout}" class="bonus" type="button" onclick="bonusClicked(${timeout})" src="https://www.pngall.com/wp-content/uploads/2017/03/Flood-PNG-Clipart.png" alt="Bonus">
    `
    element.classList = 'position-absolute w-max'
    element.style.left = randX + '%'
    element.style.bottom = randY + '%'
    document.getElementById('dam-container').appendChild(element)
}


// #endregion


// #region Bonus handlers
function bonusClicked(timeoutID) {
    clearTimeout(timeoutID)
    element = document.getElementById(timeoutID)
    removeElement(element)
    bonusActivate()
}
function bonusActivate() {
    sweetAlert('Bonus!!! <br> 5x Multiplier and no flow resistance!', 'success', 10000)
    document.getElementById('dam-container').classList.add('dam-image-boost')
    multiplier = 5
    setTimeout(bonusDeactivate, 10000)
}
function bonusDeactivate() {
    document.getElementById('dam-container').classList.remove('dam-image-boost')
    multiplier = 1
    flow = 0
    water = 0
}

// #endregion


// #region Util Functions

function condenseNum(number) {
    let abbreviations = ['', 'K', 'M', 'B', 't', 'q', 'Q', 's', 'S', 'o', 'n', 'd', 'U', 'D', 'T', 'Qt']
    for (let i = 0; true; i++) {
        if (number / (1000 ** i) < 1000) {
            return (number / (1000 ** i)).toFixed(2) + abbreviations[i]
        }
    }
    return number
}

function findPrice(upgrade) {
    let newPrice = 0
    newPrice = upgrade.basePrice * ((upgrade.amount + 1) ** .8)
    upgrade.cost = newPrice
    return newPrice
}

function removeElement(element) {
    element.parentElement.removeChild(element)
}

// #endregion


// #region Save/Load Functions



function saveGame() {
    window.localStorage.setItem('dam clicker info', JSON.stringify([
        waterSources, flowControllers, clickUpgrades, electricity, electricityEarnedLifetime, maxElectricityOwned
    ]))
}

function loadGame() {
    if (window.localStorage.getItem('dam clicker info')) {
        let savedGame = JSON.parse(window.localStorage.getItem('dam clicker info'))
        waterSources = savedGame[0]
        flowControllers = savedGame[1]
        clickUpgrades = savedGame[2]
        electricity = savedGame[3]
        electricityEarnedLifetime = savedGame[4]
        maxElectricityOwned = savedGame[5]
    }
}

function resetGame() {
    if (window.localStorage.getItem('dam clicker info')) {
        window.localStorage.removeItem('dam clicker info')
        location.reload()
    }
}

// #endregion


// #region Recording functions

function recordElectricityRecord() {
    if (electricity > maxElectricityOwned) {
        maxElectricityOwned = electricity
    }
}

// #endregion

makeSourceUpgradeDivs()
makeFlowUpgradeDivs()
makeClickUpgradeDivs()
loadGame()
setTimeout(setInterval, 2000, transferWater, 50)
setInterval(saveGame, 10000)
setInterval(makeBonusButton, 60000)
sweetAlert('Loading Timing functions', 'info', 2000)
