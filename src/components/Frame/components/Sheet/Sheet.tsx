import * as React from 'react';

import {CSSTransition} from 'react-transition-group';
import debounce from 'lodash/debounce';
import {classNames} from '@shopify/react-utilities/styles';

import {navigationBarCollapsed} from '../../../../utilities/breakpoints';
import {Key} from '../../../../types';
import {layer, overlay, Duration} from '../../../shared';

import Backdrop from '../../../Backdrop';
import TrapFocus from '../../../TrapFocus';
import Portal from '../../../Portal';
import KeypressListener from '../../../KeypressListener';
import EventListener from '../../../EventListener';

import {SheetProps as Props} from '../../types';

import styles from './Sheet.scss';

export const BOTTOM_CLASS_NAMES = {
  enter: classNames(styles.Bottom, styles.enterBottom),
  enterActive: classNames(styles.Bottom, styles.enterBottomActive),
  exit: classNames(styles.Bottom, styles.exitBottom),
  exitActive: classNames(styles.Bottom, styles.exitBottomActive),
};

export const RIGHT_CLASS_NAMES = {
  enter: classNames(styles.Right, styles.enterRight),
  enterActive: classNames(styles.Right, styles.enterRightActive),
  exit: classNames(styles.Right, styles.exitRight),
  exitActive: classNames(styles.Right, styles.exitRightActive),
};

export interface State {
  mobile: boolean;
}

export default class Sheet extends React.PureComponent<Props, State> {
  state: State = {
    mobile: false,
  };

  private handleResize = debounce(
    () => {
      const {mobile} = this.state;
      if (mobile !== isMobile()) {
        this.setState({mobile: !mobile});
      }
    },
    40,
    {leading: true, trailing: true, maxWait: 40},
  );

  componentDidMount() {
    const {mobile} = this.state;
    if (mobile !== isMobile()) {
      this.setState({mobile: !mobile});
    }
  }

  render() {
    const {children, open, onClose, desktopChildren} = this.props;
    const {mobile} = this.state;

    const sheetClassName = classNames(styles.Sheet, !mobile && styles.desktop);

    const containerClassName = classNames(
      styles.Container,
      !mobile && styles.desktop,
    );

    const reconciledChildren =
      !mobile && desktopChildren ? desktopChildren : children;

    function Container() {
      return (
        <div className={containerClassName} {...layer.props} {...overlay.props}>
          <TrapFocus trapping={open}>
            <div role="dialog" tabIndex={-1} className={sheetClassName}>
              {reconciledChildren}
            </div>
          </TrapFocus>
        </div>
      );
    }

    const sharedTransitionProps = {
      timeout: Duration.Slow,
      in: open,
      mountOnEnter: true,
      unmountOnExit: true,
    };

    const finalTransitionProps = {
      classNames: mobile ? BOTTOM_CLASS_NAMES : RIGHT_CLASS_NAMES,
      ...sharedTransitionProps,
    };

    const backdropMarkup = open ? (
      <Backdrop transparent onClick={onClose} />
    ) : null;

    return (
      <Portal idPrefix="sheet">
        <CSSTransition {...finalTransitionProps}>
          <Container />
        </CSSTransition>
        <KeypressListener keyCode={Key.Escape} handler={onClose} />
        <EventListener event="resize" handler={this.handleResize} />
        {backdropMarkup}
      </Portal>
    );
  }
}

function isMobile(): boolean {
  return navigationBarCollapsed().matches;
}
