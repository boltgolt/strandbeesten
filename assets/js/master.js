// Will contain the beesten to be tested this generation
let beesten = []
// The top beesten for all simulated generations
let winningBeesten = []
// The current generation number
let genNumber = 1
// The longest a beest has travelled this generation
let genDistance = 0

/**
 * Run though all beesten in a generation
 */
function runGeneration() {
	/**
	 * Run the simulation of a single beest
	 * @param  {number} index The index in the beesten array to simulate
	 */
	function run(index) {
		// Start the simulation
		startSimulation(beesten[index].dna,
			// On an opdate event from the simulation
			function(update) {
				// Update the stats at the top
				setTopEvent(update)

				// Make sure the overlay is not visible
				setOverlayStatus(false)
				// Make sure the right beest index is shown on the left
				document.getElementById("leftBeest").innerHTML = index + 1 + "/" + beesten.length
			},
			// On simulation termination
			function(end) {
				// Update the longest distance for this generation if we've beaten the record
				if (end.distance > genDistance) {
					genDistance = end.distance
					document.getElementById("leftLongest").innerHTML = genDistance.toFixed(2) + "m"
				}

				// Save the results of the simulation in the array
				beesten[index].contact = end.groundContactPc
				beesten[index].distance = end.distance

				// If this was the final beest to simulate, go to the next generation
				if (index == beesten.length - 1) {
					return evolveGeneration()
				}

				// Show the results a nice overlay
				setOverlayContent(beesten[index + 1].dna, end.distance)
				setOverlayStatus(true)

				// Run the next simulation
				// Wil take about 2 seconds before the update event will be called
				run(++index)
			}
		)
	}

	// Show the first beest in the overlay
	setOverlayContent(beesten[0].dna)
	// Run the first beest
	run(0)
}

/**
 * Evolve a generation of beesten
 */
function evolveGeneration() {
	// Empty array that will contain the next generation
	let newBeesten = []

	// Sort the previous generation so we get the best one first
	beesten.sort(function(a, b) {
		return b.distance - a.distance
	})

	// Save the winning one
	winningBeesten.push(beesten[0])

	// Go through them one by one
	for (let i in beesten) {
		let beest = beesten[i]

		// If we hit the first one that didn't go anyware we can just abort
		// Because of the sorting we won't have any beesten with a distance of
		// more than 0 beyond this one
		if (beest.distance == 0) {
			break;
		}

		// If this beest is in the top 20% and had ground contact for at least 5%
		if (i < beesten.length * 0.2 && beest.contact > 5) {
			// Save it for the next generation
			newBeesten.push(beest)

			// Create a copy of the beest object with no references to the old one
			let beestCopy = JSON.parse(JSON.stringify(beest))

			// Evolve the DNA of this copy
			beestCopy.dna = evolveDNA(beestCopy.dna)

			// Add the whole thing to the new generation
			newBeesten.push(beestCopy)
		}

		// If it didn't make it into the top 20% but did get some ground contact,
		// add an evolved version to the next generation
		else if (beest.contact > 10 && newBeesten.length < beesten.length) {
			beest.dna = evolveDNA(beest.dna)
			newBeesten.push(beest)
		}
	}

	// Add randomly generated beesten until we have a full generation
	for (let i = newBeesten.length; i < beesten.length; i++) {
		newBeesten.push({dna: generateRandomDNA()})
	}

	// Reset the stats for all beesten
	for (let beest of newBeesten) {
		beest.contact = -1
		beest.distance = 0
	}

	// Set the next generation as the current generation
	beesten = newBeesten

	// Reset the travelled distance
	genDistance = 0
	document.getElementById("leftLongest").innerHTML = genDistance.toFixed(2) + "m"

	// Up the generation count
	genNumber++
	// Reset the generation timer
	timer.gen = -1

	// Update the UI
	document.getElementById("leftGen").innerHTML = genNumber
	document.getElementById("leftBeest").innerHTML = "0/" + beesten.length
	document.getElementById("centerOverlay").classList.add("start")

	// Start running the generation
	runGeneration()

	// Show the overlay with the next beest ID
	setOverlayStatus(true)
}

//
// Code below is executed on load
//

// Generate as many beesten as we will simulate per generation
for (var i = 0; i < 30; i++) {
	beesten.push({
		dna: generateRandomDNA(),
		contact: -1,
		distance: 0
	})
}

// Start running this generation (non-blocking)
runGeneration()

// Set the timer to zero
let timer = {
	gen: 0,
	sim: 0
}

// Update the timer every second
setInterval(function() {
	// The HTML IDs of the timer elements
	const ids = {
		gen: "leftGenTime",
		sim: "leftTotalTime"
	}

	// Go though every timer
	for (let time in timer) {
		// Increment it
		timer[time]++

		// Get the hours, minutes and seconds that have passed
		let hours = Math.floor(timer[time] / 3600)
		let minutes = Math.floor((timer[time] - hours * 3600) / 60)
		let seconds = Math.floor(timer[time] - hours * 3600 - minutes * 60)

		// Put it into the HTML all formatted
		document.getElementById(ids[time]).innerHTML = hours + ":" + String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
	}
}, 1000)
