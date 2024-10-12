import { FC } from 'react'
import { css, cx } from '../../../styled-system/css'
import { icon } from '../../../styled-system/recipes'
import { token } from '../../../styled-system/tokens'
import IconType from '../../@types/Icon'

// eslint-disable-next-line jsdoc/require-jsdoc
const SettingsIcon: FC<IconType> = ({ cssRaw, fill, size = 20, style }) => {
  return (
    <svg
      className={cx(icon(), css(cssRaw))}
      x='0px'
      y='0px'
      viewBox='100 0 600 600'
      width={size}
      height={size}
      fill={fill || token('colors.fg')}
      style={style}
    >
      <g>
        <path d='m350 178.75c-26.855 0-52.609 10.664-71.598 29.652-18.988 18.988-29.652 44.742-29.652 71.598s10.664 52.609 29.652 71.598c18.988 18.988 44.742 29.652 71.598 29.652s52.609-10.664 71.598-29.652c18.988-18.988 29.652-44.742 29.652-71.598-0.03125-26.844-10.707-52.578-29.691-71.559-18.98-18.984-44.715-29.66-71.559-29.691zm0 184.09c-21.969 0-43.039-8.7305-58.574-24.266-15.535-15.535-24.266-36.605-24.266-58.574s8.7305-43.039 24.266-58.574c15.535-15.535 36.605-24.266 58.574-24.266s43.039 8.7305 58.574 24.266c15.535 15.535 24.266 36.605 24.266 58.574-0.023438 21.965-8.7578 43.02-24.289 58.551s-36.586 24.266-58.551 24.289zm202.64-120.91-36.285-4.7422c-1.082-0.20312-1.9336-1.0352-2.168-2.1094-3.7773-13.758-9.2734-26.984-16.359-39.371-0.59766-0.92188-0.58203-2.1133 0.039063-3.0156l22.34-29.059c3.0977-4.0391 4.625-9.0625 4.2969-14.141-0.32812-5.0781-2.4922-9.8672-6.0859-13.469l-24.441-24.441c-3.6016-3.5938-8.3906-5.7539-13.469-6.082s-10.102 1.1953-14.141 4.293l-29.047 22.348v0.003906c-0.91016 0.625-2.1133 0.63672-3.0391 0.027344-12.379-7.0859-25.605-12.582-39.359-16.359-1.0781-0.22656-1.9141-1.082-2.1094-2.168l-4.7422-36.285c-0.66797-5.0469-3.1445-9.6797-6.9688-13.035-3.8242-3.3594-8.7383-5.2148-13.828-5.2266h-34.555c-5.0898 0.011719-10 1.8672-13.824 5.2266-3.8242 3.3594-6.3047 7.9883-6.9727 13.035l-4.7422 36.285c-0.19531 1.0859-1.0312 1.9414-2.1094 2.168-13.758 3.7812-26.984 9.2773-39.371 16.359-0.91406 0.60938-2.1133 0.59766-3.0195-0.027344l-29.047-22.348v-0.003907c-4.0391-3.0977-9.0664-4.6211-14.145-4.293-5.0781 0.32812-9.8672 2.4883-13.473 6.082l-24.441 24.441c-3.5898 3.6055-5.7539 8.3906-6.082 13.469s1.1953 10.102 4.293 14.141l22.348 29.059h0.003906c0.62109 0.90625 0.63281 2.1016 0.035156 3.0273-7.0898 12.379-12.586 25.602-16.359 39.359-0.23047 1.0742-1.0859 1.9062-2.168 2.1094l-36.293 4.7422c-5.0469 0.66797-9.6758 3.1484-13.035 6.9727-3.3594 3.8242-5.2148 8.7344-5.2266 13.824v34.555c0.011719 5.0898 1.8672 10.004 5.2266 13.828 3.3555 3.8242 7.9883 6.3008 13.035 6.9688l36.297 4.7422h-0.003906c1.082 0.20312 1.9375 1.0352 2.168 2.1094 3.7734 13.758 9.2695 26.988 16.359 39.371 0.59766 0.92188 0.58594 2.1133-0.035156 3.0156l-22.348 29.059h-0.003907c-3.0977 4.0391-4.6211 9.0625-4.293 14.141s2.4922 9.8633 6.082 13.469l24.441 24.441c3.6016 3.5977 8.3906 5.7617 13.473 6.0938 5.082 0.32812 10.109-1.2031 14.145-4.3047l29.047-22.34c0.91406-0.61719 2.1055-0.63281 3.0312-0.039063 12.379 7.0859 25.605 12.582 39.359 16.359 1.0781 0.22656 1.9141 1.082 2.1094 2.168l4.7422 36.285c0.66797 5.0469 3.1445 9.6758 6.9727 13.035 3.8242 3.3594 8.7344 5.2148 13.824 5.2266h34.555c5.0898-0.011719 10.004-1.8672 13.828-5.2266 3.8242-3.3555 6.3008-7.9883 6.9688-13.035l4.7422-36.285c0.19531-1.0859 1.0312-1.9414 2.1094-2.168 13.758-3.7773 26.988-9.2734 39.371-16.359 0.92578-0.59375 2.1172-0.57812 3.0273 0.039063l29.047 22.34c4.0352 3.1016 9.0625 4.6328 14.141 4.3047 5.082-0.32812 9.8672-2.4961 13.469-6.0938l24.441-24.441c3.5938-3.6016 5.7578-8.3906 6.0859-13.469 0.32813-5.0781-1.1992-10.102-4.2969-14.141l-22.34-29.059c-0.62109-0.90625-0.63672-2.1016-0.039063-3.0273 7.0859-12.379 12.582-25.605 16.359-39.359 0.23438-1.0742 1.0859-1.9062 2.168-2.1094l36.285-4.7422c5.0469-0.66797 9.6797-3.1445 13.035-6.9688 3.3594-3.8242 5.2148-8.7383 5.2266-13.828v-34.555c-0.011719-5.0898-1.8672-10-5.2266-13.824-3.3594-3.8242-7.9883-6.3047-13.035-6.9727zm-0.14062 55.352c-0.003906 1.2852-0.95703 2.3711-2.2344 2.5469l-36.293 4.7305c-4.1328 0.5625-8 2.3398-11.125 5.1016-3.1211 2.7617-5.3555 6.3867-6.418 10.414-3.3594 12.262-8.2617 24.047-14.582 35.074-2.1016 3.6055-3.0898 7.7539-2.832 11.918 0.25391 4.168 1.7422 8.1641 4.2695 11.484l22.348 29.047h0.003906c0.76953 1.0273 0.67578 2.4648-0.23047 3.3789l-24.441 24.441 0.003906-0.003906c-0.91406 0.90625-2.3555 1-3.3789 0.21875l-29.059-22.34c-3.3164-2.5273-7.3125-4.0156-11.477-4.2695-4.1641-0.25781-8.3086 0.72656-11.91 2.832-11.035 6.3203-22.824 11.219-35.086 14.582-4.0273 1.0664-7.6484 3.3008-10.406 6.4219-2.7578 3.125-4.5312 6.9922-5.0938 11.121l-4.7422 36.297 0.003907-0.003907c-0.17578 1.2773-1.2617 2.2305-2.5469 2.2344h-34.555c-1.2852-0.007812-2.3711-0.96094-2.5469-2.2344l-4.7305-36.293c-0.5625-4.1328-2.3359-8.0039-5.0977-11.125-2.7617-3.1211-6.3867-5.3555-10.418-6.418-12.258-3.3672-24.043-8.2656-35.078-14.582-3.2539-1.8789-6.9414-2.8672-10.699-2.8672-4.5938-0.007813-9.0586 1.5078-12.699 4.3047l-29.047 22.34c-1.0195 0.78516-2.4609 0.69141-3.3672-0.21875l-24.441-24.441v0.003906c-0.90625-0.91406-1.0039-2.3555-0.22656-3.3789l22.348-29.059c2.5312-3.3164 4.0156-7.3125 4.2734-11.477 0.25391-4.1641-0.73047-8.3086-2.8359-11.914-6.3242-11.027-11.227-22.816-14.578-35.082-1.0703-4.0273-3.3086-7.6523-6.4297-10.41-3.125-2.7617-6.9922-4.5352-11.125-5.0977l-36.297-4.7305h0.003907c-1.2734-0.17578-2.2227-1.2617-2.2266-2.5469v-34.555c0.003906-1.2852 0.95312-2.3711 2.2266-2.5469l36.293-4.7305c4.1328-0.5625 8.0039-2.3359 11.129-5.0977 3.125-2.7617 5.3594-6.3867 6.4258-10.418 3.3555-12.262 8.2539-24.047 14.578-35.078 2.1055-3.6016 3.0898-7.75 2.8359-11.918-0.25781-4.1641-1.7422-8.1602-4.2734-11.48l-22.348-29.047c-0.77734-1.0234-0.67969-2.4609 0.22656-3.3672l24.441-24.441c0.90234-0.91797 2.3477-1.0156 3.3672-0.22656l29.059 22.34c3.3164 2.5312 7.3086 4.0234 11.477 4.2773 4.1641 0.25781 8.3125-0.73047 11.91-2.8398 11.035-6.3203 22.824-11.215 35.086-14.57 4.0312-1.0664 7.6523-3.3047 10.414-6.4297 2.7578-3.1211 4.5312-6.9922 5.0938-11.125l4.7305-36.297v0.003907c0.17578-1.2734 1.2617-2.2266 2.5469-2.2344h34.555c1.2852 0.003906 2.3711 0.95703 2.5469 2.2344l4.7422 36.297-0.003906-0.003906c0.5625 4.1328 2.3359 8.0039 5.0977 11.125 2.7578 3.125 6.3828 5.3633 10.41 6.4297 12.262 3.3555 24.047 8.25 35.074 14.57 3.6055 2.1094 7.7539 3.1016 11.922 2.8438 4.1641-0.25391 8.1641-1.7461 11.48-4.2812l29.047-22.34c1.0234-0.77734 2.4648-0.67969 3.3789 0.22656l24.441 24.441h-0.003906c0.90625 0.91016 1 2.3438 0.23047 3.3672l-22.348 29.059h-0.003907c-2.5273 3.3164-4.0156 7.3125-4.2734 11.477-0.25391 4.1641 0.73047 8.3086 2.8359 11.91 6.3242 11.035 11.223 22.824 14.582 35.086 1.0625 4.0312 3.2969 7.6523 6.4219 10.414 3.1211 2.7578 6.9922 4.5312 11.121 5.0938l36.297 4.7305h-0.003907c1.2773 0.17578 2.2305 1.2617 2.2344 2.5469z' />
      </g>
    </svg>
  )
}

export default SettingsIcon
