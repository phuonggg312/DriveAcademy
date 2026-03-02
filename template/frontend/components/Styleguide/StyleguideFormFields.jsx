import {Headings} from "@arctheme-components/elements/Headings/Headings";
import {QuantityField} from "@arctheme-components/elements/Quantity/Quantity";
import {TextField} from "@arctheme-components/elements/TextField/TextField";
import {TextArea} from "@arctheme-components/elements/TextArea/TextArea";
import {SelectField} from "@arctheme-components/elements/Select/SelectField";
import {Checkbox} from "@arctheme-components/elements/Checkbox/Checkbox";

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

export default function StyleguideFormFields() {
    const stylguideTestIcon = 'search-bold';

  return (
    <div className={'styleguide-components'}>

      <div className={'component-header'}>
        <Headings text={'Inputs & Controls'} type={'h2'} />
      </div>

      <div className={'flex items-center gap-8'}>
        <div className={'min-w-[150px] shrink-0'}>
          <h5>Quantity Field</h5>
        </div>

        <div className={'component'}>
          <QuantityField />
        </div>
      </div>

      <div className={'flex items-center gap-8'}>
        <div className={'min-w-[150px] shrink-0'}>
          <h5>Default</h5>
        </div>

        <div className={'component grow'}>
          <TextField placeholder="Placeholder (optional)" />
        </div>
      </div>

      <div className={'flex items-center gap-8'}>
        <div className={'min-w-[150px] shrink-0'}>
          <h5>With Icon</h5>
        </div>

        <div className={'component grow'}>
          <TextField
            placeholder="Placeholder (optional)"
            icon={`${stylguideTestIcon}`}
          />
        </div>
      </div>

      <div className={'flex items-center gap-8'}>
        <div className={'min-w-[150px] shrink-0'}>
          <h5>Disabled</h5>
        </div>

        <div className={'component grow'}>
          <TextField
            placeholder="Placeholder (optional)"
            disabled
          />
        </div>
      </div>

      <div className={'flex items-center gap-8'}>
        <div className={'min-w-[150px] shrink-0'}>
          <h5>Error</h5>
        </div>

        <div className={'component grow'}>
          <TextField
            placeholder="Placeholder (optional)"
            errorMessage="Error description"
            hasError
          />
        </div>
      </div>

      <div className={'flex items-center gap-8'}>
        <div className={'min-w-[150px] shrink-0'}>
          <h5>Text Area</h5>
        </div>

        <div className={'component grow'}>
          <TextArea placeholder="Type your message..." />
        </div>
      </div>

      <div className={'flex items-center gap-8'}>
        <div className={'min-w-[150px] shrink-0'}>
          <h5>Dropdown</h5>
        </div>

        <div className={'component grow'}>
          <SelectField
            options={options}
            placeholder="Select one..."
          />
        </div>
      </div>

      <div className={'flex items-center gap-8'}>
        <div className={'min-w-[150px] shrink-0'}>
          <h5>Checkbox</h5>
        </div>

        <div className={'component'}>
          <Checkbox label={'Checkbox'} />
        </div>
      </div>
    </div>
  )
}