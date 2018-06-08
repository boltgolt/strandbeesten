class Link {
	constructor(pipeA, pipeB, stiffness, reverse) {
		this.stiffness = stiffness

		let options = {
			bodyB: pipeB.body,
			length: 3,
			stiffness: stiffness,
			pointB: {
				x: pipeB.length / 2,
				y: 0
			}
		}

		if (Array.isArray(pipeA)) {
			options.pointA = {x: pipeA[0], y: pipeA[1]}
			options.length = 1
		}
		else {
			options.pointA = {
				x: pipeA.length / 2,
				y: 0
			}
			options.bodyA = pipeA.body

			if (Array.isArray(reverse)) {
				options.pointA.x = pipeA.length / 2 * reverse[0]
			}
		}

		if (Array.isArray(reverse)) {
			options.pointB.x = pipeB.length / 2 * reverse[1]
		}

		this.body = Constraint.create(options)
	}
}
