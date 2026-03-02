import React from 'react';
import { lazyComponents } from "@src/utils/LazyComponent";

StoreLocatorPage.displayName = 'theme__storelocator';
export function StoreLocatorPage({ ...props }) {
    const StoreLocator = lazyComponents['StoreLocator'];

    const stores = [
        {
            name: 'Blacktown',
            address: 'Shop 1016, Level 1 Westpoint Shopping Centre, 17 Patrick Street',
            contact: '(02) 9621 8555',
            openingHours: [
                'Monday: 9 am - 5.30 pm',
                'Tuesday: 9 am - 5.30 pm',
                'Wednesday: 9 am - 5.30 pm',
                'Thursday: 9 am - 5.30 pm',
                'Friday: 9 am - 5.30 pm',
                'Saturday: 9 am - 5.30 pm',
                'Sunday: 9 am - 4.00 pm',
            ],
            coordinates: {
                lat: -33.7695,
                lng: 150.9071
            }
        }
    ];

    return (
        <StoreLocator stores={props.settings.blocks} maps_api_key={props.settings.section.maps_api_key} />
    );
}
