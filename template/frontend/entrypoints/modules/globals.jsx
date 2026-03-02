import helpers from "../../js/helpers";

export function getMobileBreakpoint(){
    return '1024px';
}

const ns = 'arctheme'
window.arcthemeNamespace = ns
window[ns] = (window[ns] || {})
window[ns].helpers = helpers

for (const [key, value] of Object.entries(helpers)) {
    window[ns].helpers[key] = value
}