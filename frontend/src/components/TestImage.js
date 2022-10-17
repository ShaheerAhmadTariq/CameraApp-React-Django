import React from 'react'
import axios from 'axios';

function TestImage() {
  const canvas = React.useRef(null);
  const localVideo = React.useRef(null);
  async function startDrawing() {
    // console.log(canvas.current,localVideo.current)
    // var canvas = document.querySelector('canvas');
    var ctx = canvas.current.getContext('2d');
    // const localVideo = document.getElementById('localVideo');
    const stream = await navigator.mediaDevices.getUserMedia({audio: false, video: true});
    console.log("navigator",stream)
    localVideo.current.src = window.URL.createObjectURL(await stream );  
    var updateCanvas = function(now) {
      
        
        ctx.drawImage(localVideo.current, 0, 0, canvas.current.width, canvas.height);
        // var image_base64 = document.querySelector("canvas").toDataURL().replace(/^data:image\/png;base64,/, "");

        // JPEG base64
        var image_base64 = canvas.current.toDataURL('image/jpeg');

        // Sending image to server
        var url = 'http://127.0.0.1:8000/api/task-create/'
        const data = new FormData()
        const config = {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
        data.append('video',image_base64);
        // axios.post(url, data, config).then(response => {
        // console.log(response.data)})
        console.log(image_base64)
        localVideo.current.requestVideoFrameCallback(updateCanvas);
    }

    localVideo.current.requestVideoFrameCallback(updateCanvas);
    
    // PNG base64
    
  }
  return (
    <>
      <video ref={localVideo} ></video>
      <button id="startButton" onClick={startDrawing}>Start</button>
      <canvas width="640" height="360" ref={canvas}></canvas>
    </>
  )
}

export default TestImage