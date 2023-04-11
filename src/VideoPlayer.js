import React, { useState } from "react";
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
import "./App.css";

function VideoPlayer() {
  const localVideoSource = "Test2_1_360x360_AACAudio_229.mp4";
  const baseURL = "http://localhost:3000/";
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [light, setLight] = useState(true);
  const [seeking, setSeeking] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const playerRef = React.createRef();
  const [screenshots, setScreenshots] = useState([]);

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

  function handleProgressBarHover(event) {
    const progressBar = event.target;
    const video = playerRef.current.player.player.player;
    const videoDuration = video.duration;
    const mouseX = event.clientX - progressBar.getBoundingClientRect().left;
    const progressPercentage = mouseX / progressBar.offsetWidth;
    const currentTime = progressPercentage * videoDuration;
    video.currentTime = currentTime;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

    const thumbnailUrl = canvas.toDataURL();
    setThumbnailUrl(thumbnailUrl);
  }
  return (
    <div className="container">
      <div className="playerDiv">
        <ReactPlayer
          ref={playerRef}
          url={baseURL + localVideoSource}
          playing={playing}
          muted={true}
          onProgress={handleProgress}
          onDuration={handleDuration}
          width={fullscreen ? "100%" : "50%"}
          height={fullscreen ? "100%" : "auto"}
        />
        <div className="functionButtons">
          <button onClick={handleSeekBackward}>
            <AiFillStepBackward size={20} />
          </button>
          <button onClick={handlePlayPause}>
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
          <div className="progressBar&Time">
            <span>
              {new Date(playedSeconds * 1000).toISOString().substr(11, 8)}
            </span>
            <span>/</span>
            <span>{new Date(duration * 1000).toISOString().substr(11, 8)}</span>
            <input
              type="range"
              min={0}
              max={1}
              step="any"
              value={played}
              onMouseDown={handleSeekMouseDown}
              onChange={handleSeek}
              onMouseUp={handleSeekMouseUp}
              onMouseOver={handleProgressBarHover}
            />
          </div>
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
        <div id="screenshot"></div>
      </div>
    </div>
  );
}

export default VideoPlayer;
