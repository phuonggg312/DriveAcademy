import React from "react";

const AccountInfo = () => {
    return (
        <div
            className="account-page__info w-full lg:basis-[880px] flex flex-col justify-center !bg-no-repeat !bg-cover lg:p-[135px]"
            style={{ background: "url('//maggiebeer-dev.myshopify.com/cdn/shop/files/banner2.jpg?v=1720668290')" }}
        >
            <div className="account-page__info-container bg-[#FFFEF5] px-[32px] py-[36px] b3 flex flex-col justify-center">
                <h2 className="account-page__info-title mb-4">Join Maggie's Food Club</h2>
                <p className="account-page__info-description mb-6">
                    I cook from the heart and wholeheartedly encourage improvisation in the kitchen,
                    so my main priority for anyone jumping onto this website is to provide recipes that make you want to get into the kitchen!
                    But above and beyond that, I will be sharing exclusive recipes just for you, along with special offers, your monthly newsletter – and to raise an especially loud cheer amongst the food club ranks – free postage for all member’s online orders over $80.
                </p>
                <div className="account-page__info-list space-y-4">
                    <InfoItem
                        imageUrl="https://cdn.shopify.com/s/files/1/0659/5107/2425/files/icon-book.png?v=1725939258"
                        title="Weekly Seasonal Recipes"
                        description="Inspire or reignite your culinary journey with delicious recipes sent to your inbox every week"
                    />
                    <InfoItem
                        imageUrl="https://cdn.shopify.com/s/files/1/0659/5107/2425/files/sale_icon_46f33c52-94e8-47d8-bd79-4d24bdca6024.png?v=1725939662"
                        title="10% Off Your First Order"
                        description="Receive 10% off your first online order, excluding cellar items & eGift Cards"
                    />
                    <InfoItem
                        imageUrl="https://cdn.shopify.com/s/files/1/0659/5107/2425/files/export_icon_d38965c5-bb64-4a16-922d-ee1474c9855e.png?v=1725939662"
                        title="Free Shipping Over $80"
                        description="Spend $80 or more & receive free standard shipping all year round"
                    />
                    <InfoItem
                        imageUrl="https://cdn.shopify.com/s/files/1/0659/5107/2425/files/exclusive_icon_0d2e3a6c-423e-4f3e-a4c8-191d72845d78.png?v=1725939662"
                        title="Unlock Exclusive Deals"
                        description="Enjoy exclusive competitions, offers and promotions"
                    />
                    <InfoItem
                        imageUrl="https://cdn.shopify.com/s/files/1/0659/5107/2425/files/newsletteroffer_icon_e7be40d3-76fd-492d-9882-f81b4e7644da.png?v=1725939662"
                        title="Newsletters from Maggie"
                        description="Personally written by Maggie herself, recapping her current adventures and happenings in her life."
                    />
                    <InfoItem
                        imageUrl="https://cdn.shopify.com/s/files/1/0659/5107/2425/files/membership_icon_6192fe9e-0839-4589-9020-f8e4a75c575b.png?v=1725939662"
                        title="Free Membership for All"
                        description="Join the Maggie Beer Food Club free of charge!"
                    />
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({ imageUrl, title, description }) => {
    return (
        <div className="flex flex-row space-x-[24px]">
            <div className="w-[40px] h-[40px]">
                <img src={imageUrl} alt={title} width="40px" height="40px" />
            </div>
            <div className="flex flex-col w-full">
                <div className="account-page__info-list-title">{title}</div>
                <div className="account-page__info-list-description">{description}</div>
            </div>
        </div>
    );
};

export default AccountInfo;

