import React, { useSyncExternalStore } from "react";
import { modal } from '../js/alpine/components/utility/modal/modal';
import { lazyComponents } from "@src/utils/LazyComponent";

TagListComponent.displayName = 'theme__block-tags';
export function TagListComponent({ ...props }) {
    const TagList = lazyComponents['TagList'];
    return (
        <TagList tags={props.settings.tags} />
    );
}

SocialLinksComponent.displayName = 'theme__social-links';
export function SocialLinksComponent({ ...props }) {
    const SocialLinks = lazyComponents['SocialLinks'];
    const social_links = props.settings.shop.social_links;
    const section_settings = props.settings.settings;

    const links = Object.keys(social_links).map(key => ({
        url: social_links[key],
        name: key
    }));

    return (
        <SocialLinks type={'default'} links={links} settings={section_settings} />
    );
}

ModalComponent.displayName = 'theme__block-modal';
export function ModalComponent({ ...props }) {
    const Modal = lazyComponents['Modal'];

    function closeModal() {
        modal.component().hide();
    }

    function getIsOpen() {
        return useSyncExternalStore(modal.component().subscribe, modal.component().getIsOpen);
    }

    return (
        <Modal modal_id={props.settings.id} isOpen={getIsOpen()} title={props.settings.title} description={props.settings.content} position={'right'} onClose={closeModal} />
    );
}

LogoComponent.displayName = 'theme__block-logo';
export function LogoComponent({ ...props }) {
    const Logo = lazyComponents['Logo'];
    return (
        <Logo settings={props.settings} />
    );
}

TitleComponent.displayName = 'theme__block-title';
export function TitleComponent({ ...props }) {
    const Title = lazyComponents['Title'];
    return (
        <Title settings={props.settings} />
    );
}

DescriptionComponent.displayName = 'theme__block-description';
export function DescriptionComponent({ ...props }) {
    const Description = lazyComponents['Description'];
    return (
        <Description settings={props.settings} />
    );
}

ButtonComponent.displayName = 'theme__block-button';
export function ButtonComponent({ ...props }) {
    const Button = lazyComponents['Button'];
    return (
        <Button settings={props.settings} />
    );
}
