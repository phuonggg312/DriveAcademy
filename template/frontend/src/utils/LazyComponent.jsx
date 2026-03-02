import React from "react";

// Import both project and package components
const projectModules = import.meta.glob('/frontend/src/stories/**/!(Layout)/**/*.tsx', { eager: false });
const packageModules = import.meta.glob('/node_modules/@mindarc/arctheme-components/frontend/src/stories/components/**/!(Layout)/**/*.tsx', { eager: false });
const localPackageModules = import.meta.glob('/.yalc/@mindarc/arctheme-components/frontend/src/stories/components/**/!(Layout)/**/*.tsx', { eager: false });

// Filter out .stories files after importing
const filterStories = modules =>
    Object.keys(modules).reduce((acc, path) => {
        if (!path.includes('.stories')) { // Exclude .stories files
            const componentName = path.match(/\/([^\/]+)\.tsx$/)[1];
            acc[componentName] = React.lazy(() => modules[path]().then(module => ({ default: module[componentName] })));
        }
        return acc;
    }, {});

// Merge filtered modules, prioritizing project modules over package modules
export const lazyComponents = {
    ...filterStories(packageModules),
    ...filterStories(localPackageModules),
    ...filterStories(projectModules),
};
