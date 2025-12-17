import { useEffect, useRef } from "react";

const MIN_LOADING_TIME = 1000; // Minimum 1 second loading screen

export default function useAllImageLoaded(props: {
  handleAllImagesLoaded: () => void;
}) {
  const { handleAllImagesLoaded } = props;
  const hasTriggered = useRef(false);
  const callbackRef = useRef(handleAllImagesLoaded);
  const mountTimeRef = useRef(Date.now());

  // Keep callback ref up to date without causing effect re-runs
  useEffect(() => {
    callbackRef.current = handleAllImagesLoaded;
  }, [handleAllImagesLoaded]);

  useEffect(() => {
    const triggerCompletion = () => {
      if (hasTriggered.current) return;

      const elapsed = Date.now() - mountTimeRef.current;
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsed);

      if (remainingTime > 0) {
        // Wait for the remaining time before triggering
        setTimeout(() => {
          if (!hasTriggered.current) {
            hasTriggered.current = true;
            callbackRef.current();
          }
        }, remainingTime);
      } else {
        hasTriggered.current = true;
        callbackRef.current();
      }
    };

    // Set a maximum timeout to prevent infinite loading
    const maxTimeout = setTimeout(() => {
      console.log("Loading timeout reached - triggering completion");
      triggerCompletion();
    }, 3000); // 3 second max wait

    const allImages = document.querySelectorAll("img");
    console.log(`Total images found: ${allImages.length}`);

    if (allImages.length === 0) {
      // No images found, trigger after minimum time
      console.log("No images found - triggering completion after minimum time");
      clearTimeout(maxTimeout);
      triggerCompletion();
      return;
    }

    let loadedCount = 0;
    const totalImages = allImages.length;

    const checkAllLoaded = () => {
      loadedCount++;
      console.log(`Image loaded: ${loadedCount}/${totalImages}`);
      if (loadedCount >= totalImages) {
        console.log("All images loaded");
        clearTimeout(maxTimeout);
        triggerCompletion();
      }
    };

    allImages.forEach((img) => {
      // Check if image is already loaded (cached)
      if (img.complete && img.naturalHeight !== 0) {
        checkAllLoaded();
      } else {
        // Add listener for images that haven't loaded yet
        const onLoad = () => {
          checkAllLoaded();
          img.removeEventListener("load", onLoad);
        };
        img.addEventListener("load", onLoad);
      }
    });

    console.log(`Initial check - already loaded: ${loadedCount}/${totalImages}`);

    return () => {
      clearTimeout(maxTimeout);
    };
  }, []); // Empty dependency array - run once on mount
}
