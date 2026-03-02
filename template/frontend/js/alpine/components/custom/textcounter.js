
// <div
//   x-data="textcounter({ targetNumber: 50000, duration: 5000 })"
//   className="text-center"
//   x-ref="counterElement"
// >
//   <h1 x-text="formattedNumber"></h1>
// </div>
//
export const textcounter = {
    name: 'textcounter',
    component({ targetNumber = 1000, duration = 2000 }) {
        return {
        	// Set the target number you want to count up to
            targetNumber: targetNumber,
            // Set the duration of the counting in milliseconds
            duration: duration,
            currentNumber: 0,
            formattedNumber: '0',
            easingFactor: 10, // You can adjust this value to control the easing effect
                 observer: null,
            initObserver() {
                this.observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.startCounting();
                            this.observer.disconnect(); // Stop observing once the animation starts
                        }
                    });
                });
                this.observer.observe(this.$refs.counterElement);
            },
            init() {
							console.log(this.targetNumber);
                this.initObserver();
            },
            startCounting() {

								let startTime = null;
		            const easingFunction = (t) => 1 - Math.pow(1 - t, this.easingFactor); // Customizable ease-out function
		            const updateCounter = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = timestamp - startTime;
                const t = Math.min(progress / this.duration, 1); // Normalize progress (0-1)
                const easedProgress = easingFunction(t);
                this.currentNumber = Math.floor(easedProgress * this.targetNumber);
                this.formattedNumber = this.currentNumber.toLocaleString();
                if (progress < this.duration) {
                    requestAnimationFrame(updateCounter);
                }
            };
            requestAnimationFrame(updateCounter);
            }
        }
    }
};

export default textcounter;
