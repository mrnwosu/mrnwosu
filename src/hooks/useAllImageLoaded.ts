import { useEffect, useState, useCallback, useRef } from "react";

export default function useAllImageLoaded(props: {
  handleAllImagesLoaded: () => void;
}) {
  const { handleAllImagesLoaded } = props;
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [imagesTotal, setImagesTotal] = useState(0);
  const hasTriggered = useRef(false);

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
    // Set a maximum timeout to prevent infinite loading
    const maxTimeout = setTimeout(() => {
      if (!hasTriggered.current) {
        console.log("Loading timeout reached - triggering completion");
        hasTriggered.current = true;
        handleAllImagesLoaded();
      }
    }, 3000); // 3 second max wait

    const allImages = document.querySelectorAll("img");
    console.log(`Total images found: ${allImages.length}`);

    if (allImages.length === 0) {
      // No images found, trigger immediately
      console.log("No images found - triggering completion immediately");
      hasTriggered.current = true;
      handleAllImagesLoaded();
      clearTimeout(maxTimeout);
      return;
    }

    let loadedCount = 0;
    setImagesTotal(allImages.length);

    allImages.forEach((img) => {
      // Check if image is already loaded (cached)
      if (img.complete && img.naturalHeight !== 0) {
        loadedCount++;
        handleImageLoad(true);
      } else {
        // Add listener for images that haven't loaded yet
        const onLoad = () => {
          handleImageLoad(true);
          img.removeEventListener("load", onLoad);
        };
        img.addEventListener("load", onLoad);
      }
    });

    console.log(`Already loaded images: ${loadedCount}/${allImages.length}`);

    return () => {
      clearTimeout(maxTimeout);
    };
  }, [handleImageLoad, handleAllImagesLoaded]);

  useEffect(() => {
    if (imagesLoaded >= imagesTotal && imagesTotal > 0 && !hasTriggered.current) {
      console.log(`All images loaded: ${imagesLoaded}/${imagesTotal}`);
      hasTriggered.current = true;
      handleAllImagesLoaded();
    }
  }, [imagesLoaded, imagesTotal, handleAllImagesLoaded]);

  return {
    handleImageLoad,
    handleImageLoadEnd,
  };
}
