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

// Create physiscs engine
let engine = Engine.create()
// Create a world
let world = engine.world
// Create the renderer
var render = Render.create({
	// Add the canvas element
	element: document.body,
	// Set the created engine
	engine: engine,
	options: {
		width: 800,
		height: 600,
		wireframes: true,
		showAngleIndicator: true,
		background: "#0f0f13"
	}
})

// Start the renderer
Render.run(render)

// Create the runner and start it
let runner = Runner.create()
Runner.run(runner, engine)

Events.on(runner, "tick", function() {
	// Body.rotate(cir,0.0011)
	// console.log(cir)
})

// Add the group that will contain all bodies
let group = Body.nextGroup(true)

const length = 100
const width = 5

world.gravity.x = 0;
world.gravity.y = 1;
world.gravity.scale = 0.002;


let pipes = []
let links = []

// Top triangle
//  Diagonal	[0]
pipes.push(new Pipe(350, 100, 55.8, -1))
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
pipes.push(new Pipe(440, 220, 49.0))
//  Diagonal	[7]
pipes.push(new Pipe(340, 100, 65.7))

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

links.push(new Link(pipes[8], pipes[0], 1, [-1, -1]))
links.push(new Link(pipes[9], pipes[5], 1, [-1, 1]))
links.push(new Link(pipes[8], pipes[9], 1, [1, 1]))






// Pin top to background
links.push(new Link([300, 100], pipes[2], 1))
links.push(new Link([338, 92.2], pipes[9], 1))

// var cir = Bodies.circle(338, 92.2, 15, { isStatic: true, angularVelocity:32 })

// links.push(new Link([338, 92.2], {
// 	length: 30,
// 	body: cir
// }, 1, [1, 0]))

// links.push(new Link(pipes[9], {
// 	length: 30,
// 	body: cir
// }, 1, [1, 1]))


let bodies = []

for (let link of links) {
	bodies.push(link.body)
}
for (let pipe of pipes) {
	bodies.push(pipe.body)
}

console.log(bodies)

World.add(world, bodies);
// Body.setAngularVelocity( cir, Math.PI/6);

var ground = Bodies.rectangle(300, 610, 810, 60, { isStatic: true });
World.add(world, ground);


// fit the render viewport to the scene
Render.lookAt(render, {
	min: { x: 0, y: 0 },
	max: { x: 700, y: 600 }
});

// add mouse control
var mouse = Mouse.create(render.canvas),
	mouseConstraint = MouseConstraint.create(engine, {
		mouse: mouse,
		constraint: {
			stiffness: 0.2,
			render: {
				visible: false
			}
		}
	});

World.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;
