export default function StyleguideTypography() {
  return (
    <div className={'styleguide-components'}>
      <div className={'typography'}>
        <div className={'component-header'}>
          <h2>Typography</h2>
        </div>

        <div className={'component d1'}>
          Display Text
        </div>

        <div className={'component'}>
          <h1>Heading 1</h1>
        </div>

        <div className={'component'}>
          <h2>Heading 2</h2>
        </div>

        <div className={'component'}>
          <h3>Heading 3</h3>
        </div>

        <div className={'component'}>
          <h4>Heading 4</h4>
        </div>

        <div className={'component'}>
          <h5>Heading 5</h5>
        </div>

        <div className={'component'}>
          <h6>Heading 6</h6>
        </div>

        <div className={'component'}>
          <a href="#">Link Text</a>
        </div>

        <div className={'component'}>
          <p>Paragraph Text: Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in repre</p>
          <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>

        <div className={'component'}>
          <ul className="list">
            <li>List item</li>
            <li>List item</li>
            <li>List item</li>
          </ul>
        </div>

        <div className={'component'}>
          <small>Small</small>
        </div>

        <div className={'component'}>
          <s>Strikethrough</s>
        </div>

        <div className={'component'}>
          <em>Italics</em>
        </div>

        <div className={'component'}>
          <div>
            <strong>Strong</strong>
          </div>
          <div>
            <b>Bold</b>
          </div>
        </div>
      </div>
    </div>
  )
}