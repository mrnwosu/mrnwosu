import { useEffect, useState, useCallback } from "react";

export default function useAllImageLoaded(props: {
  handleAllImagesLoaded: () => void;
}) {
  const { handleAllImagesLoaded } = props;
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [imagesTotal, setImagesTotal] = useState(0);

  const handleImageLoad = useCallback((isLoaded: boolean) => {
    setImagesLoaded((prev) => {
      const newCount = prev + (isLoaded ? 1 : 0);
      console.log(`Image loaded: ${newCount}`);
      return newCount;
    });
  }, []);

  const handleImageLoadEnd = useCallback(() => {
    setImagesTotal((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const allImages = document.querySelectorAll("img");
    setImagesTotal(allImages.length);
    allImages.forEach((img) => {
      img.addEventListener("load", () => handleImageLoad(true));
    });
  }, [handleImageLoad]);

  useEffect(() => {
    if (imagesLoaded >= imagesTotal && imagesTotal > 0) {
      handleAllImagesLoaded();
    }
  }, [imagesLoaded, imagesTotal, handleAllImagesLoaded]);

  return {
    handleImageLoad,
    handleImageLoadEnd,
  };
}
