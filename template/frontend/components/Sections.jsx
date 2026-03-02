import React from "react";
import newsletter from "../js/alpine/components/newsletter/newsletter";
import { mobileBreakpoint } from "../entrypoints/theme";
import { lazyComponents } from "@src/utils/LazyComponent";

SectionMulticolumn.displayName = 'theme__multicolumn';
export function SectionMulticolumn({ ...props }) {
  const MultiColumnBlock = lazyComponents['Multicolumn'];
  return (
      <MultiColumnBlock
          settings={props.settings}
          headerText={props.settings.section.title}
          subtext={props.settings.section.subtext}
          tagline={props.settings.section.tagline}
          columns={props.settings.blocks}
          columns_count={props.settings.section.columns_count}
          gap={props.settings.section.gap}
      />
  );
}

SectionVideoContainer.displayName = 'theme__videocontainer';
export function SectionVideoContainer({ ...props }) {
  const VideoContainer = lazyComponents['VideoContainer'];
  return (
      <VideoContainer
          containerTitle={props.settings.section.title}
          settings={props.settings.section}
          videos={props.settings.blocks}
      />
  );
}

SectionMarquee.displayName = 'theme__section-marquee';
export function SectionMarquee({ ...props }) {
  const Marquee = lazyComponents['Marquee'];
  props.settings.section.mobile_breakpoint = mobileBreakpoint;
  return (
      <Marquee
          marquee_blocks={props.settings.blocks}
          marquee_speed={props.settings.section.marquee_speed}
          marquee_play_pause={props.settings.section.marquee_play_pause}
          block_gap={props.settings.section.block_gap}
          settings={props.settings.section}
          props={props.settings}
      />
  );
}

SectionTextWithMedia.displayName = 'theme__textwithmedia';
export function SectionTextWithMedia({ ...props }) {
  const TextWithMedia = lazyComponents['TextWithMedia'];
  props.settings.section.mobile_breakpoint = mobileBreakpoint;

  return (
      <TextWithMedia
          reverselayout={false}
          settings={props.settings.section}
          blocks={props.settings.blocks}
          props={props.settings}
      />
  );
}

SectionTestimonials.displayName = 'theme__testimonials';
export function SectionTestimonials({ ...props }) {
  const Testimonials = lazyComponents['Testimonials'];
  props.settings.section.mobile_breakpoint = mobileBreakpoint;
  return <Testimonials settings={props.settings} />;
}

SectionNewsletterSubscribe.displayName = 'theme__newsletter-subscribe';
export function SectionNewsletterSubscribe({ ...props }) {
  const NewsletterSignup = lazyComponents['NewsletterSignup'];
  const NewsletterCTA = lazyComponents['NewsletterCTA'];

  async function customerSubscribe(email) {
    await newsletter.component().subscribe(email);
  }

  if (props.settings.section.newsletter_type === "blockCTA") {
    return (
        <NewsletterCTA
            redirect={props.settings.section.foodclub_redirect}
            blocks={props.settings.blocks}
            heading={props.settings.section.foodclub_section_title}
            disclaimer={props.settings.section.foodclub_disclaimer}
            button_text={props.settings.section.foodclub_cta_label}
            button_url={props.settings.section.foodclub_cta_url}
        />
    );
  }

  return (
      <NewsletterSignup
          show_button={true}
          heading={props.settings.section.cta_title}
          content={props.settings.section.content}
          button_text={props.settings.section.button_text}
          cta_text={props.settings.section.cta_text}
          image={props.settings.section.image}
          onClick={customerSubscribe}
      />
  );
}

SectionBanner.displayName = 'theme__banner';
export function SectionBanner({ ...props }) {
  const Banner = lazyComponents['Banner'];
  props.settings.section.mobile_breakpoint = mobileBreakpoint;
  return (
      <Banner
          banners={props.settings.blocks}
          useCarousel={props.settings.section.use_carousel}
          section_settings={props.settings.section}
          props={props.settings}
      />
  );
}

SectionImageHotSpot.displayName = 'theme__image-hot-spot';
export function SectionImageHotSpot({ ...props }) {
  const ImageHotSpot = lazyComponents['ImageHotSpot'];
  return (
      <ImageHotSpot
          settings={props.settings.section}
          hotspot_block={props.settings.blocks}
      />
  );
}

