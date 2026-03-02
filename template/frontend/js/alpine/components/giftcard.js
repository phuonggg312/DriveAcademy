import QRCode from "qrcode";

export default {
  name: "giftcard",
  component() {
    return {
      qrCodeCanvas: null,
      printButton: null,
      giftCardCode: null,

      init() {

        // Initialize QR codes
        this.qrCodeCanvas = document.querySelectorAll("[data-gift-card-qr]");
        this.qrCodeCanvas.forEach((element) => {
          QRCode.toCanvas(element, element.dataset.identifier);
        });

        // Initialize print button functionality
        this.printButton = document.querySelectorAll("[data-gift-card-print]");
        this.printButton.forEach((element) => {
          element.addEventListener("click", () => {
            window.print();
          });
        });

        // Auto-select gift card code on click
        this.giftCardCode = document.querySelectorAll(
          "[data-gift-card-digits]",
        );
        this.giftCardCode.forEach((element) => {
          element.addEventListener("click", (evt) => {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(evt.target);
            selection.removeAllRanges();
            selection.addRange(range);
          });
        });
      },
    };
  },
};
