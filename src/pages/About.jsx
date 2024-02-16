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
            Welcome to CleanSlate, where we make household chores fun and fair!
            Track your tasks, see their value as if they were paid, and compare
            with your partner. Discover a balanced home life with our
            easy-to-use app, designed for teamwork and appreciation. Join us in
            celebrating and equalizing the unseen efforts of home life! Designed
            for two, but functional for one or many, CleanSlate turns the
            often-overlooked unpaid home tasks into something you can track and
            value.
          </p>
          <p className="about-text">
            Here&apos;s how it works: Simply log the time you spend on different
            chores, and voilà! The app calculates what that effort would be
            worth if it were a paid job. You&apos;ll be surprised at how much
            you&apos;re actually contributing to your household!
          </p>
          <p className="about-text">
            It&apos;s not just about numbers though; it&apos;s about
            appreciation. You get to see your own stats and costs, and even
            compare them with your partners. Think of it as a fun and
            eye-opening way to acknowledge each others contributions at home.
          </p>
          <p className="about-text">
            It&apos;s all about making sure everyone feels valued and keeping
            things fair and square at home. Our goal? To nudge couples towards a
            happy, equitable balance in their domestic life. CleanSlate
            isn&apos;t just an app; it&apos;s your partner in fostering great
            conversations and a harmonious home.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
