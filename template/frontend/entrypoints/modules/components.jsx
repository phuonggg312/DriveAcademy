import * as Navigation from "../../components/Navigation";
import * as Sections from "../../components/Sections";
import * as Product from "../../components/Product";
import * as Ecommerce from "../../components/Ecommerce";
import * as List from "../../components/List";
import * as Blocks from "../../components/Blocks";
import * as Blogs from "../../components/Blogs";
import * as Pages from "../../components/Pages";
import * as Styleguide from "../../components/Styleguide/Styleguide";
import * as Client from "../../components/Client";

function getComponentEntries(obj) {
    return Object.entries(obj)
        .filter(([, component]) => component.displayName)
        .map(([, component]) => ({
            name: component.displayName,
            element: component,
        }));
}

export function getComponents() {
    const sources = [
        Navigation,
        Sections,
        Product,
        Ecommerce,
        List,
        Blocks,
        Blogs,
        Pages,
        Styleguide,
        Client,
    ];

    // Aggregate all component entries from each source
    return sources.flatMap(getComponentEntries);
}
