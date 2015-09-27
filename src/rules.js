export function down(localGrid) {
	localGrid[1][1]
}

export function swap(d) {
	return localGrid => {
		let top = localGrid[0][1]
		let center = localGrid[1][1]
		let bottom = localGrid[2][1]
		if (center.density === d && bottom.density < center.density){
			return bottom
		}
		if (top.density === d && center.density < top.density && top.density !== 255) {
			return top
		}
		return center
	}
}

