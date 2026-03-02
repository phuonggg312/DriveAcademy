import React, { useEffect, useState } from "react";
import { useAlpineStore } from "@arctheme-hooks/useAlpineStore";
import ModelView from "./CollectionActions/ModelView";
import Sort from "./CollectionActions/Sort";
import Filters from "./CollectionActions/Filters";
import cloneDeep from "lodash/cloneDeep";

export const CollectionToolbar = ({ settings, toggleSidebar }) => {
  const store: any = useAlpineStore("modelview");
  const [selectedOption, setSelectedOption] = useState(cloneDeep(window.defaultSort));

  return (
    <div className="plp toolbar flex items-center space-x-4 w-full">
      <div
          className={
            `flex toolbar-items w-full`
          }
      >
        <div className={'toolbar-left flex gap-2 lg:gap-10 w-full justify-start max-lg:basis-1/2'}>
          {settings.section.filter_alignment == 'left' && <Filters store={store} settings={settings} toggleSidebar={toggleSidebar} />}
          {settings.section.sort_alignment == 'left' && <Sort settings={settings} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />}

        </div>

        <div className={'toolbar-right flex gap-2 lg:gap-10 w-full justify-end max-lg:basis-1/2'}>
          {settings.section.filter_alignment == 'right' && <Filters store={store} settings={settings} toggleSidebar={toggleSidebar} />}
          {settings.section.sort_alignment == 'right' && <Sort settings={settings} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />}

          <ModelView store={store} />
        </div>
      </div>
    </div>
  );
};
