import React from "react";
import useMobileBreakpoint from "@arctheme-hooks/useMobileBreakpoint";
import { Paragraph } from "@arctheme-components/elements/Paragraph/Paragraph";
import { Headings } from "@arctheme-components/elements/Headings/Headings";

// Mock component for collection items, you can replace it with your actual component
const CollectionItem = ({ image, title, link }) => (
  <div className="collection-item flex-none w-auto h-auto flex flex-col items-center text-center gap-2 lg:gap-4 group">
    <div className="w-[90px] lg:w-[137px] h-[90px] lg:h-[137px]">
      <a
        href={link}
        title={title}
      >
        <img
          src={image.src || image}
          alt={image.alt || "Collection Image"}
          className="w-full h-full object-cover"
        />
      </a>
    </div>

    <div className=" flex justify-center items-center gap-1">
      <a href={link} className="text-sm group-hover:underline">
        {title}
      </a>

      <i className={"icon icon-ur-arrow text-[17px]"}></i>
    </div>
  </div>
);

export const CollectionListLayout = ({ props }) => {
  const { section, description, mobile_image, featured_collections } = props;
  const isMobile = useMobileBreakpoint(section.mobile_breakpoint);
  let collections = featured_collections;

  return (
    <div className="collection-header__with-collections relative w-full h-full">
      {section.image && (
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet={mobile_image}
            data-alt={mobile_image.alt}
            width={mobile_image.width}
            height={mobile_image.height}
          />
          <source media="(max-width: 1440px)" srcSet={section.image} />
          <img
            src={section.image}
            className="w-full h-auto"
            width={section.image.width}
            height={section.image.height}
            alt={section.image.alt}
          />
        </picture>
      )}
      <div className={`relative top-0 left-0 w-full flex flex-col lg:flex-row gap-6 lg:gap-[48px] justify-between h-full`}>
        <div className="collection-list-details max-w-[448px] text-left">
          {isMobile ? (
            <Headings
              text={section.title}
              classes={`collection-header__with-image__title mb-4 ${section.heading_type_mobile}`}
            />
          ) : (
            <Headings
              text={section.title}
              classes={`collection-header__with-image__title mb-4 lg:mb-6
              ${section.heading_type_desktop}`}
            />
          )}
          {section.show_description && (
            <Paragraph
              text={description}
              type={`${isMobile ? 'b4' : section.body_type} self-center w-full pb-1 lg:py-3 lg:max-w-[${section.content_width}] lg:leading-[15px]`}
              maxChars={250}
            />
          )}
        </div>
        {/* Collection List */}
        <div className="collection-list flex gap-x-[12px] overflow-x-auto lg:justify-between pb-2">
          {collections.map((collection, index) => (
            <CollectionItem
              key={index}
              image={collection.image}
              title={collection.title}
              link={collection.link}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
