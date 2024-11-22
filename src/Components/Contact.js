import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
 
const About = () => {
  const location = useLocation();  // Use the location hook to track route changes

  // Scroll to the top whenever the location changes
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, [location]);  // Dependency on location to trigger on route change

  return <div>About Page Content</div>;
};

export default About;