SectionTabbedWithImage.displayName = 'theme__tabbed-with-image';
export function SectionTabbedWithImage({ ...props }) {
  const TabbedWithImage = lazyComponents['TabbedWithImage'];
  return (
      <TabbedWithImage
          settings={props.settings.section}
          blocks={props.settings.blocks}
      />
  )
}

SectionHeroBanner.displayName = 'theme__hero-banner';
export function SectionHeroBanner({ ...props }) {
  const HeroBanner = lazyComponents['HeroBanner'];
  return <HeroBanner settings={props.settings} />;
}

SectionCollectionBanner.displayName = 'theme__collection-banner';
export function SectionCollectionBanner({ ...props }) {
  const CollectionBanner = lazyComponents['CollectionBanner'];
  return <CollectionBanner settings={props.settings} />;
}

SectionCollectionHeader.displayName = 'theme__collection-header';
export function SectionCollectionHeader({ ...props }) {
  const CollectionHeader = lazyComponents['CollectionHeader'];
  props.settings.section.mobile_breakpoint = mobileBreakpoint;
  return <CollectionHeader settings={props.settings} />;
}

SectionSearchResultsHeader.displayName = 'theme__search-results-header';
export function SectionSearchResultsHeader({ ...props }) {
  const SearchResultsHeader = lazyComponents['SearchResultsHeader'];
  return <SearchResultsHeader settings={props.settings} />;
}

SectionFeaturedLogos.displayName = 'theme__section-featured-logos';
export function SectionFeaturedLogos({ ...props }) {
  const FeaturedLogos = lazyComponents['FeaturedLogos'];
  return (
      <FeaturedLogos
          settings={props.settings}
          title={props.settings.section.title}
          logos={props.settings.blocks}
          use_greyscale={props.settings.section.use_greyscale}
      />
  );
}

SectionFAQ.displayName = 'theme__faq';
export function SectionFAQ({ ...props }) {
  const FAQ = lazyComponents['FAQ'];
  props.settings.section.mobile_breakpoint = mobileBreakpoint;
  return (
      <FAQ settings={props.settings.section} blocks={props.settings.blocks} props={props.settings} />
  );
}

SectionPageHeader.displayName = 'theme__page-header';
export function SectionPageHeader({ ...props }) {
  const PageHeader = lazyComponents['PageHeader'];
  return <PageHeader settings={props.settings} blocks={props.settings.blocks} />;
}

SectionCollectionList.displayName = 'theme__collectionlist';
export function SectionCollectionList({ ...props }) {
  const CollectionList = lazyComponents['CollectionList'];
  return <CollectionList settings={props.settings} />;
}

SectionContactUs.displayName = 'theme__contact-us-form';
export function SectionContactUs({ ...props }) {
  const ContactUsForm = lazyComponents['ContactUsForm'];
  return <ContactUsForm settings={props.settings} />;
}

SectionGallery.displayName = 'theme__section-gallery';
export function SectionGallery({ ...props }) {
  const Gallery = lazyComponents['Gallery'];
  props.settings.section.mobile_breakpoint = mobileBreakpoint;
  return <Gallery settings={props.settings} />;
}

SectionTable.displayName = 'theme__section-table';
export function SectionTable({ ...props }) {
  const Table = lazyComponents['TableSection'];
  props.settings.section.mobile_breakpoint = mobileBreakpoint;
  return <Table settings={props.settings} />;
}

SectionBreadcrumbs.displayName = 'theme__section-breadcrumbs';
export function SectionBreadcrumbs({ ...props }) {
  const Breadcrumbs = lazyComponents['Breadcrumbs'];
  return <Breadcrumbs settings={props.settings} />;
}

SectionQuickLinks.displayName = 'theme__quicklinks';
export function SectionQuickLinks({ ...props }) {
  const QuickLinks = lazyComponents['QuickLinks'];
  return (
      <QuickLinks
          title={props.settings.section.title}
          description={props.settings.section.description}
          quicklinks={props.settings.blocks}
      />
  )
}

SectionFeaturedCollections.displayName = 'theme__featured-collections';
export function SectionFeaturedCollections({ ...props }) {
  const { settings } = props;
  const FeaturedCollections = lazyComponents['FeaturedCollections'];
  return (
      <FeaturedCollections
          section={settings.section}
          blocks={settings.blocks}
          colorSchemas={settings.color_schemas}
      />
  );
}
