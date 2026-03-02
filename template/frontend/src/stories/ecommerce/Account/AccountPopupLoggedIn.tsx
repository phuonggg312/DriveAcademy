import * as React from "react";

export function AccountPopupLoggedIn({ settings }) {
  // Assuming we have a test variable for customer name
  const customerName = settings.settings.customer_name;
  const customerInitials = customerName.trim()[0];

  const links = settings.settings.block?.links;

  return (
    <div
      className="account-popup-details absolute right-0 lg:w-[320px]"
      x-data="toggledisplay"
      x-init="$nextTick(() => { init('header-account') })"
    >
      <div
        className="bg-[#F5F5F5] z-50 shadow-md rounded-b-[10px]"
        x-show="is_open"
      >
        <div className={"py-[24px]"}>
          <div className="flex items-center px-[8px] gap-x-[8px] py-[4px]">
            <div className="flex items-center justify-center w-[32px] h-[32px] rounded-full bg-[#99FF99] text-black font-semibold bf uppercase">
              {customerInitials}
            </div>
            <span className={`bfb`}>My Account</span>
          </div>

          <div className={`px-[40px] flex flex-col gap-y-[18px] mt-[8px]`}>
            {links &&
              links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  className="account-popup-details__link flex items-center hover:no-underline"
                >
                  <span className="account-popup-details__link__title">{link.title}</span>
                  <span className="account-popup-details__link__icon ml-2 icon-ur-arrow text-[19px]"></span>
                </a>
              ))}

            <a
              href={"/account/logout"}
              className={`logout-button button button-tertiary flex text-center items-center hover:no-underline py-2 w-full mt-[18px]`}
            >
              <div className={`flex`}>
                Log out
                <span className="icon-up-arrow-alt ml-auto text-2xl"></span>
              </div>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AccountPopupLoggedIn;
