class Pipe {
	constructor(x, y, length, light) {
		this.length = length

		light = 1

		console.log(light)

		this.body = Bodies.rectangle(x, y, length, width, {
			collisionFilter: {
				group: group
			},
			frictionAir: 0.01,
			render: {
				fillStyle: "#CFD22B",
				lineWidth: 1,
				strokeStyle: "#000"
			},
			// isStatic: true,
			density: light
		})
	}
}
