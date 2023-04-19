import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState, useCallback } from "react";

const MAX_IMAGE_WIDTH = 3000;

export default function Home() {
  const [svgElement, setSvgElement] = useState();
  const [outputImage, setOutputImage] = useState();
  const [svgDataUrl, setSvgDataUrl] = useState();
  const [scale, setScale] = useState(2);
  const [scaleMax, setScaleMax] = useState(10);
  const [fileName, setFileName] = useState("image.png");

  let fileReader;

  const handleFileRead = () => {
    const content = fileReader.result;
    const svgNode = new DOMParser().parseFromString(content, "text/html").body
      .childNodes[0];
    setSvgElement(content);
    const svgData = new XMLSerializer().serializeToString(svgNode);
    const svgDataBase64 = btoa(unescape(encodeURIComponent(svgData)));
    setSvgDataUrl(`data:image/svg+xml;charset=utf-8;base64,${svgDataBase64}`);
  };

  const handleFileChosen = (file) => {
    if (!file) {
      return;
    }
    setFileName(`${file.name.substring(0, file.name.lastIndexOf("."))}.png`);
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };

  const onFileChangeHandler = (event) => handleFileChosen(event.target.files[0]);

  useEffect(() => {
    if (!svgElement) {
      return;
    }
    const canvas = document.createElement("canvas");

    const image = new Image();

    function loadHandler() {
      const svgNode = new DOMParser().parseFromString(svgElement, "text/html")
        .body.childNodes[0];

      // get svg image size
      document.body.appendChild(svgNode);
      const initWidth = svgNode.getBoundingClientRect().width;
      setScaleMax(parseInt(MAX_IMAGE_WIDTH / initWidth, 10));
      const initHeight = svgNode.getBoundingClientRect().height;
      const width = svgNode.getBoundingClientRect().width * scale;
      const height = svgNode.getBoundingClientRect().height * scale;
      if (svgNode.parentNode) {
        svgNode.parentNode.removeChild(svgNode);
      }
      canvas.setAttribute("width", width);
      canvas.setAttribute("height", height);

      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, width, height);

      const dataUrl = canvas.toDataURL("image/png");
      setOutputImage({
        src: dataUrl,
        width,
        height,
        initWidth,
        initHeight,
      });
    }

    image.addEventListener("load", loadHandler);

    image.src = svgDataUrl || "";

    return () => {
      image.removeEventListener("load", loadHandler);
    };
  }, [svgElement, svgDataUrl, scale]);

  const onRatioChangeHandler = (event) => {
    setScale(event.target.value);
  };

  const downloadHandler = (event) => {
    event.preventDefault();

    fetch(event.target.href, {
      method: "GET",
      headers: {},
    })
      .then((response) => {
        response.arrayBuffer().then(function (buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex min-h-screen flex-col px-6 py-12 lg:px-8">
      <Head>
        <title>SVG to PNG Converter</title>
        <meta name="description" content="Convert SVG to PNG images online" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="mt-7 mb-5 text-center text-7xl font-bold text-gray-900">
        SVG to PNG
      </h1>

      <div className="mx-auto max-w-[400px] w-full">
        <label
          className="block font-mono mb-2 text-sm font-medium text-gray-900 dark:text-white"
          htmlFor="svg"
        >
          Select a file:
        </label>
        <input
          className="block overflow-hidden w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="svg"
          type="file"
          accept=".svg"
          onChange={onFileChangeHandler}
        />

        {svgElement && outputImage && (
          <>
            <label
              htmlFor="default-range"
              className="flex font-mono justify-between mt-4 mb-1 text-sm font-medium text-gray-900 dark:text-white"
            >
              <span>Scale Ratio: {scale}</span>
            </label>
            <input
              id="default-range"
              type="range"
              value={scale}
              step="1"
              min="1"
              max={scaleMax}
              disabled={!outputImage}
              onChange={onRatioChangeHandler}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </>
        )}
      </div>
      <main className="grow">
      {svgElement && outputImage && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 mt-5 gap-7 mx-auto max-w-[1000px]">
            <div>
              <div className="relative rounded-xl overflow-auto">
                <h2 className="text-center text-3xl font-extrabold mb-3">
                  SVG
                </h2>
                <div className="flex bg-gray-100 items-center justify-center relative h-[270px] overflow-hidden rounded-xl border border-dashed border-gray-400 p-4">
                  <div
                    className={`relative z-10 ${styles.svgInput}`}
                    dangerouslySetInnerHTML={{ __html: svgElement }}
                  />
                  <svg
                    className="absolute inset-0 h-full w-full stroke-gray-900/10"
                    fill="none"
                  >
                    <defs>
                      <pattern
                        id="pattern-1"
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
                      fill="url(#pattern-1)"
                      width="100%"
                      height="100%"
                    ></rect>
                  </svg>
                </div>

                {outputImage && (
                  <div className="mt-2 text-center font-mono">
                    Size: {parseInt(outputImage.initWidth, 10)}&times;
                    {parseInt(outputImage.initHeight, 10)}
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="relative rounded-xl overflow-auto">
                <h2 className="text-center text-3xl font-extrabold mb-3">
                  PNG
                </h2>
                <div className="flex bg-gray-100 items-center justify-center relative h-[270px] overflow-hidden rounded-xl border border-dashed border-gray-400 p-4">
                  {outputImage && (
                    <img
                      src={outputImage.src}
                      width={parseInt(outputImage.width, 10)}
                      height={parseInt(outputImage.height, 10)}
                      className="object-contain relative z-10"
                      alt=""
                    />
                  )}
                  <svg
                    className="absolute inset-0 h-full w-full stroke-gray-900/10"
                    fill="none"
                  >
                    <defs>
                      <pattern
                        id="pattern-2"
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
                      fill="url(#pattern-2)"
                      width="100%"
                      height="100%"
                    ></rect>
                  </svg>
                </div>

                {outputImage && (
                  <div className="mt-2 text-center font-mono">
                    Intrinsic size: {parseInt(outputImage.width, 10)}&times;
                    {parseInt(outputImage.height, 10)}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <a
              href={outputImage.src}
              onClick={downloadHandler}
              className="inline-flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                className="w-5 h-5 mr-2 -ml-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                ></path>
              </svg>
              Download PNG
            </a>
          </div>
          </>
      )}
      </main>

      <footer className="text-center mt-5 flex justify-center">
        <a href="https://github.com/forbrace/svg-to-png">
          <svg
            className="block mx-auto"
            height="32"
            aria-hidden="true"
            viewBox="0 0 16 16"
            version="1.1"
            width="32"
            data-view-component="true"
          >
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
          </svg>
        </a>
      </footer>
    </div>
  );
}
