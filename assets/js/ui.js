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
		// Convert the first 2 chars of the ID to a degree on the color wheel
		let color = parseInt(id.substr(0, 2), 32) / 1024 * 360

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
