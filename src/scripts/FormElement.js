import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { registerStyle } from './util';
import Text from './Text';
import Icon from './Icon';


export default class FormElement extends React.Component {

  constructor() {
    super();
    this.registerDropdownStyle();
  }

  // new function that can be easily overrided
  registerDropdownStyle() {
    /* eslint-disable max-len */
    registerStyle('dropdown', [
      [
        '.react-slds-dropdown-control-wrapper',
        '{ height: 0; }',
      ],
      [
        '.slds-has-error .react-slds-dropdown-control-wrapper',
        '{ height: auto; }',
      ],
      [
        '.react-slds-dropdown-control-wrapper > .slds-form-element__control',
        '{ position: relative; padding-top: 0.1px; margin-top: -0.1px }',
      ],
      [
        '.react-slds-dropdown-form-element',
        '{ position: static; }',
      ],
      [
        '.slds-form--horizontal .react-slds-dropdown-control-wrapper .slds-dropdown',
        '{ top: -1em; }',
      ],
      [
        '.slds-form--horizontal .react-slds-dropdown-control-wrapper .slds-lookup__menu',
        '{ top: -1em; }',
      ],
      [
        '.slds-form--horizontal .slds-has-error .react-slds-dropdown-control-wrapper .slds-dropdown',
        '{ top: 0; }',
      ],
      [
        '.slds-modal .react-slds-dropdown-control-wrapper > .slds-form-element__control',
        '{ position: absolute; }',
      ],
      [
        '.slds-modal .react-slds-dropdown-control-wrapper > .slds-form-element__control > .slds-lookup__menu',
        '{ min-width: 20rem; }',
      ],
      [
        '.slds-input-has-icon--left-right .slds-input__icon--right',
        '{ left: auto; }',
      ],
    ]);
  }

  renderFormElement(props) {
    const { className, error, totalCols, cols = 1, formElementRef, children } = props;
    const formElementClassNames = classnames(
      'slds-form-element',
      {
        'slds-has-error': error,
        [`slds-size--${cols}-of-${totalCols}`]: typeof totalCols === 'number',
      },
      className
    );
    return (
      <div
        ref={ formElementRef }
        key='form-element'
        className={ formElementClassNames }
      >
        { children }
      </div>
    );
  }

  renderLabel() {
    const { id, label, required } = this.props;
    return (
      label ?
        <label
          key='form-element-label'
          className='slds-form-element__label'
          htmlFor={ id }
        >
          { label }
          {
            required ?
              <abbr className='slds-required'>*</abbr> :
              undefined
          }
        </label> :
        undefined
    );
  }

  renderControl(props) {
    const { children, iconLeft, iconRight, readOnly, addonLeft, addonRight } = props;
    const formElementControlClassNames = classnames(
      'slds-form-element__control',
      { 'slds-has-divider--bottom': readOnly },
      { 'slds-input-has-icon': iconLeft || iconRight },
      { 'slds-input-has-icon--left-right': iconLeft && iconRight },
      { 'slds-input-has-icon--left': iconLeft },
      { 'slds-input-has-icon--right': iconRight },
      { 'slds-input-has-fixed-addon': addonLeft || addonRight },
    );
    return (
      <div key='form-element-control' className={formElementControlClassNames}>
        {addonLeft ?
          <Text
            tag='span'
            className={'slds-form-element__addon'}
            category='body'
            type='regular'
          >
            {addonLeft}
          </Text>
          : null
        }
        { iconLeft ?
          React.isValidElement(iconLeft) ?
            iconLeft :
              <Icon
                icon={iconLeft.icon}
                className='slds-input__icon slds-input__icon--left slds-icon-text-default'
              />
          : null
        }
        { children }
        { iconRight ?
          React.isValidElement(iconRight) ?
            iconRight :
              <Icon
                icon={iconRight.icon}
                className='slds-input__icon slds-input__icon--right slds-icon-text-default'
              />
          : null
        }
        {addonRight ?
          <Text
            tag='span'
            className={'slds-form-element__addon'}
            category='body'
            type='regular'
          >
            {addonLeft}
          </Text>
          : null
        }
      </div>
    );
  }

  renderError(error) {
    const errorMessage =
      error ?
        (typeof error === 'string' ? error :
          typeof error === 'object' ? error.message :
            undefined) :
        undefined;
    return errorMessage ?
      <span key='slds-form-error' className='slds-form-element__help'>{ errorMessage }</span> :
        undefined;
  }

  render() {
    const {
      dropdown, className, totalCols, cols, error,
      children, style, iconLeft, iconRight, readOnly, addonLeft, addonRight, ...props
    } = this.props;
    const labelElem = this.renderLabel();
    if (dropdown) {
      const controlElem = this.renderControl({ children });
      const formElemChildren = [labelElem, controlElem];
      const innerFormElem = this.renderFormElement({ ...props, children: formElemChildren });
      const outerControlElem = this.renderControl({ error, children: dropdown });
      const outerFormElemChildren = [
        innerFormElem,
        <div key='outer-form-element' className='react-slds-dropdown-control-wrapper' style={style}>{ outerControlElem }</div>,
      ];
      const outerFormClassName = classnames('react-slds-dropdown-form-element', className);
      return this.renderFormElement({
        ...props,
        error,
        totalCols,
        cols,
        className: outerFormClassName,
        children: outerFormElemChildren,
      });
    }
    const controlElem =
      this.renderControl({ children, error, iconLeft, iconRight, readOnly, addonLeft, addonRight });
    const errorElem = this.renderError(error);
    const formElemChildren = [labelElem, controlElem, errorElem];
    return this.renderFormElement({
      ...props,
      className,
      error,
      totalCols,
      cols,
      children: formElemChildren,
    });
  }

}

FormElement.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.shape({
      message: PropTypes.string,
    }),
  ]),
  cols: PropTypes.number,
  totalCols: PropTypes.number,
  dropdown: PropTypes.element,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  formElementRef: PropTypes.func,
  /* eslint-disable react/forbid-prop-types */
  style: PropTypes.object,
  iconLeft: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.object,
  ]),
  iconRight: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.object,
  ]),
  addonLeft: PropTypes.string,
  addonRight: PropTypes.string,
  iconAlign: PropTypes.string,
  readOnly: PropTypes.bool,
};

FormElement.isFormElement = true;
