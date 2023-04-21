import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Fragment, useEffect, useState, useCallback } from "react";
import { Transition } from "@headlessui/react";

import Header from "../components/Header";

const MAX_IMAGE_WIDTH = 3000;

export default function Home() {
  const [svgElementStr, setSvgElementStr] = useState();
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
    setSvgElementStr(content);
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

  const onFileChangeHandler = (event) =>
    handleFileChosen(event.target.files[0]);

  useEffect(() => {
    if (!svgElementStr) {
      return;
    }
    const canvas = document.createElement("canvas");

    const image = new Image();

    function loadHandler() {
      const svgNode = new DOMParser().parseFromString(
        svgElementStr,
        "text/html"
      ).body.childNodes[0];

      const svgViewbox = svgNode.viewBox.baseVal;
      const initWidth = svgViewbox.width;
      const initHeight = svgViewbox.height;

      setScaleMax(parseInt(MAX_IMAGE_WIDTH / initWidth, 10));

      const width = initWidth * scale;
      const height = initHeight * scale;

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
        svgViewbox,
      });
    }

    image.addEventListener("load", loadHandler);

    image.src = svgDataUrl || "";

    return () => {
      image.removeEventListener("load", loadHandler);
    };
  }, [svgElementStr, svgDataUrl, scale]);

  const onRatioChangeHandler = (event) => {
    setScale(event.target.value);
  };

  const downloadHandler = (event) => {
    event.preventDefault();

    fetch(event.target.href, {
      method: "GET",
      headers: {},
    })
      .then((res) => {
        res.arrayBuffer().then(function (buffer) {
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
    <div className="flex min-h-screen flex-col mx-auto max-w-[1000px] px-6">
      <Head>
        <title>SVG to PNG Converter</title>
        <meta name="description" content="Convert SVG to PNG images online" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="grow flex">
        <div className="grow">
          <div className="mx-auto max-w-[400px] w-full my-6">
            <input
              id="svg"
              type="file"
              accept=".svg"
              onChange={onFileChangeHandler}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-3 file:px-7
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
              "
            />
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
            show={!!svgElementStr && !!outputImage}
          >
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 mt-5 gap-7 mx-auto max-w-[1000px]">
                <div>
                  <div className="relative rounded-xl overflow-auto">
                    <h2 className="text-center text-3xl font-extrabold mb-3">
                      SVG
                    </h2>
                    <div className="flex  items-center justify-center relative h-[270px] overflow-hidden rounded-xl border border-dashed border-gray-400 p-4">
                      <div
                        className={`relative z-10 grow shrink-0 text-center ${styles.svgInput}`}
                        dangerouslySetInnerHTML={{ __html: svgElementStr }}
                      />
                      <svg
                        className="absolute inset-0 h-full w-full stroke-gray-900/10 dark:stroke-gray-800/80"
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
                        viewBox: {outputImage.svgViewbox?.x}{" "}
                        {outputImage.svgViewbox?.y}{" "}
                        {outputImage.svgViewbox?.width}{" "}
                        {outputImage.svgViewbox?.height}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="relative rounded-xl overflow-auto">
                    <h2 className="text-center text-3xl font-extrabold mb-3">
                      PNG
                    </h2>
                    <div className="flex items-center justify-center relative h-[270px] overflow-hidden rounded-xl border border-dashed border-gray-400 p-4">
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
                        className="absolute inset-0 h-full w-full stroke-gray-900/10 dark:stroke-gray-800/80"
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

              <div className="mx-auto max-w-[400px] w-full">
                <label
                  htmlFor="default-range"
                  className="flex font-mono justify-center mt-4 mb-1 text-sm font-medium text-gray-900 dark:text-white"
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
              </div>

              <div className="text-center mt-9">
                <a
                  href={outputImage?.src}
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
            </div>
          </Transition>
        </div>
      </main>

      <footer className="text-center my-5 flex justify-center"></footer>
    </div>
  );
}
