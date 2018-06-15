/**
 * Set the DNA and ID in the top bar at the start of a simulation
 * @param {object} dna The DNA object
 */
function setTopStatic(dna) {
	// Get the HEX form of the DNA object
	let hex = encodeDNA(dna)
	// Show it in the top bar
	document.getElementById("topDna").innerHTML = hex

	// Get the ID from the HEx
	getID(hex).then((id) => {
		// Convert the second 2 chars of the ID to a degree on the color wheel
		let color = parseInt(id.substr(2, 2), 32) / 1024 * 360

		// Show the ID in the bar
		document.getElementById("topId").innerHTML = id
		// Color it with the generated HSL degree
		document.getElementById("topId").style.color = "hsl(" + color + ", 100%, 60%)"
	})
}

/**
 * Show the data from a simulation event in the top bar
 * @param {object} event The event object
 */
function setTopEvent(event) {
	// Pass the motor loops and revolutions
	document.getElementById("topDirec").innerHTML = event.direction
	document.getElementById("topMotor").innerHTML = event.motorRevolutions
	// Set the ground contact percent with a fixed 1 decimal
	document.getElementById("topContact").innerHTML = event.groundContactPc.toFixed(1) + "%"
	// Do the same for distance travelled but with 2 decimals
	document.getElementById("topDistance").innerHTML = event.distance.toFixed(2) + "m"
}

/**
 * Set the content of the overay
 * @param {object} nextDNA      The DNA object of the next beest to test
 * @param {number} lastDistance The distance the last beest managed to travel
 */
function setOverlayContent(nextDNA, lastDistance) {
	// Get the HEX of the DNA object
	let nextHex = encodeDNA(nextDNA)

	// Transform that into the ID
	getID(nextHex).then((id) => {
		// Get the HSL color degree from the id
		let color = parseInt(id.substr(2, 2), 32) / 1024 * 360

		// Set the ID and apply the color
		document.getElementById("centerOverlayNext").innerHTML = id
		document.getElementById("centerOverlayNext").style.color = "hsl(" + color + ", 100%, 60%)"
	})

	// If there was a previous beest
	if (lastDistance) {
		// Don't hide the left part of the overlay
		document.getElementById("centerOverlay").classList.remove("start")
		// Show the distance travelled
		document.getElementById("centerOverlayPrevious").innerHTML = lastDistance.toFixed(2) + "m"
	}
}

/**
 * Set the state of the overlay
 * @param {boolean} bool Whether or not the overlay should be visible
 */
function setOverlayStatus(bool) {
	// Set the opacity of the overlay depending on the boolean
	document.getElementById("centerOverlay").style.opacity = bool ? 1 : 0
}
