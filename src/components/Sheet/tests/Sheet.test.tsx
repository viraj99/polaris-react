import * as React from 'react';
import * as PropTypes from 'prop-types';
import {mountWithAppProvider} from 'test-utilities';
import {noop} from '../../../utilities/other';
import Sheet from '../Sheet';

describe('<Sheet />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const openProps = {open: true, onClose: noop, children: <p>child content</p>};
  const closedProps = {
    open: false,
    onClose: noop,
    children: <p>child content</p>,
  };

  it('opens the sheet when it is open on mount', () => {
    const {frame} = mountWithContext(<Sheet {...openProps} />);
    expect(frame.hideSheet).not.toHaveBeenCalled();
    expect(frame.showSheet).toHaveBeenCalledWith(openProps);
  });

  it('closes the sheet when it is not open on unmount', () => {
    const {sheet, frame} = mountWithContext(<Sheet {...closedProps} />);

    expect(frame.hideSheet).not.toHaveBeenCalled();
    expect(frame.showSheet).not.toHaveBeenCalled();

    sheet.unmount();

    expect(frame.hideSheet).toHaveBeenCalledWith(closedProps);
  });

  it('opens a closed sheet when open updates to true', () => {
    const {sheet, frame} = mountWithContext(<Sheet {...closedProps} />);
    sheet.setProps(openProps);
    expect(frame.showSheet).toHaveBeenCalledWith(openProps);
  });

  it('closes an open sheet when open updates to false', () => {
    const {sheet, frame} = mountWithContext(<Sheet {...openProps} />);
    sheet.setProps(closedProps);
    expect(frame.hideSheet).toHaveBeenCalledWith(closedProps);
  });
});

function mountWithContext(element: React.ReactElement<any>) {
  const frame = {showSheet: jest.fn(), hideSheet: jest.fn()};
  const sheet = mountWithAppProvider(element, {
    context: {frame},
    childContextTypes: {frame: PropTypes.any},
  });

  return {sheet, frame};
}
