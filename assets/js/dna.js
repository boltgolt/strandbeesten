/**
 * Decode a hex DNA string
 * @param  {string} hex The encoded DNA hex
 * @return {object}     A DNA object
 */
function decodeDNA(hex) {
	// Create an empty DNA object
	let dna = {
		motor: {},
		legs: []
	}
	// Create an ampty binary string
	let bin = ""

	// First of all, we need to parse the hex to the source binary string
	for (let hexChar of hex) {
		// Take each hex char and transform it to a 4-bit padded string
		bin += parseInt(hexChar, 16).toString(2).padStart(4, "0")
	}

	// Check if the header is correct
	if (bin.substr(0, 1) != "1") {
		throw "Invalid DNA header"
	}

	// Contains the XORed checksum result
	let checksum = 0

	// Go through char by char
	for (let i in bin) {
		// Skip the checksum bit itself
		if (i == 127) break;

		// XOR the found bit to the checksum
		checksum ^= parseInt(bin[i])
	}

	// Compare the found checksum with the calculated one
	if (bin.substr(127, 1) != checksum) {
		throw "Invalid DNA checksum"
	}

	// Height from the top of the frame to the ground
	// START 1		LENGTH 10		END	10
	dna.groundHeight = parseInt(bin.substr(1, 10), 2) / 10

	// The radius of the motor arm
	// START 11		LENGTH 8		END	18
	dna.motor.radius = parseInt(bin.substr(11, 8), 2) / 10

	// The speed of the motor rotation
	// START 19		LENGTH 8		END	26
	dna.motor.speed = 128 - parseInt(bin.substr(19, 8), 2)

	// Length of every pipe
	// The minimum length of a leg is 10, so 10 is added to the total here
	// START 27		LENGTH 10		END	127
	for (let i = 0; i <= 9; i++) {
		dna.legs.push(10 + parseInt(bin.substr(27 + (10 * i), 10), 2) / 10)
	}

	// Return the filled DNA object
	return dna
}

/**
 * Encode a DNA object to a hex string
 * @param  {object} dna The DNA object to encode
 * @return {string}     An encoded hex string
 */
function encodeDNA(dna) {
	// Start the binary string off with the header
	let bin = "1"

	// Add the 10-bit ground height
	// Devided by 10 to allow for 1 decimal
	bin += Math.round(dna.groundHeight * 10).toString(2).padStart(10, "0")

	// Add the 8-bit motor radius
	// Has also been devided by 10 for 1 decimal
	bin += Math.round(dna.motor.radius * 10).toString(2).padStart(8, "0")

	// Add the 8-bit motor speed
	// Had 128 subtracted to allow for negative numbers
	bin += Math.round(-dna.motor.speed + 128).toString(2).padStart(8, "0")

	// Go through each leg
	for (let leg of dna.legs) {
		// Add the 10-bit leg length to the binary
		// Had a padding of 10 for minimal leg length
		bin += Math.round((leg - 10) * 10).toString(2).padStart(10, "0")
	}

	// Start with an empty checksum
	let checksum = 0

	// Go through the binary string
	for (let bit of bin) {
		// Calculate the XOR for every bit and add it
		checksum ^= parseInt(bit)
	}

	// Add the checksum to the binary, completing it
	bin += checksum
	// Create an empty hex
	let hex = ""

	// Go though the binary string in steps of 4
	for (let i = 0; i < bin.length; i += 4) {
		// Convert every 4 bits to a hex character and add it to the hex
		hex += parseInt(bin.substr(i, 4), 2).toString(16)
	}

	// Return the completed hex
	return hex
}

/**
 * Generate a random DNA object
 * @return {object} The generated DNA object
 */
function generateRandomDNA() {
	// Start with an empty object
	let dna = {
		motor: {},
		legs: []
	}

	// Set a random height 		(0		to	102.4)
	dna.groundHeight = Math.round(Math.random() * 102.4 * 10) / 10

	// Set a random motor arm 	(0		to	25.6)
	dna.motor.radius = Math.round(Math.random() * 25.6 * 10) / 10

	// Set a random speed 		(-128	to	128)
	dna.motor.speed = Math.round(128 - (Math.random() * 256))

	// Generate 10 leg lengths	(10		to	112.4)
	for (let i = 0; i <= 9; i++) {
		dna.legs.push(Math.round(10 + Math.random() * 102.4 * 10) / 10)
	}

	// Return the generated object
	return dna
}

/**
 * Evolve traits of a DNA object
 * @param  {object} dna The original DNA object
 * @return {object}     The evolved DNA object
 */
function evolveDNA(dna) {
	function modulate(value, amp, min, max, decimals) {
		let modulation = -1 + Math.random()

		value += modulation * amp

		if (value < min) {
			value = min
		}
		if (value > max) {
			value = max
		}

		return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
	}

	// How many traits to change in this evolve
	// Value between 1 and 3, with a higher chance for a 1
	let changeCount = Math.round(1 + Math.random() * 2)

	// Will contain the IDs of picked traits to evolve
	let picks = []

	for (var i = 0; i < changeCount; i++) {
		let newPick = Math.floor(Math.random() * 12)

		if (picks.indexOf(newPick) == -1) {
			picks.push(newPick)
		}
		else {
			i--
		}
	}

	for (let pick of picks) {

		if (pick < 10) {
			dna.legs[pick] = modulate(dna.legs[pick], 2, 10, 122.4, 1)
		}
		else if (pick == 10) {
			dna.groundHeight = modulate(dna.groundHeight, 2, 0, 102.4, 1)
		}
		else if (pick == 11) {
			dna.motor.radius = modulate(dna.motor.radius, 1, 0, 25.6, 1)
		}
		else if (pick == 12) {
			dna.motor.speed = modulate(dna.motor.speed, 4, -128, 128, 9)
		}
	}

	return dna
}

/**
 * Get the ID of a beest
 * @param  {string}  hex The DNA hex to get the ID from
 * @return {promise}     A promise resolving to the ID
 */
function getID(hex) {
	// Turn the hex into an ArrayBuffer
	let buffer = new TextEncoder("utf-8").encode(hex)

	// Create a SHA-1 hash and return the promise
	return window.crypto.subtle.digest("SHA-1", buffer).then(function(hash) {
		// Create a view out of the raw hash
 		let view = new DataView(hash)

		// Transform the first 4 bytes of the hash to an hex ID
		return view.getUint32(0).toString(32)
	})
}
