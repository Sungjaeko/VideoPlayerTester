import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { BiFullscreen, BiExitFullscreen, BiDownload } from "react-icons/bi";
import {
  AiFillPlayCircle,
  AiFillPauseCircle,
  AiFillStepBackward,
  AiFillStepForward,
  AiFillCamera,
} from "react-icons/ai";
import { canvasCapture, canvasDownload } from "./canvasFunctions.js";
import {
  generateVideoThumbnails,
  importFileandPreview,
} from "@rajesh896/video-thumbnails-generator";
import "./App.css";

function VideoPlayer() {
  const localVideoSource = "Test2_1_360x360_AACAudio_229.mp4";
  const baseURL = "http://localhost:3000/";
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  //const [loaded, setLoaded] = useState(0);
  const [thumbnails, setThumbnails] = useState([]);
  const thumbNumber = 10;
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

  // Initialize canvas elements so be accessed by both functions
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");

  // Screenshot setter and holder
  const screenshotButton = () => {
    var screenshotHolder = canvasCapture(canvas, ctx, playerRef);
    setScreenshots((screenshots) => [...screenshots, screenshotHolder]);
  };

  const handleSeekForward = () => {
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(currentTime + 5);
  };

  const handleSeekTo = (time) => {
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(time);
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

  const handleFullscreen = () => {
    setFullscreen(!fullscreen);
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

  // function handleProgressBarHover(event) {
  //   const progressBar = event.target;
  //   const video = playerRef.current.player.player.player;
  //   const videoDuration = video.duration;
  //   const mouseX = event.clientX - progressBar.getBoundingClientRect().left;
  //   const progressPercentage = mouseX / progressBar.offsetWidth;
  //   const currentTime = progressPercentage * videoDuration;
  //   video.currentTime = currentTime;
  //   const canvas = document.createElement("canvas");
  //   canvas.width = video.videoWidth;
  //   canvas.height = video.videoHeight;
  //   canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  //   const thumbnailUrl = canvas.toDataURL();
  // }

  useEffect(() => {
    importFileandPreview(video).then((res) => {
      setVideoUrl(res);
    });
    setThumbnails([]);
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
  return (
    <div className="container">
      <div className="col-1">
        <div className="player-wrapper">
          <ReactPlayer
            className="react-player"
            ref={playerRef}
            url={baseURL + localVideoSource}
            //url="https://vimeo.com/243556536"
            playing={playing}
            muted={true}
            onProgress={handleProgress}
            onDuration={handleDuration}
            // width="100%"
            // height="100%"
            //width={fullscreen ? "100%" : "50%"}
            //height={fullscreen ? "100%" : "auto"}
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

        <div className="functionButtons">
          <button onClick={handleSeekBackward}>
            <AiFillStepBackward size={20} />
          </button>
          <button
            onClick={() => {
              handlePlayPause();
              console.log(timeSkips);
              generateVideoThumbnails(video, thumbNumber).then((thumbs) => {
                setThumbnails(thumbs);
                if (refs.current.loader) {
                  refs.current.loader.style.display = "none";
                }
              });
            }}
          >
            {playing ? (
              <AiFillPauseCircle size={24} />
            ) : (
              <AiFillPlayCircle size={24} />
            )}
          </button>
          <button onClick={handleSeekForward}>
            {" "}
            <AiFillStepForward size={20} />
          </button>
          <span>
            {new Date(playedSeconds * 1000).toISOString().substr(11, 8)}
          </span>
          <span>/</span>
          <span>{new Date(duration * 1000).toISOString().substr(11, 8)}</span>
          <div style={{ display: "flex", marginTop: 25 }}>
            <input
              type="file"
              id="inputfile"
              accept="video/*"
              onChange={(e) => {
                if (e.target.files?.length > 0) {
                  setVideo(e.target.files[0]);
                }
              }}
            />
          </div>
          <div id="thumbnails">
            {thumbnails.map((item, index) => {
              return (
                <img
                  src={item}
                  style={{ width: 80, margin: 0, cursor: "pointer" }}
                  alt=""
                  onClick={() => {
                    handleSeekTo(timeSkips[index]);
                  }}
                />
              );
            })}
          </div>
          {/* <div className="progressBar">
          <input
            type="range"
            min={0}
            max={1}
            step="any"
            value={played}
            onMouseDown={handleSeekMouseDown}
            onChange={handleSeek}
            onMouseUp={handleSeekMouseUp}
          />
        </div> */}
          <button onClick={handleFullscreen}>
            {fullscreen ? (
              <BiExitFullscreen size={20} />
            ) : (
              <BiFullscreen size={20} />
            )}
          </button>
        </div>
        <div className="canvasFunctions">
          <button id="screenshotButton" onClick={screenshotButton}>
            <AiFillCamera size={20} />
          </button>
          <button
            id="download"
            onClick={() =>
              screenshots.forEach((canvas) => {
                canvasDownload(canvas, ctx);
              })
            }
          >
            <BiDownload size={20} />
          </button>
        </div>
      </div>
      <div className="col-2">
        <div id="screenshot"></div>
      </div>
    </div>
  );
}

export default VideoPlayer;
