let trackerName = "";

export const impacttracker = {
  name: "impacttracker",
  component(cookieExpiryDays) {
    return {
      isDragging: false,
      startY: 0,
      initialY: 0,
      trackerShowing: true,
      cookieExpiryDays: cookieExpiryDays || 1,
      animationFrame: null,
      currentY: 0,

      init() {
        // Initialize the component and check for the cookie
        const cookie = this.getCookie("impact_tracker_hidden");
        if (cookie === "true") {
          this.$el.style.display = "none";
          this.trackerShowing = false;
        }

        // Bind the dragging functions
        this.$el.addEventListener("mousedown", this.startDrag.bind(this));
        document.addEventListener("mousemove", this.onMouseMove.bind(this));
        document.addEventListener("mouseup", this.onMouseUp.bind(this));

        // Add touch support for mobile devices
        this.$el.addEventListener("touchstart", this.startDrag.bind(this));
        document.addEventListener("touchmove", this.onMouseMove.bind(this));
        document.addEventListener("touchend", this.onMouseUp.bind(this));
      },

      startDrag(event) {
        event.preventDefault(); // Prevent default behavior like text selection
        if (event.target.id === "impact-tracker__close") return;
        this.isDragging = true;
        this.startY = event.clientY || event.touches[0].clientY;
        this.initialY = this.$el.getBoundingClientRect().top;
      },

      onMouseMove(event) {
        if (!this.isDragging) return;
        this.currentY =
          (event.clientY || event.touches[0].clientY) - this.startY;

        if (!this.animationFrame) {
          this.animationFrame = requestAnimationFrame(
            this.updatePosition.bind(this),
          );
        }
      },

      updatePosition() {
        if (!this.isDragging) return;

        let newY = this.initialY + this.currentY;

        // Dynamically calculate the offset to prevent jumping
        const minY = 0;
        const maxY = window.innerHeight - this.$el.offsetHeight;
        const buffer = 50; // Pixels to keep the tracker away from screen edges

        if (newY < minY + buffer) {
          newY = minY + buffer;
        } else if (newY > maxY - buffer) {
          newY = maxY - buffer;
        }
        // Apply the calculated position
        this.$el.style.top = `${newY}px`;

        this.animationFrame = null;
      },

      onMouseUp() {
        if (!this.isDragging) return;
        this.isDragging = false;
        if (this.animationFrame) {
          cancelAnimationFrame(this.animationFrame);
          this.animationFrame = null;
        }
      },

      closeTracker() {
        this.trackerShowing = false;
        this.$el.style.display = "none";
        this.setCookie("impact_tracker_hidden", "true", this.cookieExpiryDays);
      },

      setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};path=/;expires=${d.toUTCString()}`;
      },

      getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
      },
    };
  },
};

export default impacttracker;
