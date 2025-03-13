import { useEffect, useState } from "react";

export default function useAllImageLoaded(props: {
  handleAllImagesLoaded: () => void;
}) {
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [imagesTotal, setImagesTotal] = useState(0);

  const handleImageLoad = (isLoaded: boolean) => {
    const newCount = imagesLoaded + (isLoaded ? 1 : 0);
    console.log(`Image loaded: ${newCount}/${imagesTotal}`);
    setImagesLoaded((prev) => prev + (isLoaded ? 1 : 0));
  };

  const handleImageLoadEnd = () => {
    setImagesTotal((prev) => prev + 1);
  };

  useEffect(() => {
    console.log({imagesLoaded, imagesTotal});
    const allImages = document.querySelectorAll("img");
    setImagesTotal(allImages.length);
    allImages.forEach((img) => {
      img.addEventListener("load", () => handleImageLoad(true));
    });

    
  }, []);

  useEffect(() => {
    if (imagesLoaded >= imagesTotal && imagesTotal > 0) {
      props.handleAllImagesLoaded();
    }
  }, [imagesLoaded, imagesTotal]);

  return {
    handleImageLoad,
    handleImageLoadEnd,
  };
}
