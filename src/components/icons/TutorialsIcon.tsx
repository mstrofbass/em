import { FC } from 'react'
import { css, cx } from '../../../styled-system/css'
import { icon } from '../../../styled-system/recipes'
import { token } from '../../../styled-system/tokens'
import Icon from '../../@types/Icon'

/** Tutorials icon that shows a teacher at a board. */
const TutorialsIcon: FC<Icon> = ({ cssRaw, fill, style, size = 20 }) => {
  return (
    <svg
      x='0'
      y='0'
      viewBox='90 100 600 600'
      className={cx(icon(), css(cssRaw))}
      width={size}
      height={size}
      fill={fill || token('colors.fg')}
      style={{ ...style }}
    >
      <path d='m105.04 106.67c-2.332-0.011719-4.5742 0.91016-6.2227 2.5625-1.6484 1.6484-2.5703 3.8867-2.5625 6.2188v283.95c-0.007812 2.332 0.91406 4.5703 2.5625 6.2227 1.6484 1.6484 3.8906 2.5703 6.2227 2.5625h38.297v36.434c0.019531 4.8047 3.9102 8.6992 8.7148 8.7148h140.89c4.832 0.019531 8.7656-3.8828 8.7852-8.7148v-36.434h293.3-0.003906c2.3242-0.003906 4.5508-0.93359 6.1914-2.582 1.6367-1.6484 2.5508-3.8789 2.543-6.2031v-283.95c0.007812-2.3242-0.90625-4.5547-2.543-6.2031-1.6406-1.6484-3.8672-2.5742-6.1914-2.5781zm8.7148 17.516h472.48v266.5h-43.016v-39.086c0.007812-2.332-0.91406-4.5703-2.5625-6.2227-1.6523-1.6484-3.8906-2.5703-6.2227-2.5625h-93.328c-4.832 0.019531-8.7344 3.9531-8.7148 8.7852v39.086h-130.67v-31.84h43.461c20.234 0 36.762-16.605 36.762-36.828s-16.535-36.742-36.762-36.742h-73.25c-5.8086-4.8203-12.133-9.125-18.934-12.543 13.23-9.5312 21.91-25.023 21.91-42.484 0-28.82-23.559-52.398-52.379-52.398s-52.379 23.578-52.379 52.398c0 16.898 8.1289 31.953 20.645 41.547-27.914 12.246-47.457 40.094-47.457 72.512v46.383l-29.59-0.003906zm108.78 71.18c19.363 0 34.879 15.52 34.879 34.879 0 19.363-15.52 34.879-34.879 34.879-19.363 0-34.879-15.516-34.879-34.879 0-19.363 15.52-34.879 34.879-34.879zm0 87.262c16.906 0 32.027 6.75 43.152 17.637 1.6367 1.6094 3.8398 2.5117 6.1328 2.5117h73.367c10.844 0 19.262 8.4023 19.262 19.242 0 10.844-8.4297 19.312-19.262 19.312h-52.242c-4.8203 0.011719-8.7227 3.9141-8.7344 8.7344v85.773h-123.37v-91.535c0-34.312 27.375-61.676 61.695-61.676zm227.36 77.707h75.828v30.352h-75.828z' />
    </svg>
  )
}

export default TutorialsIcon
