import { FC } from 'react'

import { HTMLMotionProps, motion } from 'framer-motion'
import styled, { css } from 'styled-components'

interface StyleProps extends HTMLMotionProps<'nav'> {
  letters: string
  background: string
}

interface ListItemProps {
  bottom?: boolean
  pathname: string
  buttonId: string
  selected: string
}

const Style = styled(motion.nav as FC<StyleProps>)`
  position: fixed;
  left: 0;
  top: 0;

  height: 100vh;

  background-color: ${({ background }) => background};

  .icon {
    width: 24px;
    height: 24px;
    margin: 24px;

    svg {
      width: 24px;
      height: 24px;

      fill: ${({ letters }) => letters};
      stroke: ${({ letters }) => letters};
    }
  }

  .label,
  #title {
    display: flex;
    align-items: center;

    width: 138px;
    height: 72px;

    white-space: nowrap;

    color: ${({ letters }) => letters};

    cursor: default;
  }

  #title {
    font-size: 1.8rem;
  }

  #header {
    display: flex;
    align-items: center;

    width: 100%;
    height: 72px;

    border-bottom: solid 2px ${({ letters }) => letters};
  }

  .Hamburger {
    margin: 24px;

    svg {
      height: 17px;
    }
  }

  ul {
    position: relative;
    top: 0;
    left: 0;

    height: 100%;
    width: 100%;

    li,
    button {
      display: flex;
      align-items: center;

      width: 100%;
      height: 72px;
    }
  }
`

export const ListItem = styled.li<ListItemProps>`
  ${({ bottom }) =>
    bottom &&
    css`
      position: absolute;
      bottom: 72px;
      left: 0;
    `}

  ${({ pathname, buttonId, selected }) => {
    return (
      pathname.includes(buttonId) &&
      css`
        ${`#${buttonId}`} {
          background-color: ${selected};
        }
      `
    )
  }}
`

export default Style

Style.displayName = 'Sidebar-Style'
ListItem.displayName = 'ListItem-Style'
