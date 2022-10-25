# CameraApp-React-Django
it records video from camera using react and send it to Django server to run some python script 

# Why this project?
i wanted to build something which can send user video frame by frame to server
where some python scripyt would run on it (to perform some computer vision task) 
then send those enhanced frames to react 

# Details
in /Testing route user camera opens and send the stream to video tag
then using canva i get the current context (frame) from canva and send it to server in string format.
