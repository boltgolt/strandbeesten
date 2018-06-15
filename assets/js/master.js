let beesten = []


function runGeneration() {
	function run(index) {
		startSimulation(beesten[index], function(update) {
			setTopEvent(update)
			setOverlayStatus(false)
			document.getElementById("leftBeest").innerHTML = index + 1 + "/100"
		}, function(end) {
			setOverlayContent(beesten[index + 1], end.distance)
			setOverlayStatus(true)

			run(++index)
		})
	}

	setOverlayContent(beesten[0])

	run(0)
}

for (var i = 0; i < 100; i++) {
	beesten.push(generateRandomDNA())
}

document.getElementById("leftGen").innerHTML = "1"
document.getElementById("leftBeest").innerHTML = "0/100"

runGeneration()
