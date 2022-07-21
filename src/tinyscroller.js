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
	PROGRESS_CONTAINER: `${TINYSCROLLER_BASE_CLASSNAME}__progresscontainer`,
	PROGRESS_DOT: `${TINYSCROLLER_BASE_CLASSNAME}__progressdot`,
	ARROW_CONTAINER: `${TINYSCROLLER_BASE_CLASSNAME}__arrowcontainer`,
	ARROW: `${TINYSCROLLER_BASE_CLASSNAME}__arrow`,
	IMAGE_CONTAINER: `${TINYSCROLLER_BASE_CLASSNAME}__imgcontainer`,
	IMAGE_WRAPPER: `${TINYSCROLLER_BASE_CLASSNAME}__imgwrapper`,
	IMAGE: `${TINYSCROLLER_BASE_CLASSNAME}__image`,
};

const TINYSCROLLER_DEFAULT_OPTIONS = {
	orientation: "horizontal",
	fit: "cover",
	progress: true,
	arrows: true,
};

function debounce(callback, timeoutInMS) {
	
	let timeoutID;
	
	return (...args) => {
		
		clearTimeout(timeoutID);
		
		timeoutID = setTimeout(
			() => callback(...args),
			timeoutInMS
		);
		
	};
	
}

/**
 * An absolutely abnormally abysmally small image scroller.
 * 
 * @author Trevor Sears <trevor@trevorsears.com> (https://trevorsears.com/)
 * @version v0.1.0
 * @since v0.1.0
 */
export class Tinyscroller {
	
	/**
	 * Initializes a new Tinyscroller instance.
	 * 
	 * @param {string | Element} target
	 * @param options
	 */
	constructor(target, options = TINYSCROLLER_DEFAULT_OPTIONS) {
		
		// Validate that the input options are actually useable.
		Tinyscroller.validateOptions(options);
		
		// Sanitize the 'target' constructor argument to an element.
		// Possible input options include a DOM node/element, or a valid CSS
		// selector that can be used to target the desired node.
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
		
		// Create this object's options object using a combination of the
		// default options and the user provided options object.
		this.options = { ...TINYSCROLLER_DEFAULT_OPTIONS, ...options };
		this.imageContainer = document.createElement("div");
		this.images = [];
		this.cursor = 0;
		
		// Add a listener to handle scroll events that are not along the primary
		// axis of this scroll container. For vertical Tinyscroller instances,
		// this will handle scroll events along the horizontal axis, whereas for
		// horizontal Tinyscroller instances, this will handle scroll events
		// along the vertical axis.
		this.imageContainer.addEventListener("wheel", (wheelEvent) => {
			
			const shouldUseEvent = (
				this.options.orientation === "vertical" &&
				wheelEvent.shiftKey
			) || (
				this.options.orientation === "horizontal" &&
				!wheelEvent.shiftKey
			);
			
			if (shouldUseEvent) {
				
				if (wheelEvent.deltaY < 0) this.scrollToPrevious("smooth");
				else if (wheelEvent.deltaY > 0) this.scrollToNext("smooth");
				
			}
			
		});
		
		// Insert the image container div into this Tinyscroller's outer
		// container div.
		this.outerContainer.appendChild(this.imageContainer);
		
		this.outerContainer.classList.add(
			TINYSCROLLER_CLASSNAMES.OUTER_CONTAINER
		);
		
		this.imageContainer.classList.add(
			TINYSCROLLER_CLASSNAMES.IMAGE_CONTAINER
		);
		
		this.setOrientation(this.options.orientation);
		this.setImageFit(this.options.fit);
		
		if (this.options.progress === true) {
			
			this.progressContainer = document.createElement("div");
			
			this.progressContainer.classList.add(
				TINYSCROLLER_CLASSNAMES.PROGRESS_CONTAINER
			);
			
			this.outerContainer.prepend(this.progressContainer);
			
		}
		
		if (this.options.arrows === true) {
			
			
			
		}
		
		const DEBOUNCE_TIMING = 75;
		
		this.scrollToFirst = debounce(
			this.scrollToFirst.bind(this),
			DEBOUNCE_TIMING
		);
		
		this.scrollToPrevious = debounce(
			this.scrollToPrevious.bind(this),
			DEBOUNCE_TIMING
		);
		
		this.scrollToNext = debounce(
			this.scrollToNext.bind(this),
			DEBOUNCE_TIMING
		);
		
	}
	
