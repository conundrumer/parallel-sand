export function down(localGrid) {
	localGrid[1][1]
}

export function swap1(localGrid) {
	let top = localGrid[0][1]
	let center = localGrid[1][1]
	let bottom = localGrid[2][1]
	if (center.density === 1 && bottom.density < center.density){
		return bottom
	}
	if (top.density === 1 && center.density < top.density && top.density !== 255) {
		return top
	}
	return center
}

export function swap2(localGrid) {
	let top = localGrid[0][1]
	let center = localGrid[1][1]
	let bottom = localGrid[2][1]
	if (center.density === 2 && bottom.density < center.density){
		return bottom
	}
	if (top.density === 2 && center.density < top.density && top.density !== 255) {
		return top
	}
	return center
}

export function swap3(localGrid) {
	let top = localGrid[0][1]
	let center = localGrid[1][1]
	let bottom = localGrid[2][1]
	if (center.density === 3 && bottom.density < center.density){
		return bottom
	}
	if (top.density === 3 && center.density < top.density && top.density !== 255) {
		return top
	}
	return center
}

