export default {
  name: 'section',
  component(settings, colorSchema = '', type = '') {
    return {
      classes: '',

      init() {
        if (colorSchema) {
          const colorSchemaClass = `color-${colorSchema}`;
          this._appendClass(colorSchemaClass);
        }

        const renderType = settings?.render_type;
        let renderTypeClass = '';
        if (renderType) {
          if (renderType === 'mobile-only') {
            renderTypeClass = 'block lg:hidden';
          } else if (renderType === 'desktop-only') {
            renderTypeClass = 'hidden lg:block';
          }
        }
        this._appendClass(renderTypeClass);

        const settingKeys = Object.keys(settings);
        let paddingKeys = settingKeys.filter((key) => key.includes('padding_'));
        let marginKeys = settingKeys.filter((key) => key.includes('margin_'));

        if (type) {
          paddingKeys = paddingKeys.filter((key) => key.startsWith(type));
          marginKeys = marginKeys.filter((key) => key.startsWith(type));
        } else {
          paddingKeys = paddingKeys.filter((key) => key.startsWith('padding'));
          marginKeys = marginKeys.filter((key) => key.startsWith('margin'));
        }

        if (settings["mobile_min_height"] > 0) {
            this._appendClass(`min-h-[${settings["mobile_min_height"]}px]`);
        }
        if (settings["mobile_min_height"] > 0) {
            this._appendClass(`lg:min-h-[${settings["desktop_min_height"]}px]`);
        }
          if (settings["show_section_borders"]) {
              this._appendClass(`section-border`);
          }
          if (settings["text_block_max_width_mobile"] > 0) {
              this._appendClass(`max-w-[${settings["text_block_max_width_mobile"]}px]`);
          }
          if (settings["text_block_max_width"] > 0) {
              this._appendClass(`lg:max-w-[${settings["text_block_max_width"]}px]`);
          }

        for (const key of paddingKeys) {
          if (settings[key])
            this._appendClass(this._getPaddingClass(settings[key], this._getScreenType(key), this._getDirection(key)));
        }

        for (const key of marginKeys) {
          if (settings[key])
            this._appendClass(this._getMarginClass(settings[key], this._getScreenType(key), this._getDirection(key)));
        }
      },

      _appendClass(_class) {
        this.classes += ` ${_class}`;
      },

      _getScreenType(key) {
        let type = '';
        const screenTypes = {
          _desktop: 'dskt',
          _mobile: 'mble'
        };

        for (const screenTypeKey in screenTypes) {
          if (key.includes(screenTypeKey)) {
            type = screenTypes[screenTypeKey];

            break;
          }
        }

        return type;
      },

      _getDirection(key) {
        let dir = '';
        const directions = {
          _top: 'top',
          _bottom: 'bottom',
          _left_right: 'x',
          _left: 'left',
          _right: 'right',
          _y: 'y'
        };

        for (const dirKey in directions) {
          if (key.includes(dirKey)) {
            dir = directions[dirKey];

            break;
          }
        }

        return dir;
      },

      _getPaddingClass(val, screen, type) {
        let breakpoint = '';
        let paddingClass = '';

        switch (screen) {
          case 'dskt':
            breakpoint = 'lg:';
            break;
          case 'mble':
            breakpoint = '';
            break;
          default:
            breakpoint = '';
            break;
        }

        switch (type) {
          case 'top':
            paddingClass = breakpoint + `pt-[${val}px]`;
            break;
          case 'bottom':
            paddingClass = breakpoint + `pb-[${val}px]`;
            break;
          case 'left':
            paddingClass = breakpoint + `pl-[${val}px]`;
            break;
          case 'right':
            paddingClass = breakpoint + `pr-[${val}px]`;
            break;
          case 'y':
            paddingClass = breakpoint + `pt-[${val}px]` + ' ' + breakpoint + `pb-[${val}px]`;
            break;
          case 'x':
            paddingClass = breakpoint + `px-[${val}px]`;
            break;
          default:
            paddingClass = breakpoint + `pl-[${val}px]` + ' ' + breakpoint + `pr-[${val}px]`;
            break;
        }

        return paddingClass;
      },

      _getMarginClass(val, screen, type) {
        let breakpoint = '';
        let paddingClass = '';

        switch (screen) {
          case 'dskt':
            breakpoint = 'lg:';
            break;
          case 'mble':
            breakpoint = 'max-lg:';
            break;
          default:
            breakpoint = '';
            break;
        }

        switch (type) {
          case 'top':
            paddingClass = breakpoint + `mt-[${val}px]`;
            break;
          case 'bottom':
            paddingClass = breakpoint + `mb-[${val}px]`;
            break;
          case 'left':
            paddingClass = breakpoint + `ml-[${val}px]`;
            break;
          case 'right':
            paddingClass = breakpoint + `mr-[${val}px]`;
            break;
          case 'y':
            paddingClass = breakpoint + `mt-[${val}px]` + ' ' + breakpoint + `mb-[${val}px]`;
            break;
          default:
            paddingClass = breakpoint + `ml-[${val}px]` + ' ' + breakpoint + `mr-[${val}px]`;
            break;
        }

        return paddingClass;
      }
    };
  }
};