	/**
	 * Validates the provided Tinyscroller options object, throwing an Error if
	 * the provided value does not conform to the expected format.
	 * 
	 * @param {any} options A value to validate against the expected format of a
	 * Tinyscroller options object.
	 * @throws {Error} If the provided value does not conform to the expected
	 * format.
	 */
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
	
	/**
	 * Returns the current orientation of this Tinyscroller instance.
	 * 
	 * @returns {"vertical" | "horizontal"} The current orientation of this
	 * Tinyscroller instance.
	 */
	getOrientation() {
		
		return this.options.orientation;
		
	}
	
	/**
	 * Sets the orientation of this Tinyscroller instance to the specified
	 * value. Acceptable values include 'vertical' and 'horizontal'.
	 * 
	 * @param {"vertical" | "horizontal"} orientation The orientation to set
	 * this Tinyscroller instance to. Acceptable values include 'vertical' and
	 * 'horizontal'.
	 */
	setOrientation(orientation) {
		
		if (orientation !== this.options.orientation) {
			
			this.imageContainer.classList.remove(
				`${TINYSCROLLER_CLASSNAMES.IMAGE_CONTAINER}--` +
				`orientation-${this.options.orientation}`
			);
			
		}
		
		this.imageContainer.classList.add(
			`${TINYSCROLLER_CLASSNAMES.IMAGE_CONTAINER}--` +
			`orientation-${orientation}`
		);
		
		this.options.orientation = orientation;
		
	}
	
	/**
	 * Returns the current image fit of this Tinyscroller instance.
	 * 
	 * @returns {"contain" | "cover" | "fill"} The current image fit of this
	 * Tinyscroller instance.
	 */
	getImageFit() {
		
		return this.options.fit;
		
	}
	
	/**
	 * Sets the image fit of this Tinyscroller instance to the specified value.
	 * Acceptable values include 'contain', 'cover', and 'fill'.
	 * 
	 * @param {"contain" | "cover" | "fill"} fit The image fit to set this
	 * Tinyscroller instance to. Acceptable values include 'contain', 'cover',
	 * and 'fill'.
	 */
	setImageFit(fit) {
		
		this.images.forEach((image) => {
			
			if (fit !== this.options.fit) {
				
				image.classList.remove(
					`${TINYSCROLLER_CLASSNAMES.IMAGE}--` +
					`fit-${this.options.fit}`
				);
				
			}
			
			image.classList.add(
				`${TINYSCROLLER_CLASSNAMES.IMAGE}--` +
				`fit-${fit}`
			);
			
		});
		
		this.options.fit = fit;
		
	}
	
	enableArrows() {
		
		this.arrowContainers = {};
		
		if (this.options.orientation === "horizontal") {
			
			this.arrowContainers.left = document.createElement("div");
			this.arrowContainers.right = document.createElement("div");
			
			this.arrowContainers.right.addEventListener(
				"click",
				() => this.scrollToNext("smooth")
			);
			
			this.arrowContainers.left.addEventListener(
				"click",
				() => this.scrollToPrevious("smooth")
			);
			
		} else if (this.options.orientation === "vertical") {
			
			// eslint-disable-next-line id-length
			this.arrowContainers.up = document.createElement("div");
			this.arrowContainers.down = document.createElement("div");
			
			this.arrowContainers.right.addEventListener(
				"click",
				() => this.scrollToNext("smooth")
			);
			
			this.arrowContainers.left.addEventListener(
				"click",
				() => this.scrollToPrevious("smooth")
			);
			
		}
		
		const arrowContainers = Object.keys(this.arrowContainers).map(
			(key) => {
				
				this.arrowContainers[key].classList.add(
					`${TINYSCROLLER_CLASSNAMES.ARROW_CONTAINER}--` +
					`direction-${key}`
				);
				
				return this.arrowContainers[key];
				
			}
		);
		
		arrowContainers.forEach((arrowContainer) => {
			
			arrowContainer.classList.add(
				TINYSCROLLER_CLASSNAMES.ARROW_CONTAINER
			);
			
			const arrow = document.createElement("div");
			
			arrow.classList.add(TINYSCROLLER_CLASSNAMES.ARROW);
			
			arrowContainer.appendChild(arrow);
			
		});
		
		this.outerContainer.prepend(...arrowContainers);
		
	}
	
