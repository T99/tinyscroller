import { Tinyscroller } from "./tinyscroller.min.js";

document.addEventListener("DOMContentLoaded", () => {
	
	const tinyscroller = new Tinyscroller(".tinyscroller", {
		fit: "fill",
	});
	
	const IMAGE_COUNT = 5;
	
	for (let i = 1; i <= IMAGE_COUNT; i++) {
		
		tinyscroller.addImages(
			`https://picsum.photos/800/450?random=${i}`
		);
		
	}
	
});
