let beesten = []
let winningBeesten = []
let genNumber = 1
let genDistance = 0

function runGeneration() {
	function run(index) {
		startSimulation(beesten[index].dna, function(update) {
			setTopEvent(update)
			setOverlayStatus(false)

			document.getElementById("leftBeest").innerHTML = index + 1 + "/" + beesten.length
		}, function(end) {
			if (end.distance > genDistance) {
				genDistance = end.distance
				document.getElementById("leftLongest").innerHTML = genDistance.toFixed(2) + "m"
			}

			beesten[index].contact = end.groundContactPc
			beesten[index].distance = end.distance

			if (index == beesten.length - 1) {
				return evolveGeneration()
			}

			setOverlayContent(beesten[index + 1].dna, end.distance)
			setOverlayStatus(true)

			run(++index)
		})
	}

	setOverlayContent(beesten[0].dna)
	run(0)
}

function evolveGeneration() {
	let newBeesten = []

	console.log(JSON.parse(JSON.stringify(beesten)))

	beesten.sort(function(a, b) {
		return b.distance - a.distance
	})

	winningBeesten.push(beesten[0])

	for (let i in beesten) {
		let beest = beesten[i]

		if (beest.distance == 0) {
			break;
		}

		if (i < beesten.length * 0.1 && beest.contact > 5) {
			newBeesten.push(beest)

			// Create a copy of the beest object with no references to the old one
			let beestCopy = JSON.parse(JSON.stringify(beest))

			beestCopy.dna = evolveDNA(beestCopy.dna)

			newBeesten.push(beestCopy)
		}

		else if (beest.contact > 10 && newBeesten.length < beesten.length) {
			beest.dna = evolveDNA(beest.dna)
			newBeesten.push(beest)
		}
	}

	for (let i = newBeesten.length; i < beesten.length; i++) {
		newBeesten.push({dna: generateRandomDNA()})
	}

	for (let beest of newBeesten) {
		beest.contact = -1
		beest.distance = 0
	}

	console.log(JSON.parse(JSON.stringify(newBeesten)))

	beesten = newBeesten

	genDistance = 0
	document.getElementById("leftLongest").innerHTML = genDistance.toFixed(2) + "m"

	genNumber++
	timer.gen = -1

	document.getElementById("leftGen").innerHTML = genNumber
	document.getElementById("leftBeest").innerHTML = "0/" + beesten.length
	document.getElementById("centerOverlay").classList.add("start")

	runGeneration()

	setOverlayStatus(true)
}

for (var i = 0; i < 30; i++) {
	beesten.push({
		dna: generateRandomDNA(),
		contact: -1,
		distance: 0
	})
}

runGeneration()

let timer = {
	gen: 0,
	sim: 0
}

setInterval(function() {
	let ids = {
		gen: "leftGenTime",
		sim: "leftTotalTime"
	}

	for (let time in timer) {
		timer[time]++

		let hours = Math.floor(timer[time] / 3600)
		let minutes = Math.floor((timer[time] - hours * 3600) / 60)
		let seconds = Math.floor(timer[time] - hours * 3600 - minutes * 60)

		document.getElementById(ids[time]).innerHTML = hours + ":" + String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
	}
}, 1000)
