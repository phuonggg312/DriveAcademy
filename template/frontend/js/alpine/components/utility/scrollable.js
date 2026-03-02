export const scrollable = {
  name: "scrollable",
  component() {
    return {
      isDown: false,
      isDragging: false,
      startX: 0,
      scrollLeft: 0,
      clickPrevented: false,

      init() {
        const scrollableArea = this.$el;

        scrollableArea.addEventListener(
          "mousedown",
          this.onMouseDown.bind(this),
        );
        scrollableArea.addEventListener(
          "mouseleave",
          this.onMouseLeave.bind(this),
        );
        scrollableArea.addEventListener("mouseup", this.onMouseUp.bind(this));
        scrollableArea.addEventListener(
          "mousemove",
          this.onMouseMove.bind(this),
        );
        scrollableArea.addEventListener("click", this.onClick.bind(this));

        // Prevent text selection
        scrollableArea.addEventListener("dragstart", (e) => e.preventDefault());
        scrollableArea.addEventListener("selectstart", (e) =>
          e.preventDefault(),
        );
      },

      onMouseDown(e) {
        this.isDown = true;
        this.isDragging = false;
        this.clickPrevented = false;
        this.startX = e.pageX - this.$el.offsetLeft;
        this.scrollLeft = this.$el.scrollLeft;
        this.$el.style.cursor = "grabbing";
        e.preventDefault(); // Prevent text selection
      },

      onMouseLeave() {
        this.isDown = false;
        this.$el.style.cursor = "grab";
      },

      onMouseUp() {
        if (this.isDragging) {
          this.clickPrevented = true; // Mark the click as prevented
        }
        this.isDown = false;
        this.isDragging = false;
        this.$el.style.cursor = "grab";
      },

      onMouseMove(e) {
        if (!this.isDown) return;
        e.preventDefault();
        this.isDragging = true; // Set dragging state
        const x = e.pageX - this.$el.offsetLeft;
        const walk = (x - this.startX) * 2; // *2 for faster scrolling
        this.$el.scrollLeft = this.scrollLeft - walk;
      },

      onClick(e) {
        // Prevent click if dragging occurred
        if (this.clickPrevented) {
          e.preventDefault();
          e.stopImmediatePropagation(); // Stop the click from propagating
          this.clickPrevented = false; // Reset for the next interaction
        }
      },
    };
  },
};

export default scrollable;
