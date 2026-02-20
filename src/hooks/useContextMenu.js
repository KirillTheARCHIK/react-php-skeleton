import { useEffect, useCallback, useState } from "react";

const useContextMenu = (outerRef, tagElement) => {
  const [contextMenu, setContextMenu] = useState(null);
  const handleContextMenu = useCallback(
    (event) => {
      event.preventDefault();
      if (outerRef) {
        const target = event.target.closest(tagElement);
        if (target) {
          setContextMenu(
            contextMenu === null
              ? {
                  [target.id]: {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6,
                  },
                }
              : null
          );
        }
      } else {
        setContextMenu(null);
      }
    },

    [setContextMenu, outerRef]
  );

  const handleClick = useCallback(() => {
    setContextMenu(null);
  }, [setContextMenu]);

  useEffect(() => {
    if (outerRef && outerRef.current) {
      outerRef.current.addEventListener("click", handleClick);
      outerRef.current.addEventListener("contextmenu", handleContextMenu);
      return () => {
        document.removeEventListener("click", handleClick);
        document.removeEventListener("contextmenu", handleContextMenu);
      };
    }
  }, [outerRef, handleClick, handleContextMenu]);

  return { contextMenu, setContextMenu };
};

export default useContextMenu;