	disableArrows() {
		
		["left", "right", "top", "bottom"].forEach((direction) => {
			
			this?.arrowContainers?.[direction]?.remove();
			
		});
		
		this.arrowContainers = undefined;
		
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
			
			const imageWrapper = document.createElement("div");
			
			image.classList.add(TINYSCROLLER_CLASSNAMES.IMAGE);
			
			if (this.options.fit !== undefined) {
				
				image.classList.add(
					`${TINYSCROLLER_CLASSNAMES.IMAGE}--` +
					`fit-${this.options.fit}`
				);
				
			}
			
			imageWrapper.classList.add(
				TINYSCROLLER_CLASSNAMES.IMAGE_WRAPPER
			);
			
			if (this.progressContainer !== undefined) {
				
				const progressDot = document.createElement("div");
				
				progressDot.classList.add(TINYSCROLLER_CLASSNAMES.PROGRESS_DOT);
				
				progressDot.addEventListener("click", () => {
					
					imageWrapper.scrollIntoView({
						behavior: "smooth",
					});
					
				});
				
				this.progressContainer.append(progressDot);
				
			}
			
			imageWrapper.appendChild(image);
			
			this.imageContainer.append(imageWrapper);
			
		}
		
	}
	
	scrollToIndex(index, behavior) {
		
		
		
	}
	
	/**
	 * Causes this Tinyscroller instance to scroll to the first image it
	 * contains.
	 * 
	 * @param {"auto" | "smooth"} behavior The scrolling behavior to use for
	 * this scrolling operation.
	 */
	scrollToFirst(behavior) {
		
		this.scrollToIndex(0, behavior);
		
	}
	
	/**
	 * Causes this Tinyscroller instance to scroll to the last image it
	 * contains.
	 * 
	 * @param {"auto" | "smooth"} behavior The scrolling behavior to use for
	 * this scrolling operation.
	 */
	scrollToLast(behavior) {
		
		this.scrollToIndex(this.images.length - 1, behavior);
		
	}
	
	/**
	 * Causes this Tinyscroller instance to scroll to the image that precedes
	 * the currently shown image.
	 *
	 * @param {"auto" | "smooth"} behavior The scrolling behavior to use for
	 * this scrolling operation.
	 */
	scrollToPrevious(behavior) {
		
		// this.scrollToIndex(--this.cursor, behavior);
		
		if (this.options.orientation === "vertical") {
			
			this.imageContainer.scrollBy({
				top: -100,
				left: 0,
				behavior,
			});
			
		} else if (this.options.orientation === "horizontal") {
			
			this.imageContainer.scrollBy({
				top: 0,
				left: -100,
				behavior,
			});
			
		}
		
	}
	
	/**
	 * Causes this Tinyscroller instance to scroll to the image that succeeds
	 * the currently shown image.
	 *
	 * @param {"auto" | "smooth"} behavior The scrolling behavior to use for
	 * this scrolling operation.
	 */
	scrollToNext(behavior) {
		
		// this.scrollToIndex(++this.cursor, behavior);
		
		if (this.options.orientation === "vertical") {
			
			this.imageContainer.scrollBy({
				top: 100,
				left: 0,
				behavior,
			});
			
		} else if (this.options.orientation === "horizontal") {
			
			this.imageContainer.scrollBy({
				top: 0,
				left: 100,
				behavior,
			});
			
		}
		
	}
	
}
