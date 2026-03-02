const colors = [
  {name: 'Oyster', color: 'oyster'},
  {name: 'Urchin', color: 'urchin'},
  {name: 'Urchin 50 Light', color: 'urchin-50-light'},
  {name: 'Urchin 50 Dark', color: 'urchin-50-dark'},
  {name: 'Black', color: 'black'},
  {name: 'Black 50', color: 'black-50'},
  {name: 'Kelp', color: 'kelp'},
  {name: 'Neon', color: 'neon'},
  {name: 'Dish', color: 'dish'},
  {name: 'Dish Liquid', color: 'dish-liquid'},
  {name: 'Dish Washing Powder', color: 'dish-washing-powder'},
  {name: 'Hand Wash (Mandarin)', color: 'hand-wash-mandarin'},
  {name: 'Hand Wash (Cedarwood)', color: 'hand-wash-cedarwood'},
  {name: 'Hand Wash (Neroli)', color: 'hand-wash-neroli'},
  {name: 'Bath & Shower', color: 'bath-shower'},
  {name: 'Toilet', color: 'toilet'},
  {name: 'Multi-Purpose', color: 'multi-purpose'},
  {name: 'Fabric Soaker & Booster', color: 'fabric-soaker-booster'},
  {name: 'Stain Remover', color: 'stain-remover'},
  {name: 'Pegs', color: 'pegs'},
  {name: 'Laundry Liquid', color: 'laundry-liquid'},
  {name: 'Body Wash (Saffron)', color: 'body-wash-saffron'},
  {name: 'Body Lotion', color: 'body-lotion'},
  {name: 'Conditioner', color: 'conditioner'},
  {name: 'Shampoo', color: 'shampoo'},
  {name: 'Deo (Cucumber)', color: 'deo-cucumber'},
  {name: 'Deo (Vetiver)', color: 'deo-vetiver'}
];

export default function StyleguideColours() {
  return (
    <div className={'styleguide-components'}>
      <div className={'component-header'}>
        <h2>Colours</h2>
      </div>

      <div className={'grid grid-cols-2 lg:grid-cols-11 justify-between items-center gap-4'}>
        {colors.map(color => (
            <div className={`flex flex-col`}>
              <div
                  key={color.name}
                  className={`bg-${color.color} flex text-white h-20 w-20 text-center justify-center items-center p-8 border`}>
              </div>
              <p className={'b3'}>{color.name}</p>
            </div>
        ))}
      </div>
    </div>
  )
}