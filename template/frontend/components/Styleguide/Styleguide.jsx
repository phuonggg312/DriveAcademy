import React from "react";

import StyleguideColours from './StyleguideColours';
import StyleguideTypography from './StyleguideTypography';
import StyleguideButtons from './StyleguideButtons';
import StyleguideFormFields from './StyleguideFormFields';

StyleguidePage.displayName = 'theme__styleguide';
export function StyleguidePage({ ...props }) {
  return (
    <div className={'p-8'} style={{ background: '#F5F5F5' }}>
      <div className={'text-center py-4'}>
        <p>To view the latest Arctheme components, please check the link below</p>
        <a
          href="https://65bc451225e432e3bc38ad47-egwfldqysf.chromatic.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Arctheme Components
        </a>
      </div>

      <StyleguideColours />
      <StyleguideTypography />
      <StyleguideButtons />
      <StyleguideFormFields />
    </div>
  )
}
