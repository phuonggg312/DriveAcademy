
export function start() {
    var observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = entry.target.dataset.animationDelay || '0s';
                entry.target.classList.add('start-animation');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Target the elements to animate
    var elementsToAnimate = document.querySelectorAll('.animated-element');
    elementsToAnimate.forEach(function(element) {
        observer.observe(element);
    });
}
