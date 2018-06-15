/**
 * Link Class
 * Connect 2 pipes together with a constraint
 */
class Link {
	/**
	 * Create a new link
	 * @param {mixed}  pipeA     Either a Pipe class or a X/Y fixed poin position
	 * @param {object} pipeB     A Pipe class object
	 * @param {number} stiffness The stiffness of the link between 0 and 1
	 * @param {array}  reverse   Array of 2 point which change the position of the link on the object
	 */
	constructor(pipeA, pipeB, stiffness, reverse) {
		// Save stiffness and reverse as attributes
		this.stiffness = stiffness
		this.reverse = reverse

		// Create a default options object
		let options = {
			bodyB: pipeB.body,
			length: 1,
			stiffness: stiffness,
			pointB: {
				x: pipeB.length / 2,
				y: 0
			},
			render: {
				visible: false,
				strokeStyle: "rgba(207,210,43,.5)",
				lineWidth: 5
			}
		}

		// Set point A to a static point if given
		if (Array.isArray(pipeA)) {
			options.pointA = {x: pipeA[0], y: pipeA[1]}
		}
		else {
			// Otherwise, set it to the body of the given pipe
			options.bodyA = pipeA.body
			options.pointA = {
				x: pipeA.length / 2,
				y: 0
			}

			// Show the links if it's between 2 pipes
			options.render.visible = true

			// Apply a reversal of position if given to A if it's not a point
			if (Array.isArray(reverse)) {
				options.pointA.x = pipeA.length / 2 * reverse[0]
			}
		}

		// Apply a reversal of position if given to B
		if (Array.isArray(reverse)) {
			options.pointB.x = pipeB.length / 2 * reverse[1]
		}

		// Create the link and set it as attribute
		this.body = Constraint.create(options)
	}
}
