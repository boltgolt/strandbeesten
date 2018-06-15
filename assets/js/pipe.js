/**
 * Pipe class
 * Create a new PVC pipe
 */
class Pipe {
	/**
	 * Crieate a pipe
	 * @param {number} x      The X position to spawn the pipe
	 * @param {number} y      The Y position to spawn the pipe
	 * @param {number} length The length to use
	 */
	constructor(x, y, length) {
		// Save the length as attribute
		this.length = length

		// Create a new rectangle as pipe and save it as attribute
		this.body = Bodies.rectangle(x, y, length, 5, {
			// Don't collide with the other pipes
			collisionFilter: {
				group: group
			},
			frictionAir: 0.01,
			// Make it look like PVC
			render: {
				fillStyle: "#BDBF29",
				lineWidth: 1,
				strokeStyle: "#000"
			}
		})
	}
}
