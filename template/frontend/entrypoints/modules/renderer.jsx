import React from "react";
import ReactDOM from "react-dom/client";
import * as AnimationModule from "./animations";
import * as ComponentsModule from "./components";

export function addListeners() {
  document.addEventListener("DOMContentLoaded", function () {
    AnimationModule.start();
    renderReactBlocks(ComponentsModule.getComponents());
  });

  document.addEventListener("liquid-ajax-cart:request-end", (event) => {
    renderReactBlocks(ComponentsModule.getComponents());
  });
}

export function renderReactBlocks(component_list) {
  let node = "";

  function decodeHTMLEntities(text) {
    const entities = {
      "&amp;": "&",
      "&quot;": '"',
      "&#39;": "'",
      "&lt;": "<",
      "&gt;": ">",
      "&nbsp;": " ",
      // Add more entities if necessary
    };
    return text.replace(/&[^\s;]+;/g, (match) => entities[match] || match);
  }

  function stripHTMLTags(text) {
    const doc = new DOMParser().parseFromString(text, "text/html");
    return doc.body.textContent || "";
  }

  function sanitizeJSON(jsonString) {
    try {
      // Remove line breaks, tabs, and extra spaces
      let sanitizedString = jsonString
        .replace(/\\n/g, "")
        .replace(/\\t/g, "")
        .trim();
      // Decode HTML entities
      sanitizedString = decodeHTMLEntities(sanitizedString);
      // Strip HTML tags
      sanitizedString = stripHTMLTags(sanitizedString);
      // Remove invalid trailing commas
      sanitizedString = sanitizedString.replace(/,\s*([\]}])/g, "$1");
      return sanitizedString;
    } catch (error) {
      console.error(`Error sanitizing JSON string: ${error.message}`);
      return null;
    }
  }

  try {
    let propsDataJSON = null;
    if (component_list.length > 0) {
      for (let i = 0; i < component_list.length; i++) {
        const nodes = document.querySelectorAll(
          "[data-theme-id=" + component_list[i].name + "]",
        );

        if (nodes.length > 0) {
          for (let j = 0; j < nodes.length; j++) {
            node = component_list[i].name;

            let node_data_props = null;
            var injected = nodes[j].getAttribute("injected");

            if (!injected) {
              let propsNode =
                nodes[j].parentElement.querySelector("#react-data");

              if (propsNode) {
                propsDataJSON = propsNode.getAttribute("data-injected-props");
                const sanitizedPropsDataJSON = sanitizeJSON(propsDataJSON);

                if (sanitizedPropsDataJSON) {
                  try {
                    node_data_props = JSON.parse(sanitizedPropsDataJSON);
                  } catch (parseError) {
                    console.log(sanitizedPropsDataJSON);
                    console.error(
                      `JSON parse error on node ${node}: ${parseError.message}`,
                    );
                    continue;
                  }
                  propsNode.remove();
                } else {
                  console.error(`Sanitization failed for node ${node}`);
                  continue;
                }
              } else {
                if (nodes[j].getAttribute("data-block-props")) {
                  propsDataJSON = nodes[j].getAttribute("data-block-props");
                  const sanitizedPropsDataJSON = sanitizeJSON(propsDataJSON);

                  if (sanitizedPropsDataJSON) {
                    try {
                      node_data_props = JSON.parse(sanitizedPropsDataJSON);
                    } catch (parseError) {
                      console.error(
                        `JSON parse error on node ${node}: ${parseError.message}`,
                      );
                      continue;
                    }
                    nodes[j].remove();
                  } else {
                    console.error(`Sanitization failed for node ${node}`);
                    continue;
                  }
                }
              }

              const Element = component_list[i].element;

              if (Element) {
                ReactDOM.createRoot(nodes[j]).render(
                    <React.StrictMode>
                      <Element settings={node_data_props}/>
                    </React.StrictMode>,
                );

                if (nodes[j]) {
                  nodes[j].setAttribute(
                      "id",
                      component_list[i].name + "-injected",
                  );
                  nodes[j].setAttribute("injected", true);
                  nodes[j].removeAttribute(
                      "data-block-props",
                      component_list[i].name + "-injected",
                  );
                }
              } else {
                console.error(`Error received on component ${component_list[i].name}`);
              }
            }
          }
        }
      }
    }
  } catch (e) {
    console.error(`Error on node ${node}`);
    console.error(e.message);
    console.error("Error Injecting React Components");
  }
}
