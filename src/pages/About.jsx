import { useUpdateBodyClass } from "../hooks/useUpdateBodyClass";
import "./pagestyles/about.css";

const AboutPage = () => {
  useUpdateBodyClass("/about");
  return (
    <div id="aboutPage" className="page-container">
      <div className="content-container_about">
        <div className="header-wrapper_about">
          <h1 className="header_about">Welcome to CleanSlate</h1>
        </div>
        <div className="text-wrapper_about">
          <p className="about-text">
            Welcome to CleanSlate, where household chores become fun and fair!
            Track your tasks, see their value as if they were paid, and foster
            better communication with your partner. Our user-friendly app
            celebrates and acknowledges the often unseen efforts of home life,
            promoting teamwork and appreciation.
          </p>
          <p className="about-text">
            Simply log the time you spend on chores, and the app calculates what
            that effort would be worth if it were a paid job. You’ll be amazed
            at your actual contributions! More than just numbers, CleanSlate is
            about understanding and appreciating each other's efforts. View your
            stats, compare them with your partner’s, and use this insight to
            have meaningful conversations about household responsibilities.
          </p>
          <p className="about-text">
            Our goal is to ensure everyone feels valued and to facilitate open,
            honest communication at home. Designed for two but functional for
            one or many, CleanSlate helps couples achieve a harmonious balance
            in their domestic life. CleanSlate isn’t just an app; it’s your
            partner in fostering great conversations and a more connected home.
          </p>
          <p className="about-text PATCHNOTES">
            Patch Notes 17.06.2024
            <br />
            Updating Layout and Households, adding new features and fixing bugs.
            Application may be partially unavailable during the update, until
            20.06.2024.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
