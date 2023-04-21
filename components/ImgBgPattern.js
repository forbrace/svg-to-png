import { nanoid } from "nanoid";

const ImgBgPattern = () => {
  const id = nanoid();

  return (
    <svg
      className="absolute inset-0 h-full w-full stroke-gray-900/10 dark:stroke-gray-800/80"
      fill="none"
    >
      <defs>
        <pattern
          id={id}
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
        </pattern>
      </defs>
      <rect
        stroke="none"
        fill={`url(#${id})`}
        width="100%"
        height="100%"
      ></rect>
    </svg>
  );
};

export default ImgBgPattern;
