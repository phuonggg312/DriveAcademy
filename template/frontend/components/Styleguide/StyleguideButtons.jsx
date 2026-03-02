function StyleguideButton({ label, icon, style: btnStyle = 'primary', disabled, reverse }) {
  const baseClass = 'px-4 py-2 rounded font-medium transition';
  const styleClass = btnStyle ? `styleguide-btn--${btnStyle}` : 'styleguide-btn--primary';
  return (
    <button
      type="button"
      className={`${baseClass} ${styleClass}`}
      disabled={disabled}
      title={label || (icon ? 'Icon button' : '')}
    >
      {reverse && icon && <span className="mr-2" aria-hidden>🔍</span>}
      {label}
      {!reverse && icon && <span className="ml-2" aria-hidden>🔍</span>}
    </button>
  );
}

export default function StyleguideButtons() {
  const stylguideTestIcon = 'search-bold';

  return (
    <div className={'styleguide-components'}>
      <div className={'component-header'}>
        <h2>Buttons</h2>
      </div>

      <div className="bg-mb-skim-milk">
        <div className={'component-header'}>
          <h3>Light/White</h3>
        </div>

        <div className={'flex flex-col lg:flex-row justify-between mb-4'}>
          <div className={'col-span-2'}>
            <h5>Primary</h5>
          </div>

          <div className={'flex flex-col lg:flex-row gap-y-2 lg:space-x-2 col-span-8'}>
            <StyleguideButton label={'Primary'} />

            <StyleguideButton
              icon={stylguideTestIcon}
              label={'Primary'}
            />

            <StyleguideButton
              icon={stylguideTestIcon}
              label={'Primary'}
              reverse
            />
            <StyleguideButton label={'Primary'} disabled />

            <StyleguideButton icon={stylguideTestIcon} />
          </div>
        </div>

        <div className={'flex flex-col lg:flex-row justify-between mb-4'}>
          <div className={'col-span-2'}>
            <h5>Secondary</h5>
          </div>

          <div className={'flex flex-col lg:flex-row gap-y-2 lg:space-x-2 col-span-8'}>
            <StyleguideButton
              style="secondary"
              label={'Secondary'}
            />

            <StyleguideButton
              style="secondary"
              icon={stylguideTestIcon}
              label={'Secondary'}
            />

            <StyleguideButton
              style="secondary"
              icon={stylguideTestIcon}
              label={'Secondary'}
              reverse
            />

            <StyleguideButton
              style="secondary"
              label={'Secondary'}
              disabled
            />

            <StyleguideButton
              style="secondary"
              icon={stylguideTestIcon}
            />
          </div>
        </div>

        <div className={'flex flex-col lg:flex-row justify-between mb-4'}>
          <div className={'col-span-2'}>
            <h5>Tertiary</h5>
          </div>

          <div className={'flex flex-col lg:flex-row gap-y-2 lg:space-x-2 col-span-8'}>
            <StyleguideButton
              style="tertiary"
              label={'Tertiary'}
            />

            <StyleguideButton
              style="tertiary"
              icon={stylguideTestIcon}
              label={'Tertiary'}
            />

            <StyleguideButton
              style="tertiary"
              icon={stylguideTestIcon}
              label={'Tertiary'}
              reverse
            />

            <StyleguideButton
              style="tertiary"
              label={'Tertiary'}
              disabled
            />

            <StyleguideButton
              style="tertiary"
              icon={stylguideTestIcon}
            />
          </div>
        </div>

        <div className={'flex flex-col lg:flex-row justify-between mb-4'}>
          <div className={'col-span-2'}>
            <h5>Text Button</h5>
          </div>

          <div className={'flex flex-col lg:flex-row gap-y-2 lg:space-x-2 col-span-8'}>
            <StyleguideButton
              style="text"
              label={'Button'}
            />

            <StyleguideButton
              style="text"
              icon={stylguideTestIcon}
              label={'Button'}
            />

            <StyleguideButton
              style="text"
              icon={stylguideTestIcon}
              label={'Button'}
              reverse
            />

            <StyleguideButton
              style="text"
              icon={stylguideTestIcon}
            />
          </div>
        </div>
      </div>

      <div className="p-4"></div>

      <div className="bg-[#25272A] p-[16px] text-white">
        <div className={'component-header'}>
          <h3>Dark</h3>
        </div>

        <div className={'flex flex-col lg:flex-row justify-between mb-4'}>
          <div className={'col-span-2'}>
            <h5>Primary</h5>
          </div>

          <div className={'flex flex-col lg:flex-row gap-y-2 lg:space-x-2 col-span-8'}>
            <StyleguideButton
              style="dark-primary"
              label={'Primary'}
            />

            <StyleguideButton
              style="dark-primary"
              icon={stylguideTestIcon}
              label={'Primary'}
            />

            <StyleguideButton
              style="dark-primary"
              icon={stylguideTestIcon}
              label={'Primary'}
              reverse
            />

            <StyleguideButton
              style="dark-primary"
              label={'Primary'}
              disabled
            />

            <StyleguideButton
              style="dark-primary"
              icon={stylguideTestIcon}
            />
          </div>
        </div>

        <div className={'flex flex-col lg:flex-row justify-between mb-4'}>
          <div className={'col-span-2'}>
            <h5>Secondary</h5>
          </div>

          <div className={'flex flex-col lg:flex-row gap-y-2 lg:space-x-2 col-span-8'}>
            <StyleguideButton
              style="dark-secondary"
              label={'Secondary'}
            />

            <StyleguideButton
              style="dark-secondary"
              icon={stylguideTestIcon}
              label={'Secondary'}
            />

            <StyleguideButton
              style="dark-secondary"
              icon={stylguideTestIcon}
              label={'Secondary'}
              reverse
            />

            <StyleguideButton
              style="dark-secondary"
              label={'Secondary'}
              disabled
            />

            <StyleguideButton
              style="dark-secondary"
              icon={stylguideTestIcon}
            />
          </div>
        </div>

        <div className={'flex flex-col lg:flex-row justify-between mb-4'}>
          <div className={'col-span-2'}>
            <h5>Tertiary</h5>
          </div>

          <div className={'flex flex-col lg:flex-row gap-y-2 lg:space-x-2 col-span-8'}>
            <StyleguideButton
              style="dark-tertiary"
              label={'Tertiary'}
            />

            <StyleguideButton
              style="dark-tertiary"
              icon={stylguideTestIcon}
              label={'Tertiary'}
            />

            <StyleguideButton
              style="dark-tertiary"
              icon={stylguideTestIcon}
              label={'Tertiary'}
              reverse
            />

            <StyleguideButton
              style="dark-tertiary"
              label={'Tertiary'}
              disabled
            />

            <StyleguideButton
              style="dark-tertiary"
              icon={stylguideTestIcon}
            />
          </div>
        </div>

        <div className={'flex flex-col lg:flex-row justify-between mb-4'}>
          <div className={'col-span-2'}>
            <h5>Text Button</h5>
          </div>

          <div className={'flex flex-col lg:flex-row gap-y-2 lg:space-x-2 col-span-8'}>
            <StyleguideButton
              style="dark-text"
              label={'Button'}
            />

            <StyleguideButton
              style="dark-text"
              icon={stylguideTestIcon}
              label={'Button'}
            />

            <StyleguideButton
              style="dark-text"
              icon={stylguideTestIcon}
              label={'Button'}
              reverse
            />

            <StyleguideButton
              style="dark-text"
              icon={stylguideTestIcon}
            />
          </div>
        </div>
      </div>
    </div>
  )
}