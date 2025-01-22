import { SVGProps } from "react";

export function Twitch(props: SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        width="1em"
        height="1em"
        {...props}
      >
        <path
          fill="#6441A4"
          d="M1.5 0L0 2.5V14h4v2h2l2-2h2.5L15 9.5V0zM13 8.5L10.5 11H8l-2 2v-2H3V2h10z"
        ></path>
        <path fill="#6441A4" d="M9.5 4H11v4H9.5zm-3 0H8v4H6.5z"></path>
      </svg>
    )
  }
  