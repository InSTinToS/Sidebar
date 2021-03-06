import React, { useCallback, useEffect } from 'react'
import { ListItem, SidebarNav } from './styles'

import getAllIndexes from 'utils/getAllIndexes'

import { SidebarActions } from 'store/sidebar'
import { StoreState } from 'store'

import Hamburger from 'components/Hamburger'

import { AnimatePresence, motion, Variants } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { Route, useHistory, useLocation } from 'react-router-dom'

export interface RouteProps {
  icon?: () => JSX.Element
  component?: () => JSX.Element
  label: string
  isBigInOther?: boolean
  bottom?: boolean
  exact?: boolean
  noContentMove?: boolean
  paths: string[]
}

interface SidebarProps {
  routes: RouteProps[]
  selected: string
  letters: string
  background: string
  title?: string
  samePage?: boolean
  closedWidth?: number
  width?: number
  scrollBarSize?: number
}

const Sidebar: React.FC<SidebarProps> = ({
  routes,
  title = '',
  samePage = false,
  selected,
  letters,
  background,
  closedWidth = 72,
  width = 210,
  scrollBarSize = 15,
}) => {
  const open = useSelector<StoreState, boolean>(({ sidebar }) => sidebar.open)
  const dispatch = useDispatch()
  const history = useHistory()
  const { pathname } = useLocation()
  const onToggle = () => dispatch(SidebarActions.toggleSidebar(!open))

  const contentSize = (): string => {
    const isBig = routes.map(({ isBigInOther }) => isBigInOther === true)
    const indexesOfBigs = getAllIndexes<boolean>(isBig, true)
    const pathOfBigs = []

    for (let i = 0; i < indexesOfBigs.length; i += 1)
      pathOfBigs.push(routes[indexesOfBigs[i]].paths[0])

    if (samePage || pathOfBigs.find(el => el === pathname))
      return open
        ? `calc(100vw - ${width + scrollBarSize}px)`
        : `calc(100vw - ${closedWidth + scrollBarSize}px)`

    return open ? `calc(100vw - ${width}px)` : `calc(100vw - ${closedWidth}px)`
  }

  const moveCorrectly = useCallback(
    index => {
      const heightOfRoutes = routes.map(({ paths }) => {
        const id = paths[0].replaceAll('/', '--')
        return document.getElementById(id)?.offsetHeight
      })

      const move =
        heightOfRoutes !== undefined &&
        heightOfRoutes.reduce(
          (prev, curr, i) =>
            i < index && prev !== undefined && curr !== undefined ? prev + curr : prev,
          0
        )

      window.scrollTo(0, move as number)
    },
    [routes]
  )

  const motionContent: Variants = {
    open: {
      x: width,
      width: contentSize(),
      transition: {
        type: 'tween',
        duration: 0.31,
      },
    },
    closed: {
      x: closedWidth,
      width: contentSize(),
      transition: {
        type: 'tween',
        duration: 0.19,
      },
    },
  }

  const motionBackground: Variants = {
    open: {
      width,
      transition: {
        type: 'tween',
        duration: 0.3,
      },
    },
    closed: {
      width: closedWidth,
      transition: {
        type: 'tween',
        duration: 0.2,
      },
    },
  }

  const motionTitle: Variants = {
    initial: {
      opacity: 0,
      x: -24,
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'tween',
        duration: 0.4,
      },
    },
    closed: {
      opacity: 0,
      x: -24,
      transition: {
        type: 'tween',
        duration: 0.1,
      },
    },
  }

  useEffect(() => {
    const pathArray = routes.map(({ paths }) => (paths[0] === pathname ? 1 : 0))
    const selectedIndex = pathArray.indexOf(1)
    moveCorrectly(selectedIndex)
  }, [moveCorrectly, pathname, routes])

  return (
    <>
      <SidebarNav
        variants={motionBackground}
        animate={open ? 'open' : 'closed'}
        initial={open ? 'open' : 'closed'}
        letters={letters}
        background={background}
      >
        <div id='header'>
          <Hamburger toggle={onToggle} state={open} color={letters} />

          <AnimatePresence>
            {open && (
              <motion.div variants={motionTitle} initial='initial' id='title'>
                {title}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ul>
          {routes.map(({ paths, bottom, icon: Icon, label }, index) => (
            <ListItem
              key={paths[0]}
              bottom={bottom}
              selected={selected}
              paths={paths?.map(path => path.replaceAll('/', '-'))}
              pathname={pathname.replaceAll('/', '-')}
            >
              <button
                type='button'
                id={paths[0].replaceAll('/', '-')}
                onClick={() => {
                  samePage && moveCorrectly(index)
                  history.push(paths[0])
                }}
              >
                {Icon !== undefined && (
                  <div className='icon'>
                    <Icon />
                  </div>
                )}

                <AnimatePresence>
                  {open && (
                    <motion.div
                      className='label'
                      initial={{
                        opacity: 0,
                        x: -24,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: {
                          type: 'tween',
                          duration: 0.4,
                          delay: 0.1 * index,
                        },
                      }}
                      exit={{
                        opacity: 0,
                        x: -24,
                        transition: {
                          type: 'tween',
                          duration: 0.1,
                        },
                      }}
                    >
                      {label}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </ListItem>
          ))}
        </ul>
      </SidebarNav>

      {routes.map(({ paths, component, noContentMove, exact }) => (
        <motion.section
          key={paths[0]}
          id={paths[0].replaceAll('/', '--')}
          variants={motionContent}
          animate={open && !noContentMove ? 'open' : 'closed'}
          initial={open && !noContentMove ? 'open' : 'closed'}
        >
          {samePage ? (
            component && component()
          ) : (
            <>
              {paths.map(path => (
                <Route key={path} path={path} exact={exact} component={component} />
              ))}
            </>
          )}
        </motion.section>
      ))}
    </>
  )
}

export default Sidebar
