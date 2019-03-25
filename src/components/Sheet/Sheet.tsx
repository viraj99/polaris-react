import * as React from 'react';

import {SheetProps, frameContextTypes, FrameContext} from '../Frame';
import {withAppProvider, WithAppProviderProps} from '../AppProvider';

interface Props extends SheetProps {}

export type ComposedProps = Props & WithAppProviderProps;

export class Sheet extends React.PureComponent<ComposedProps, never> {
  static contextTypes = frameContextTypes;
  context: FrameContext;

  private get delegateProps(): Props {
    const {open, onClose, children, desktopChildren} = this.props;

    return {
      open,
      onClose,
      children,
      desktopChildren,
    };
  }

  componentDidMount() {
    const {
      props: {open},
      context: {
        frame: {showSheet},
      },
      delegateProps,
    } = this;

    open === true && showSheet(delegateProps);
  }

  componentDidUpdate({open: oldOpen}: Props) {
    const {
      props: {open},
      context: {
        frame: {showSheet, hideSheet},
      },
      delegateProps,
    } = this;

    if (oldOpen === false && open === true) {
      showSheet(delegateProps);
    } else if (oldOpen === true && open === false) {
      hideSheet(delegateProps);
    }
  }

  componentWillUnmount() {
    const {
      props: {open},
      context: {
        frame: {hideSheet},
      },
      delegateProps,
    } = this;

    open === false && hideSheet(delegateProps);
  }

  render() {
    return null;
  }
}

export default withAppProvider<Props>()(Sheet);
