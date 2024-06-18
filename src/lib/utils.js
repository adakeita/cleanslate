export const getCurrentDayAndDate = () => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date().toLocaleDateString("en-us", options);
};

import avatar1 from "../assets/avatar/avatar1.png";
import avatar2 from "../assets/avatar/avatar2.png";
import avatar3 from "../assets/avatar/avatar3.png";
import avatar4 from "../assets/avatar/avatar4.png";
import avatar5 from "../assets/avatar/avatar5.png";
import avatar6 from "../assets/avatar/avatar6.png";
import alternateAvatar1 from "../assets/avatar/alternate-avatar1.png";
import alternateAvatar2 from "../assets/avatar/alternate-avatar2.png";

const localAvatars = {
  "/src/assets/avatar/avatar1.png": avatar1,
  "/src/assets/avatar/avatar2.png": avatar2,
  "/src/assets/avatar/avatar3.png": avatar3,
  "/src/assets/avatar/avatar4.png": avatar4,
  "/src/assets/avatar/avatar5.png": avatar5,
  "/src/assets/avatar/avatar6.png": avatar6,
  "/src/assets/avatar/alternate-avatar1.png": alternateAvatar1,
  "/src/assets/avatar/alternate-avatar2.png": alternateAvatar2,
};

export const getAvatarPath = (path) => {
  return localAvatars[path] || path;
};
