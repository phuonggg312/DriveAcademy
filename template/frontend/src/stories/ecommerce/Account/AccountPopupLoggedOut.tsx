import * as React from "react";

export function AccountPopupLoggedOut ({ settings }) {
  const { block } = settings.settings;

  return (
    <div
      className="account-popup-details absolute right-0 w-full lg:w-[233px]"
      x-data="toggledisplay"
      x-init="$nextTick(() => { init('header-account') })"
    >
      <div
        className="bg-[#F5F5F5] z-50 px-[16px] py-[24px] shadow-md rounded-b-[10px]"
        x-show="is_open"
      >
        <a
          href="/account/login"
          className="flex items-center hover:no-underline"
        >
          <div className="button button-tertiary w-full px-[24px] py-[12px] font-[14px] font-normal" style={{ height:"32px"}}>
            {block?.settings?.cta_button_signin_text}
          </div>

          <span className="icon-log-in ml-auto text-2xl"></span>
        </a>


          <span className="b3 flex items-center gap-[6px] hover:no-underline mt-[16px]">
            Don’t have an account?
             <a href="/account/register">
               {block?.settings?.cta_button_signup_text}
             </a>
          </span>

        <span className="icon-up-arrow-alt ml-auto"></span>

      </div>
    </div>
)
}

export default AccountPopupLoggedOut;
