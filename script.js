const canvas = document.querySelector(".canvas")
const ctx = canvas.getContext("2d")
const createTree = document.querySelector(".create-tree")
const controlWrapper = document.querySelector(".control-wrapper")

let iterationCount, trunkHeight, trunkThickness, branchRatio, branchProbability, leafProbability, branchLengthVariability, forkAngle, forkAnglePull, branchRotationVariability, leafSize, branchColor, leafColor, leafColorVariability, leafLightness



const timers = []

resize()
ctx.lineCap = "round"
updateValues()
render()


controlWrapper.onchange = createTree.onclick = onresize = () => {
    resize()
    ctx.lineCap = "round"
    updateValues()
    timers.forEach(timerId => clearTimeout(timerId))
    timers.splice(0)
    clear()
    render()
}

function resize() {
    canvas.height = innerHeight
    canvas.width = innerWidth - 200
}

function updateValues() {
    ({ iterationCount, trunkHeight, trunkThickness, branchRatio, branchProbability, leafProbability, branchLengthVariability, forkAngle, forkAnglePull, branchRotationVariability, leafSize, branchColor, leafColor, leafColorVariability, leafLightness, } = Object.fromEntries([...controlWrapper.querySelectorAll('[type="range"]')].map(({ id, value }) => [id, +value])))
}


function render() {
    updateValues()
    drawTree(canvas.width / 2, canvas.height, - Math.PI / 2, trunkHeight, trunkThickness, iterationCount)
}


function rnd(max = 1) {
    return Math.random() * max
}


function drawLine(x1, y1, x2, y2) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}


function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}


function drawTree(x0, y0, angle, length, width, i) {

    angle += rnd(branchRotationVariability) * (rnd() < 0.5 ? -1 : 1) * (iterationCount - i)

    const timerId = setTimeout(() => {
        const { x, y } = findEnd(x0, y0, angle, length)
        ctx.lineWidth = width
        ctx.strokeStyle = `hsl(${branchColor + (iterationCount - i) * 3}, 60%, ${30 - i}%)`
        drawLine(x0, y0, x, y)

        if (i < 7 || length < 8) {
            const hue = leafColor + rnd(leafColorVariability)
            const saturation = 70 - rnd(30)
            const lightness = 20 + leafLightness + rnd(20)
            ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`
            ctx.strokeStyle = `hsl(${hue}, ${saturation}%, ${lightness - 25}%)`
            drawLeaves(x0, y0, leafSize - rnd(leafSize / 2), angle, length)
            return
        }

        const hasLeftBranch = rnd() < branchProbability
        const hasRightBranch = rnd() < branchProbability
        width -= (width - (i == 8 ? 1 : 0.5)) / (i - 7)
        const nextForkAngle = 1 - rnd(1 - forkAnglePull)
        if (hasLeftBranch) drawTree(
            x,
            y,
            angle - forkAngle / 2 * nextForkAngle,
            length * branchRatio * (1 + rnd(branchLengthVariability) * (rnd() < 0.5 ? -1 : 1)),
            width,
            i - 1
        )
        if (hasRightBranch) drawTree(
            x,
            y,
            angle + forkAngle / 2 * nextForkAngle,
            length * branchRatio * (1 + rnd(branchLengthVariability) * (rnd() < 0.5 ? -1 : 1)),
            width,
            i - 1
        )
        if (!hasLeftBranch && !hasRightBranch && i < 6) {
            ctx.fillStyle = `hsl(${120 - rnd(60)}, ${100 - rnd(40)}%, ${20 + rnd(40)}%)`
            drawLeaf(x0, y0, 4 + rnd(2), angle)
        }
        timers.splice(timers.indexOf(timerId), 1)
    }, i ** 2 / 4)
    timers.push(timerId)
}


function drawCircle(x, y, r) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 7)
    ctx.fill()
}


function drawLeaf(x, y, r, angle) {
    ({ x, y } = findEnd(x, y, angle, r))
    ctx.beginPath()
    ctx.ellipse(x, y, r, r / (rnd(3) + 1.5), angle, 0, 7)
    ctx.fill()
    ctx.lineWidth = 0.5
    ctx.stroke()
}

function drawLeaves(x0, y0, r, angle, length) {
    const { x: x1, y: y1 } = findEnd(x0, y0, angle, length)
    const { x: x2, y: y2 } = findEnd(x0, y0, angle, length * 3 / 4)
    const { x: x3, y: y3 } = findEnd(x0, y0, angle, length / 2)
    if (rnd() < leafProbability) drawLeaf(x1, y1, r, angle)
    if (rnd() < leafProbability) drawLeaf(x2, y2, r, angle - 1)
    if (rnd() < leafProbability) drawLeaf(x2, y2, r, angle + 1)
    if (rnd() < leafProbability) drawLeaf(x3, y3, r, angle - 1)
    if (rnd() < leafProbability) drawLeaf(x3, y3, r, angle + 1)
}


function findEnd(beginX, beginY, angle, length) {
    return {
        x: beginX - Math.cos(Math.PI - angle) * length,
        y: beginY + Math.sin(Math.PI - angle) * length
    }
}
