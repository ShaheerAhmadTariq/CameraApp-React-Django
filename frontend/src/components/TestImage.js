import React from 'react'
import axios from 'axios';
function TestImage() {
  // const localVideo = React.useRef();
  let t0
  let t1
const [imgState,setImageState]=React.useState("")
function getVideo()
{
  
  
  navigator.getUserMedia = navigator.getUserMedia ||
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia;

      if (navigator.getUserMedia) {
            navigator.getUserMedia({ audio: false, video: { width: 1280, height: 720 } },
                (stream) => {
                  console.log("starting video")
                  const video = document.getElementById('localVideo');
                  var canvas = document.querySelector('canvas');
                  var ctx = canvas.getContext('2d');
                  video.srcObject = stream;
                  const image1 = document.getElementById('localPhoto')
                  
                  video.onloadedmetadata = (e) => {
                    video.play();
                  };
                  var updateCanvas = function(now) {
            
                    t0= performance.now(); //start time
                            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                            var image_base64 = document.querySelector("canvas").toDataURL('image/jpeg');
                            console.log("Sending req")
                            // t1= performance.now(); //end time
                            // console.log(image_base64)
                            // Sending to server
                            var url = 'http://127.0.0.1:8000/api/task-create/'
                            const data = new FormData()
                            const config = {
                              headers: { 'Content-Type': 'multipart/form-data' }
                            }
                            data.append('video',image_base64);
                            axios.post(url, data, config).then(response => {
                                  console.log(response.data)
                                setImageState(response.data)
                                  t1= performance.now(); //end time
                                  // console.log('Time taken to capture and send one frame from react and get response from Django is:'+ (t1-t0) +' milliseconds');
                                })
                                  video.requestVideoFrameCallback(updateCanvas); 
                                  
                          }
                          
                          video.requestVideoFrameCallback(updateCanvas);  
                },
                (err) => {
                  console.error(`The following error occurred: ${err.name}`);
                }
            );
          } else {
            console.log("getUserMedia not supported");
          }

  }
  function stopVideo()
  {
    const video = document.getElementById('localVideo');
    video.pause();
    console.log("Stopped")
  }
  function stopButton()
  {
    console.log("Stop button clicked")
    const myTimeout = setTimeout(stopVideo, 1000);

  }
  function createVideo()
  {
    var url = 'http://127.0.0.1:8000/api/createVideo/'
                          
                            
                            axios.post(url, 'data').then(response => {
                                  console.log(response.data)
                                 
                                })
  }
  return (
    <>
    <video width="640" height="360"id="localVideo" ></video>
    <button id="startButton" onClick={getVideo}>Start</button>
    <button id="stopButton" onClick={stopButton}>Stop</button>
    <button onClick={createVideo}>CreateVideo</button>
    <canvas width="640" height="360"></canvas>
    <img id='localPhoto' src={imgState} alt="backend-image" />
    {/* <video id='backendImage'></video> */}
    </>
  )
}

export default TestImage