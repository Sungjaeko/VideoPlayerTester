import React, { useState, useEffect, useRef } from "react";
import { canvasCapture, canvasDownload } from "./canvasFunctions.js";
import "./App.css";
import ReactPlayer from "react-player";
import {
  FaPlay,
  FaForward,
  FaBackward,
  FaPause,
  FaCamera,
  FaDownload,
} from "react-icons/fa";
import {
  generateVideoThumbnails,
  importFileandPreview,
} from "@rajesh896/video-thumbnails-generator";
import { timestamp } from "rxjs-compat/operator/timestamp.js";
import { ThumbDown } from "@mui/icons-material";

function VideoPlayer() {
  // Initialize canvas elements so be accessed by both functions
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  const localVideoSource = "Test2_1_360x360_AACAudio_229.mp4";
  const aviVideoSource =
    "https://gidigital-uswe.streaming.media.azure.net/07f61976-118d-44ff-82af-05e858dc4a27/A00X2R.699_Patient Test_Rome Jut_1152x224_AACAudio_298.mp4";
  const baseURL = "http://localhost:3000/";
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [thumbnails, setThumbnails] = useState();
  const thumbNumber = 31;
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [videoUrl, setVideoUrl] = useState(baseURL + localVideoSource);
  const [video, setVideo] = useState("");
  const playerRef = React.createRef();
  const [screenshots, setScreenshots] = useState([]);
  const refs = useRef({
    video: null,
    loader: null,
    numberInput: null,
    thumbButton: null,
  });
  let timeSkips = [];
  for (let i = 0; i <= thumbNumber; i++) {
    timeSkips.push(parseFloat(duration / thumbNumber) * i);
  }
  // Keyboard Shortcuts

  // const handleKeyDown = (event) => {
  //   if (event.key === "b") {
  //     var screenshotHolder = canvasCapture(canvas, ctx, playerRef);
  //     setScreenshots((screenshots) => [...screenshots, screenshotHolder]);
  //   } else if (event.key == "Left key") {
  //     const currentTime = playerRef.current.getCurrentTime();
  //     playerRef.current.seekTo(currentTime - 5);
  //   } else if (event.key == "Right key") {
  //     const currentTime = playerRef.current.getCurrentTime();
  //     playerRef.current.seekTo(currentTime + 5);
  //   }
  // };

  // Screenshot setter and holder
  const handleScreenshot = (event) => {
    let screenshotHolder = canvasCapture(canvas, ctx, playerRef);
    //let tempTimestamp = playerRef.current.getCurrentTime();
    // setScreenshots((screenshots) => [
    //   ...screenshots,
    //   { img: screenshotHolder, time: 0 },
    // ]);
    setScreenshots((screenshots) => [...screenshots, screenshotHolder]);
  };

  const handleSeekForward = () => {
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(currentTime + 5);
  };

  const handlePlaybackRateChange = (event) => {
    setPlaybackRate(parseFloat(event.target.value));
  };

  const handleSeekTo = (time) => {
    const currentTime = playerRef.current?.getCurrentTime();
    playerRef.current?.seekTo(currentTime ? currentTime : 0);
  };

  const handleSeekBackward = () => {
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(currentTime - 5);
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleProgress = (state) => {
    if (!seeking) {
      setPlayed(state.played);
      setPlayedSeconds(state.playedSeconds);
    }
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleSeek = (event) => {
    setPlayed(parseFloat(event.target.value));
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (event) => {
    setSeeking(false);
    const seekTo = parseFloat(event.target.value);
    playerRef.current.seekTo(seekTo);
  };

  useEffect(() => {
    generateVideoThumbnails(video, thumbNumber).then((thumb) => {
      setThumbnails(thumb);
    });
    importFileandPreview(video).then((res) => {
      setVideoUrl(res);
    });
    if (refs.current.video) {
      refs.current.video.style.transform = "scale(1)";
    }

    if (refs.current.numberInput) {
      refs.current.numberInput.style.display = "block";
    }
    if (refs.current.thumbButton) {
      refs.current.thumbButton.style.display = "block";
    }
  }, [video]);
  return thumbnails ? (
    <div className="container">
      <div className="col v1">
        <div className="player-wrapper center">
          <ReactPlayer
            className="react-player center"
            ref={playerRef}
            url={baseURL + localVideoSource}
            //url={aviVideoSource}
            playing={playing}
            muted={true}
            onProgress={handleProgress}
            onDuration={handleDuration}
            playbackRate={playbackRate}
            width="90%"
            height="90%"
          />
        </div>
        <input
          className="progressBar"
          type="range"
          min={0}
          max={1}
          step="any"
          value={played}
          onMouseDown={handleSeekMouseDown}
          onChange={handleSeek}
          onMouseUp={handleSeekMouseUp}
        />

        <div id="thumbnails" className="center">
          {thumbnails.map((item, index) => {
            return (
              <img
                src={item}
                style={{ width: "2.54vw", margin: 0, cursor: "pointer" }}
                alt=""
                onClick={() => {
                  handleSeekTo(timeSkips[index]);
                }}
              />
            );
          })}
        </div>
        <div className="functionButtons centerFunctionButtons">
          <span>
            <button
              id="downloadButton"
              onClick={() =>
                screenshots.forEach((canvas) => {
                  canvasDownload(canvas, ctx);
                })
              }
            >
              <FaDownload size={40} />
            </button>
          </span>
          <input
            id="playbackSpeedAdjuster"
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={playbackRate}
            onChange={handlePlaybackRateChange}
          />
          <span id="playbackSpeedLabel">{playbackRate.toFixed(1)}</span>
          <button id="goBackwardButton" onClick={handleSeekBackward}>
            <FaBackward size={50} />
          </button>
          <button
            id="playPauseButton"
            //onKeyDown={handleKeyDown}
            onClick={() => {
              handlePlayPause();
              console.log(timeSkips);
            }}
          >
            {playing ? <FaPause size={70} /> : <FaPlay size={70} />}
          </button>
          {/* <div className="hide"> Play</div> */}
          <button id="goForwardButton" onClick={handleSeekForward}>
            <FaForward size={50} />
          </button>
          <span id="currentTime">
            {new Date(playedSeconds * 1000).toISOString().substr(11, 8)}
          </span>
          <span id="slash">/</span>
          <span id="remainingTime">
            {new Date(duration * 1000).toISOString().substr(11, 8)}
          </span>
          <span>
            <button id="screenshotButton" onClick={handleScreenshot}>
              <FaCamera size={40} />
            </button>
          </span>
        </div>
      </div>
      <div className="col v2">
        <div id="screenshot">
          {screenshots.map((screenshot) => {
            // <section onClick={handleSeekTo(screenshot.time)}>
            //   {screenshot.img};
            // </section>;
            return (
              <img
                src={screenshot}
                onClick={() => {
                  console.log("HERE");
                  handleSeekTo(screenshot.time);
                  console.log(screenshot.time);
                  console.log(handleSeekTo(screenshot.time));
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  ) : (
    <span
      className="fileDetectedLabel"
      //style={{ display: "flex", marginTop: 25 }}
    >
      <input
        type="file"
        id="chooseFileButton"
        accept="video/*"
        onChange={(e) => {
          if (e.target.files?.length > 0) {
            setVideo(e.target.files[0]);
          }
        }}
      />
    </span>
  );
}

export default VideoPlayer;
