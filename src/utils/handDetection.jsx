export function handDetection(video, canvas, landmarkerRef) {
  const ctx = canvas.getContext("2d");

  const detect = () => {
    if (!video || !canvas || !landmarkerRef.current) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (video.videoWidth > 0 && video.videoHeight > 0) {
      const results = landmarkerRef.current.detectForVideo(
        video,
        performance.now()
      );

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.landmarks) {
        for (const landmarks of results.landmarks) {
          const connections = [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [0, 5],
            [5, 6],
            [6, 7],
            [7, 8],
            [0, 9],
            [9, 10],
            [10, 11],
            [11, 12],
            [0, 13],
            [13, 14],
            [14, 15],
            [15, 16],
            [0, 17],
            [17, 18],
            [18, 19],
            [19, 20],
            [5, 9],
            [9, 13],
            [13, 17],
          ];

          ctx.strokeStyle = "#00FF00";
          ctx.lineWidth = 2;
          for (const [start, end] of connections) {
            ctx.beginPath();
            ctx.moveTo(
              landmarks[start].x * canvas.width,
              landmarks[start].y * canvas.height
            );
            ctx.lineTo(
              landmarks[end].x * canvas.width,
              landmarks[end].y * canvas.height
            );
            ctx.stroke();
          }

          ctx.fillStyle = "pink";
          for (const landmark of landmarks) {
            ctx.beginPath();
            ctx.arc(
              landmark.x * canvas.width,
              landmark.y * canvas.height,
              3,
              0,
              2 * Math.PI
            );
            ctx.fill();
          }
        }
      }
    }

    requestAnimationFrame(detect);
  };

  detect();
}
