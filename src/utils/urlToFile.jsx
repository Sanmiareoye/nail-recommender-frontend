async function urlToFile(imgUrl) {
  const res = await fetch(imgUrl);
  const blob = await res.blob();
  return new File([blob], "image.jpg", { type: blob.type });
}

export default urlToFile;
