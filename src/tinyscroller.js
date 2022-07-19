/*
 * Created by Trevor Sears <trevor@trevorsears.com> (https://trevorsears.com/).
 * 10:47 AM -- July 19, 2022.
 * Project: tinyscroller
 * 
 * tinyscroller - An absolutely abnormally abysmally small image scroller.
 * Copyright (C) 2022 Trevor Sears
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const TINYSCROLLER_BASE_CLASSNAME = "tinyscroller";

const TINYSCROLLER_CLASSNAMES = {
	OUTER_CONTAINER: `${TINYSCROLLER_BASE_CLASSNAME}__outercontainer`,
	INNER_CONTAINER: `${TINYSCROLLER_BASE_CLASSNAME}__innercontainer`,
	IMAGE_CONTAINER: `${TINYSCROLLER_BASE_CLASSNAME}__imgcontainer`,
	IMAGE: `${TINYSCROLLER_BASE_CLASSNAME}__image`,
};

const TINYSCROLLER_DEFAULT_OPTIONS = {
	orientation: "horizontal",
	fit: "cover",
};

export class Tinyscroller {
	
	constructor(target, options = TINYSCROLLER_DEFAULT_OPTIONS) {
		
		Tinyscroller.validateOptions(options);
		
		if (target instanceof Element) this.outerContainer = target;
		else if (typeof target === "string") {
			
			this.outerContainer = document.querySelector(target);
			
		} else {
			
			throw new Error(
				"The target provided to the Tinyscroller constructor does " +
				"not appear to be either a valid DOM element nor a CSS " +
				"selector string."
			);
			
		}
		
		this.innerContainer = document.createElement("div");
		this.options = { ...TINYSCROLLER_DEFAULT_OPTIONS, ...options };
		this.images = [];
		
		this.outerContainer.appendChild(this.innerContainer);
		
		this.outerContainer.classList.add(
			TINYSCROLLER_CLASSNAMES.OUTER_CONTAINER
		);
		
		this.innerContainer.classList.add(
			TINYSCROLLER_CLASSNAMES.INNER_CONTAINER
		);
		
		if (this.options.orientation !== undefined) {
			
			this.innerContainer.classList.add(
				`${TINYSCROLLER_CLASSNAMES.INNER_CONTAINER}--` +
				`orientation-${this.options.orientation}`
			);
			
		}
		
		if (this.options.fit !== undefined) {
			
			this.images.forEach((image) => {
				
				image.classList.add(
					`${TINYSCROLLER_CLASSNAMES.IMAGE}--` +
					`fit-${this.options.fit}`
				);
				
			});
			
		}
		
	}
	
	static validateOptions(options) {
		
		if (!["horizontal", "vertical", undefined].includes(
			options?.orientation
		)) {
			
			throw new Error(
				"Tinyscroller options 'orientation' field was expected to be " +
				"either 'horizontal', 'vertical', or undefined, but instead " +
				`received: ${options.orientation}.`
			);
			
		}
		
		if (!["contain", "cover", "fill", undefined].includes(
			options?.fit
		)) {
			
			throw new Error(
				"Tinyscroller options 'fit' field was expected to be " +
				"either 'contain', 'cover', 'fill', or undefined, but " +
				`instead received: ${options.fit}.`
			);
			
		}
		
	}
	
	addImages(...images) {
		
		for (let image of images) {
			
			if (typeof image === "string") {
				
				const url = image;
				
				image = document.createElement("img");
				image.src = url;
				
			} else if (!(image instanceof HTMLImageElement)) {
				
				throw new Error(
					"An invalid object was provided to TinyScroller#addImages"
				);
				
			}
			
			this.images.push(image);
			
			const imageContainer = document.createElement("div");
			
			image.classList.add(TINYSCROLLER_CLASSNAMES.IMAGE);
			
			if (this.options.fit !== undefined) {
				
				image.classList.add(
					`${TINYSCROLLER_CLASSNAMES.IMAGE}--` +
					`fit-${this.options.fit}`
				);
				
			}
			
			imageContainer.classList.add(
				TINYSCROLLER_CLASSNAMES.IMAGE_CONTAINER
			);
			
			imageContainer.appendChild(image);
			
			this.innerContainer.append(imageContainer);
			
		}
		
	}
	
}
