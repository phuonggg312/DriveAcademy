const generateSpacingClasses = (variants, max = 100, step = 2) => {
  const breakpoints = ["lg"];
  const classes = [];

  for (let i = 0; i <= max; i += step) {
    variants.forEach((variant) => {
      classes.push(`${variant}-[${i}px]`);
      breakpoints.forEach((bp) => {
        classes.push(`${bp}:${variant}-[${i}px]`);
      });
    });
  }

  return classes;
};

const generatePercentClass = (variants, max = 100, step = 2) => {
    const breakpoints = ["lg"];
    const classes = [];

    for (let i = 100; i <= max; i += step) {
        variants.forEach((variant) => {
            classes.push(`${variant}-[${i}%]`);
            breakpoints.forEach((bp) => {
                classes.push(`${bp}:${variant}-[${i}%]`);
            });
        });
    }

    return classes;
};

const generateWidthHeightClasses = (variants, max = 100, step = 2) => {
  const breakpoints = ["lg"];
  const classes = [];

  for (let i = 100; i <= max; i += step) {
    variants.forEach((variant) => {
      classes.push(`${variant}-[${i}px]`);
      breakpoints.forEach((bp) => {
        classes.push(`${bp}:${variant}-[${i}px]`);
      });
    });
  }

  return classes;
};

const generateOrderingClasses = (variants, max = 100, step = 2) => {
  const breakpoints = ["lg"];
  const classes = [];

  for (let i = 0; i <= max; i += step) {
    variants.forEach((variant) => {
      classes.push(`${variant}-[${i}]`);
      breakpoints.forEach((bp) => {
        classes.push(`${bp}:${variant}-[${i}]`);
      });
    });
  }

  return classes;
};

module.exports = {
  important: false,
  content: [
    "./apps/*.liquid",
    "./layout/*.liquid",
    "./templates/**/*.liquid",
    "./sections/*.liquid",
    "./snippets/*.liquid",
    "./frontend/src/**/*.tsx",
    "./frontend/components/**/*.jsx",
    "./node_modules/@mindarc/arctheme-components/frontend/src/**/*.tsx",
  ],
  variants: {
    extend: {
      translate: ["group-hover"],
    },
  },
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px", // Small screens
        md: "768px", // Medium screens
        lg: "1024px", // Large screens
        xl: "1280px", // Extra-large screens
      },
    },
    extend: {
      colors: {
        oyster: "#F2F2EF",
        urchin: "#25272A",
        "urchin-50-light": "#929394",
        "urchin-50-dark": "#BEBEBF",
        black: "#000000",
        "black-50": "#808080",
        kelp: "#5A563D",
        neon: "#99FF99",
        dish: "#DCDAE7",
        "dish-liquid": "#625D9C",
        "dish-washing-powder": "#BAABCC",
        "hand-wash-mandarin": "#FA9370",
        "hand-wash-cedarwood": "#6F3332",
        "hand-wash-neroli": "#394E47",
        "bath-shower": "#C8DCD3",
        toilet: "#C5D4E2",
        "multi-purpose": "#FFE875",
        "fabric-soaker-booster": "#FFC9D3",
        "stain-remover": "#FFB1BE",
        pegs: "#FB91A3",
        "laundry-liquid": "#F87C8A",
        "body-wash-saffron": "#AF90A7",
        "body-lotion": "#F8C6B8",
        conditioner: "#B9D6DE",
        shampoo: "#287DA2",
        "deo-cucumber": "#BCC6BC",
        "deo-vetiver": "#726773",
        "error-1": "#DC362E"
      },
      backgroundImage: {
        "select-arrow":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='8' viewBox='0 0 16 8' fill='none'%3E%3Cpath d='M1 0.5L8 7.5L15 0.5' stroke='black' stroke-linejoin='round'/%3E%3C/svg%3E\")",
        "checkbox-checked":
          "url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e\")",
      },
      boxShadow: {
        light: '0px 2px 2px 2px rgba(0, 0, 0, 0.10)'
      }
    },
  },
  plugins: [
    require("@tailwindcss/typography")({ className: "rte" }), // https://tailwindcss.com/docs/typography-plugin
  ],
  safelist: [
    // Uncomment to debug purgeCSS related styling issues
    {
      pattern: /justify-+/,
      variants: ["lg"],
    },
    {
      pattern: /text-+/,
      variants: ["lg"],
    },
    {
      pattern: /items-+/,
      variants: ["lg"],
    },
    {
      pattern: /opacity-+/,
      variants: ["lg"],
    },
    "lg:hidden",
    ...generateSpacingClasses(["mb", "mt", "mr", "ml", "my", "mx"], 200, 1),
    ...generateSpacingClasses(
      ["p", "pb", "pt", "pr", "pl", "py", "px"],
      200,
      1,
    ),
    ...generatePercentClass(["basis"], 100, 1),
    ...generateSpacingClasses(["gap-x", "gap-y", "gap"], 100, 1),
    ...generateSpacingClasses(["space-x", "space-y"], 100, 1),
    ...generateOrderingClasses(["order"], 10, 1),
    ...generateOrderingClasses(["grid-cols"], 10, 1),
    ...generateWidthHeightClasses(["max-w", "min-w"], 2000, 1),
    ...generateWidthHeightClasses(["h", "w"], 1000, 1),
    ...generateWidthHeightClasses(["min-h"], 1000, 1),
  ],
};
