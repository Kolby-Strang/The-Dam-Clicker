const waterSources = [
    {
        name: 'Stream',
        cost: 100,
        basePrice: 100,
        flowRate: .1,
        amount: 0
    },
    {
        name: 'Creek',
        cost: 300,
        basePrice: 300,
        flowRate: 2,
        amount: 0
    }
]
const flowControllers = [
    {
        name: 'Turbine',
        cost: 300,
        basePrice: 300,
        deltaFlow: 1.9,
        amount: 1
    },
    {
        name: 'Bigger Inlets',
        cost: 600,
        basePrice: 600,
        deltaFlow: 1.8,
        amount: 0
    }
]
const clickUpgrades = [
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
let water = 0
let waterCeiling = 100
let flow = .1

function clickDam() {
    let total = 1
    clickUpgrades.forEach(upgrade => total += upgrade.power * upgrade.amount)
    water += total
    draw()
}

function draw() {
    document.getElementById('water').innerText = condenseNum(water)
    document.getElementById('electricity').innerText = condenseNum(electricity)
    document.getElementById('flow').innerText = condenseNum(flow)
    clickUpgrades.forEach(upgrade => {
        document.getElementById(upgrade.name + '-cost').innerText = condenseNum(upgrade.cost)
    })
    waterSources.forEach(source => {
        document.getElementById(source.name + '-cost').innerText = condenseNum(source.cost)
    })
    flowControllers.forEach(controller => {
        document.getElementById(controller.name + '-cost').innerText = condenseNum(controller.cost)
    })
}

function transferWater() {
    addWater()
    calculateFlow()
    draw()
    if (water > 0) {
        electricity += flow
        water -= flow
    }
}

function calculateFlow() {
    flow = water / 40
    flowControllers.forEach(controller => flow *= (controller.deltaFlow * controller.amount) + 1)
}

function addWater() {
    waterSources.forEach(source => {
        water += source.flowRate * source.amount
    })
    if (water > waterCeiling)
        water = waterCeiling
}

function purchaseSourceUpgrade(name) {
    let waterSource = waterSources.find(source => source.name == name)
    if (electricity >= waterSource.cost) {
        waterSource.amount++
        electricity -= waterSource.cost
        findPrice(waterSource)
        document.getElementById(waterSource.name + '-amount').innerText = waterSource.amount
    } else {
        insufficientFundsAlert()
    }
    draw()
}
function purchaseFlowController(name) {
    let flowController = flowControllers.find(controller => controller.name == name)
    if (electricity >= flowController.cost) {
        flowController.amount++
        electricity -= flowController.cost
        findPrice(flowController)
        document.getElementById(flowController.name + '-amount').innerText = flowController.amount
    } else {
        insufficientFundsAlert()
    }
    draw()
}
function purchaseClickUpgrade(name) {
    let clickUpgrade = clickUpgrades.find(upgrade => upgrade.name == name)
    if (electricity >= clickUpgrade.cost) {
        clickUpgrade.amount++
        electricity -= clickUpgrade.cost
        findPrice(clickUpgrade)
        document.getElementById(clickUpgrade.name + '-amount').innerText = clickUpgrade.amount
    } else {
        insufficientFundsAlert()
    }
    draw()
}

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
                        <p>+${source.flowRate} Water Flow Rate</p>
                    </div>
                    <div class="col-5 text-end">
                        <p>Owned: <span id="${source.name}-amount">${source.amount}</span></p>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <button class="btn btn-success w-100" onclick="purchaseSourceUpgrade('${source.name}')"><i
                        class="mdi mdi-flash"></i><span id="${source.name}-cost">${source.cost}</span></button>
            </div>
        </div>
    `
        element.classList = 'col-12 upgrade-card'
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
                <button class="btn btn-success w-100" onclick="purchaseClickUpgrade('${upgrade.name}')"><i
                        class="mdi mdi-flash"></i><span id="${upgrade.name}-cost">${upgrade.cost}</span></button>
            </div>
    `
        element.classList = 'col-12 upgrade-card'
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
                        <p>+${flow.deltaFlow} Click Strength</p>
                    </div>
                    <div class="col-5 text-end">
                        <p>Owned: <span id="${flow.name}-amount">${flow.amount}</span></p>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <button class="btn btn-success w-100" onclick="purchaseFlowController('${flow.name}')"><i
                        class="mdi mdi-flash"></i><span id="${flow.name}-cost">${flow.cost}</span></button>
            </div>
        </div>
    `
        element.classList = 'col-12 upgrade-card'
        document.getElementById('flow-controller-upgrades').appendChild(element)
    })
}
function findPrice(upgrade) {
    let newPrice = 0
    newPrice = upgrade.basePrice * ((upgrade.amount + 1) ** .8)
    upgrade.cost = newPrice
    return newPrice
}

function insufficientFundsAlert() {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Not enough Electricity',
        showConfirmButton: false,
        timer: 1500,
        toast: true
    })
}

function condenseNum(number) {
    let abbreviations = ['', 'k', 'm', 'b', 't',]
    for (let i = 0; true; i++) {
        if (number / (1000 ** i) <= 1000) {
            return (number / (1000 ** i)).toFixed(2) + abbreviations[i]
        }
    }
    return number
}

setInterval(transferWater, 100)
makeSourceUpgradeDivs()
makeFlowUpgradeDivs()
makeClickUpgradeDivs()
