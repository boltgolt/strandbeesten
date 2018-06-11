// Import Matter.js consts
const Engine = Matter.Engine
const Events = Matter.Events
const Render = Matter.Render
const Runner = Matter.Runner
const Body = Matter.Body
const Composite = Matter.Composite
const Composites = Matter.Composites
const Constraint = Matter.Constraint
const MouseConstraint = Matter.MouseConstraint
const Mouse = Matter.Mouse
const World = Matter.World
const Bodies = Matter.Bodies
const Vector = Matter.Vector

let group

function startSimulation(dnaString, updateCallback, completedCallback) {
	// Get the options fromt the DNA
	const dna = decodeDNA(dnaString)

	// Create physiscs engine
	let engine = Engine.create()
	// Create a world
	let world = engine.world

	// Set the gravity in this world
	world.gravity.y = 2;
	world.gravity.scale = 0.002;

	// Create the renderer
	var render = Render.create({
		// Add the canvas element
		element: document.body,
		// Set the created engine
		engine: engine,
		options: {
			width: 800,
			height: 600,
			wireframes: false,
			background: "#4186E0"
		}
	})

	// Start the renderer
	Render.run(render)

	// Create the runner and start it
	let runner = Runner.create()
	Runner.run(runner, engine)

	// How far we are in the circle engine loop
	let loop = 0
	// The length of the loop
	let loopLength = 100
	// The radius of the circle arm
	let radius = 15
	// If the grace period has ended
	let gracePeriod = true
	// The hight of the ground in pixels from the top
	let goundHeight = 193

	// Run every tick
	Events.on(runner, "tick", function() {
		// Set the X and Y of the motor link to the right frame in the loop
		motorLink.body.pointA.x = 338 + Math.sin((loop / loopLength) * Math.PI * 2) * radius
		motorLink.body.pointA.y = 92.2 + Math.sin(((loop / loopLength) + 0.25) * Math.PI * 2) * radius

		// If the grace period has ended
		if (!gracePeriod) {
			// Let the top helper link move with the top pipe
			topLink.body.pointA.x = 300 + Math.sin((loop / loopLength) * Math.PI * 2) * radius * 2

			// Increment the loop
			loop++
			// Reset the loop if we've het the max length
			if (loop >= loopLength) loop = 0
		}

		let pipeLength = 65.7

		// Calculate the Y diff with some hardcore math
		let y = pipeLength / 2 * Math.sin(diagonalBottomPipe.body.angle)
		// Do the same for the X diff but with pythagoras
		let x = Math.sqrt(Math.pow(pipeLength / 2, 2) - Math.pow(y, 2))

		// If the diagonal is to the right of the straigt bottom pipe,
		// reverse the X so it doesn't float on the wrong side
		if (rightBottomPipe.body.position.x < diagonalBottomPipe.body.position.x) {
			x *= -1
		}

		// Check if the leg is touching the ground
		if (diagonalBottomPipe.body.position.y - y > goundHeight - 3) {
			// If it is, let the ground move with the leg for this frame by applying a diff
			Body.setPosition(ground, {
				x: ground.position.x - (frictionCircle.position.x - (diagonalBottomPipe.body.position.x + x)),
				y: goundHeight + 100
			})

			// Mark the foot as touching
			frictionCircle.render.fillStyle = "#0f0"
		}
		else {
			// Mark the foot as floating
			frictionCircle.render.fillStyle = "#f00"
		}

		// Position the circle at the end of the foot
		Body.setPosition(frictionCircle, {
			x: diagonalBottomPipe.body.position.x + x,
			y: diagonalBottomPipe.body.position.y - y
		})
	})

	// Group in which collisions will be disabled
	group = Body.nextGroup(true)

	// Init empty arrays to fill with objects
	let pipes = []
	let links = []

	// Top triangle
	//  Diagonal	[0]
	pipes.push(new Pipe(350, 100, 55.8))
	//  Bottom		[1]
	pipes.push(new Pipe(350, 120, 40.1))
	//  Right		[2]
	pipes.push(new Pipe(440, 160, 41.5))

	// Link top triangle
	links.push(new Link(pipes[0], pipes[1], 1, [-1, 1]))
	links.push(new Link(pipes[1], pipes[2], 1, [-1, 1]))
	links.push(new Link(pipes[2], pipes[0], 1, [-1, 1]))

	// Square connectors
	//  Right		[3]
	pipes.push(new Pipe(340, 190, 39.4))
	//  Left		[4]
	pipes.push(new Pipe(390, 190, 39.4))

	// Square to triangle connectors
	links.push(new Link(pipes[1], pipes[3], 1, [-1, 1]))
	links.push(new Link(pipes[2], pipes[4], 1, [-1, 1]))

	// Bottom triangle
	//  Top			[5]
	pipes.push(new Pipe(350, 220, 36.7))
	//  Right		[6]
	let rightBottomPipe = new Pipe(440, 220, 49.0)
	pipes.push(rightBottomPipe)
	//  Diagonal	[7]
	let diagonalBottomPipe = new Pipe(340, 100, 65.7)
	pipes.push(diagonalBottomPipe)

	// Link bottom triangle to square
	links.push(new Link(pipes[3], pipes[5], 1, [-1, 1]))
	links.push(new Link(pipes[5], pipes[4], 1, [-1, -1]))

	// Link bottom triangle together
	links.push(new Link(pipes[5], pipes[6], 1, [1, 1]))
	links.push(new Link(pipes[5], pipes[7], 1, [-1, 1]))
	links.push(new Link(pipes[6], pipes[7], 1, [-1, -1]))

	// Right motor connectors
	//  Top			[8]
	pipes.push(new Pipe(440, 220, 50))
	//  bottom		[9]
	pipes.push(new Pipe(340, 100, 61.9))

	// Connect driving right motor
	links.push(new Link(pipes[8], pipes[0], 1, [-1, -1]))
	links.push(new Link(pipes[9], pipes[5], 1, [-1, 1]))
	links.push(new Link(pipes[8], pipes[9], 1, [1, 1]))

	// Link at the top of the leg to keep it up straight
	var topLink = new Link([260, 0], pipes[1], 0.1, [1, 0.8])
	links.push(topLink)

	// Link the static point in the top triangle
	links.push(new Link([300, 100], pipes[2], 1))

	// Link the motor to the connectors
	var motorLink = new Link([338, 92.2], pipes[9], 1)
	links.push(motorLink)

	// Empty array for only the physiscs bodies
	let bodies = []

	// Go through every link and add its body
	for (let link of links) {
		bodies.push(link.body)
	}
	// Do the same for the pipes
	for (let pipe of pipes) {
		bodies.push(pipe.body)
	}

	// Add them all to the world
	World.add(world, bodies)

	// Create circle to show if the leg is touching the ground
	let frictionCircle = Bodies.circle(100, 100, 5, {
		isStatic: true,
		collisionFilter: {
			group: group
		},
		render: {
			fillStyle: "#f00",
			opacity: 0.4
		}
	})

	// Add it to the world
	World.add(world, frictionCircle)

	// Create the ground with the green texture
	var ground = Bodies.rectangle(300, 400, 3600, 200, {
		isStatic: true,
		render: {
			sprite: {
				texture: "ground.png"
			}
		}
	})

	// Add that to the world too
	World.add(world, ground)


	// Change the camera to keep the leg in the middle
	Render.lookAt(render, {
		min: {x: 0, y: 0},
		max: {x: 600, y: 300}
	})

	// Grace period timer
	// The first few seconds the leg can flop about all it wants, but after
	// that these more realistic settings come into affect
	setTimeout(function() {
		// Set the gravity less strongly
		world.gravity.y = 1.5
		// Position the ground at the requested height
		Body.setPosition(ground, {x: 300, y: goundHeight + 100})
		// Enable the helping top link and motor loop
		gracePeriod = false
	}, 2000)
}

// startSimulation()
//

let ins ="bfcfcfcff3fcfffffffffffffffffffe"
let encoded = decodeDNA(ins)

console.log(JSON.stringify(encoded))

console.log(encodeDNA(encoded))
console.log(ins)
