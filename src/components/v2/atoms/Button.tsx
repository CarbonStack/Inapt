import React, {
  MouseEventHandler,
  FocusEventHandler,
  DragEventHandler,
  PropsWithChildren,
} from 'react'
import cc from 'classcat'
import styled from '../../../lib/v2/styled'
import Icon, { IconSize } from './Icon'

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  iconPath?: string
  iconSize?: IconSize
  type?: 'button' | 'submit'
  className?: string
  disabled?: boolean
  tabIndex?: number
  id?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  onMouseUp?: MouseEventHandler<HTMLButtonElement>
  onMouseDown?: MouseEventHandler<HTMLButtonElement>
  onMouseMove?: MouseEventHandler<HTMLButtonElement>
  onMouseOver?: MouseEventHandler<HTMLButtonElement>
  onMouseOut?: MouseEventHandler<HTMLButtonElement>
  onMouseEnter?: MouseEventHandler<HTMLButtonElement>
  onMouseLeave?: MouseEventHandler<HTMLButtonElement>
  onDoubleClick?: MouseEventHandler<HTMLButtonElement>
  onContextMenu?: MouseEventHandler<HTMLButtonElement>
  onFocus?: FocusEventHandler<HTMLButtonElement>
  onDrag?: DragEventHandler<HTMLButtonElement>
  onDragStart?: DragEventHandler<HTMLButtonElement>
  onDragEnd?: DragEventHandler<HTMLButtonElement>
  onDrop?: DragEventHandler<HTMLButtonElement>
}

const Button = React.forwardRef<
  HTMLButtonElement,
  PropsWithChildren<ButtonProps>
>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      type = 'button',
      iconPath,
      iconSize,
      disabled,
      className,
      tabIndex,
      id,
      onClick,
      onMouseUp,
      onMouseDown,
      onMouseMove,
      onMouseOver,
      onMouseOut,
      onMouseEnter,
      onMouseLeave,
      onDoubleClick,
      onContextMenu,
      onFocus,
      onDrag,
      onDragStart,
      onDragEnd,
      onDrop,
    },
    ref
  ) => {
    return (
      <StyledButton
        type={type}
        className={cc([
          className,
          `button__variant--${variant}`,
          size && `button__size--${size}`,
          disabled && `button__state--disabled`,
        ])}
        id={id}
        disabled={disabled}
        tabIndex={tabIndex}
        onClick={onClick}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
        onFocus={onFocus}
        onDrag={onDrag}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDrop={onDrop}
        ref={ref}
      >
        {iconPath != null && (
          <Icon className='button__icon' size={iconSize} path={iconPath} />
        )}
        {children != null && <div className='button__label'>{children}</div>}
      </StyledButton>
    )
  }
)

export default Button

const StyledButton = styled.div`
  padding: 0 10px;
  border-radius: 2px;
  font-size: ${({ theme }) => theme.sizes.fonts.sm}px;
  height: 32px;
  outline: none;
  border-radius: 4px;
  border-color: transparent;
  border-width: 1px;
  border-style: solid;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: Arial;
  box-sizing: border-box;
  transition: 200ms background-color;

  & + * {
    margin-left: 5px;
  }

  & > .button__icon + .button__label {
    margin-left: 4px;
  }

  &.button__state--disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &.button__variant--primary {
    background-color: ${({ theme }) => theme.colors.variants.primary.base};
    color: ${({ theme }) => theme.colors.variants.primary.text};

    &:not(.button__state--disabled) {
      &:hover,
      &:active,
      &:focus,
      &.active {
        background-color: ${({ theme }) =>
          theme.colors.variants.primary.darker};
      }
    }
  }

  &.button__variant--secondary {
    background-color: ${({ theme }) => theme.colors.variants.secondary.base};
    color: ${({ theme }) => theme.colors.variants.secondary.text};

    &:not(.button__state--disabled) {
      &:hover,
      &:active,
      &:focus,
      &.active {
        background-color: ${({ theme }) =>
          theme.colors.variants.secondary.darker};
      }
    }
  }

  &.button__variant--danger {
    background-color: ${({ theme }) => theme.colors.variants.danger.base};
    color: ${({ theme }) => theme.colors.variants.danger.text};
    &:not(.button__state--disabled) {
      &:hover,
      &:active,
      &:focus,
      &.active {
        background-color: ${({ theme }) => theme.colors.variants.danger.darker};
      }
    }
  }

  &.button__variant--icon {
    background: none;
    border: 1px solid transparent;
    color: ${({ theme }) => theme.colors.text.subtle};
    padding: 0 3px !important;

    &:not(.button__state--disabled) {
      &:hover,
      &:active,
      &:focus,
      &.active {
        color: ${({ theme }) => theme.colors.text.main};
      }
    }
  }

  &.button__size--lg {
    height: 40px;
    padding: 0 14px;
  }

  &.button__size--sm {
    height: 24px;
    padding: 0 6px;
  }

  &:focus {
    box-shadow: 0 0 0 0.2rem ${({ theme }) => theme.colors.focus};
  }
`
