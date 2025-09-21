import { queryElement } from '$utils/queryElement';
import { queryElements } from '$utils/queryElements';
import { scrollControl } from '$utils/scrollControl';

export const team = (): void => {
  const navs = document.querySelectorAll<HTMLElement>('.nav_component');

  const attrKey = 'data-team';
  const attrKeyImage = 'data-team-image';
  const attrValues = {
    card: 'card',
    popup: 'popup',
    popupTrigger: 'popup-trigger',
    popupClose: 'popup-close',
    imageStart: 'start',
    imageEnd: 'end',
  };

  const popups = queryElements<HTMLElement>(`[${attrKey}=${attrValues.popup}]`);
  const cards = queryElements<HTMLElement>(`[${attrKey}=${attrValues.card}]`);

  cards.forEach((card, index) => {
    const popup = popups[index];
    const popupClose = queryElement<HTMLElement>('button', popup);
    const popupTriggers = queryElements<HTMLElement>(
      `[${attrKey}=${attrValues.popupTrigger}]`,
      card
    );

    const startContainer = queryElement<HTMLElement>(
      `[${attrKeyImage}=${attrValues.imageStart}]`,
      card
    );
    const endContainer = queryElement<HTMLElement>(
      `[${attrKeyImage}=${attrValues.imageEnd}]`,
      popup
    );

    // Get the actual image element from the start container
    const image = queryElement<HTMLImageElement>('img', startContainer);

    if (
      !popup ||
      !popupTriggers.length ||
      !popupClose ||
      !startContainer ||
      !endContainer ||
      !image
    ) {
      return;
    }

    let isAnimating = false;

    popupTriggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;

        try {
          // Get the bounds of the image in its current position
          const startBounds = image.getBoundingClientRect();

          // Prevent smooth scrolling
          scrollControl.disable();

          // Show popup with opacity 0 to calculate end position
          popup.style.display = 'flex';
          popup.style.opacity = '0';

          // Get the bounds of where the image should end up
          const endBounds = endContainer.getBoundingClientRect();

          // Create a clone of the image for animation
          const clone = image.cloneNode(true) as HTMLImageElement;

          // Reset clone styles and position at start position
          clone.style.cssText = '';
          clone.style.position = 'fixed';
          clone.style.left = startBounds.left + 'px';
          clone.style.top = startBounds.top + 'px';
          clone.style.width = startBounds.width + 'px';
          clone.style.height = startBounds.height + 'px';
          clone.style.zIndex = '9999';
          clone.style.margin = '0';
          clone.style.padding = '0';
          clone.style.transform = 'none';
          clone.style.objectFit = 'cover';
          document.body.appendChild(clone);

          // Hide original image
          image.style.opacity = '0';

          // Move the actual image to the end container and set it to fill
          endContainer.appendChild(image);
          image.style.opacity = '1';
          image.style.visibility = 'hidden';
          image.style.width = '100%';
          image.style.height = '100%';
          image.style.objectFit = 'cover';

          // Create timeline for coordinated animations
          const tl = gsap.timeline();

          // Animate popup opacity from 0 to 1
          tl.to(
            popup,
            {
              opacity: 1,
              duration: 0.8,
              ease: 'power2.inOut',
            },
            0
          );

          // Animate nav opacity from 1 to 0
          if (navs) {
            tl.to(
              navs,
              {
                opacity: 0,
                duration: 0.8,
                ease: 'power2.inOut',
                onComplete: () => {
                  navs.forEach((nav) => {
                    nav.style.display = 'none';
                  });
                },
              },
              0
            );
          }

          // Animate clone to end position
          tl.fromTo(
            clone,
            {
              // Starting position (grid position)
              left: startBounds.left,
              top: startBounds.top,
              width: startBounds.width,
              height: startBounds.height,
            },
            {
              // Ending position (popup position)
              duration: 0.8,
              left: endBounds.left,
              top: endBounds.top,
              width: endBounds.width,
              height: endBounds.height,
              ease: 'power2.inOut',
              onComplete: () => {
                // Remove clone and show actual image
                clone.remove();
                image.style.visibility = 'visible';
                isAnimating = false;
              },
            },
            0 // Start at the same time as popup fade
          );
        } catch (error) {
          console.error('Error during opening animation:', error);
          isAnimating = false;
          popup.style.display = 'flex';
          popup.style.opacity = '1';
          // Ensure smooth scrolling is stopped even on error
          scrollControl.disable();
        }
      });
    });

    popupClose.addEventListener('click', () => {
      if (isAnimating) return;
      isAnimating = true;

      try {
        // The image should now be in the endContainer
        const currentImage = queryElement<HTMLImageElement>('img', endContainer);
        if (!currentImage) {
          popup.style.display = 'none';
          isAnimating = false;
          return;
        }

        // Get bounds BEFORE hiding anything
        const endBounds = currentImage.getBoundingClientRect();
        const startBounds = startContainer.getBoundingClientRect();

        // Create clone for animation
        const clone = currentImage.cloneNode(true) as HTMLImageElement;
        clone.style.cssText = '';
        clone.style.position = 'fixed';
        clone.style.zIndex = '9999';
        clone.style.pointerEvents = 'none';
        clone.style.margin = '0';
        clone.style.padding = '0';
        clone.style.transform = 'none';
        clone.style.objectFit = 'cover';
        document.body.appendChild(clone);

        // Hide image but keep popup visible for fade animation
        currentImage.style.visibility = 'hidden';

        // Move the actual image back to start container and reset size
        startContainer.appendChild(currentImage);
        currentImage.style.width = '';
        currentImage.style.height = '';
        currentImage.style.objectFit = '';

        // Create timeline for coordinated animations
        const tl = gsap.timeline({
          onComplete: () => {
            clone.remove();
            currentImage.style.visibility = 'visible';
            currentImage.style.opacity = '1';
            popup.style.display = 'none';
            // Re-enable smooth scrolling after animation completes
            scrollControl.enable();
            isAnimating = false;
          },
        });

        // Animate popup opacity from 1 to 0
        tl.to(
          popup,
          {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          0
        );

        // Animate nav opacity from 0 to 1
        if (navs) {
          tl.to(
            navs,
            {
              onStart: () => {
                navs.forEach((nav) => {
                  nav.style.removeProperty('display');
                });
              },
              opacity: 1,
              duration: 0.8,
              ease: 'power2.inOut',
            },
            0
          );
        }

        // Animate clone back to start position
        tl.fromTo(
          clone,
          {
            // Starting position (popup position)
            left: endBounds.left,
            top: endBounds.top,
            width: endBounds.width,
            height: endBounds.height,
          },
          {
            // Ending position (grid position)
            duration: 0.8,
            left: startBounds.left,
            top: startBounds.top,
            width: startBounds.width,
            height: startBounds.height,
            ease: 'power2.inOut',
          },
          0 // Start at the same time as popup fade
        );
      } catch (error) {
        console.error('Error during closing animation:', error);
        popup.style.display = 'none';
        if (image) {
          image.style.opacity = '1';
          image.style.visibility = 'visible';
        }
        // Re-enable smooth scrolling on error
        scrollControl.enable();
        isAnimating = false;
      }
    });
  });
};
