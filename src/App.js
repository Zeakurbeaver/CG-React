import React, { useEffect, useRef, useState } from 'react'; 
import './App.css'; 
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom'; 
import { gsap } from 'gsap'; 
import { ScrollTrigger } from 'gsap/ScrollTrigger'; 
import About from './Components/About';
import Contact from './Components/Contact';
import Donate from './Components/Donate';
 

gsap.registerPlugin(ScrollTrigger);

function NewSection() {
  const videoRef = useRef(null); 
  const textRef = useRef(null); 

  useEffect(() => {
    const video = videoRef.current;
    const text = textRef.current;
    const initialClipPath = 'inset(30% 32% 46% 33%)';
    const finalClipPath = 'inset(-55% -55% -55% -55%)';
    
    video.pause();
    gsap.set(video, { clipPath: initialClipPath });

    // Only apply ScrollTrigger to content below header (not the header itself)
   const imgTimeline = gsap.timeline({
  scrollTrigger: {
    id: "imgzoom",
    trigger: video,
    start: '45% center',
    end: 'bottom+=50% top',
    scrub: 0.5,
    pin: true,  // This only pins the video, not the header
    toggleActions: "play none play pause",
    markers: false,
   
    ease: "power1.ease",
    onEnter: () => video.play(),
    onLeaveBack: () => video.pause(),
  },
});


    imgTimeline.to(video, {
      scale: 1.4,
      clipPath: finalClipPath,
      duration: 0.2,
    });

    gsap.fromTo(
      text,
      { opacity: 0 },
      {
        opacity: 1,
        duration: .1,
        scrollTrigger: {
          trigger: ".App-Zoom",
          start: '70% 15%',
          end: '80% 5%',
          scrub: true,
          toggleActions: "play none reverse none",
          markers: false,
          onLeaveBack: () => {
            gsap.to(text, { opacity: 0, duration: 0.1 }); // Faster fade-out
          },
          
        }
      }
    );

    return () => {
      ScrollTrigger.getById("imgzoom")?.kill();
    };
  }, []);

  return (
    <section className="section">
      <div className="wrapper">
        <div className="App-Zoom">
          <video
            className="Img video-1"
            ref={videoRef}
            muted
            loop
          >
            <source src="appzoomvideo.mp4" type="video/mp4" />
          </video>
          <div ref={textRef} className="fade-text">
            Start Your Journey Here
          </div>
        </div>
      </div>
    </section>
  );
}

function NewSection2() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    // Initial pause to avoid playing on load
    video.pause();

    // Function to handle fade-out and reset
    const resetVideo = () => {
      gsap.to(video, {
        opacity: 0,
        duration: 1, // Duration for the fade-out
        onComplete: () => {
          video.currentTime = 0;  // Reset video position to the beginning
          video.pause();  // Ensure video is paused after resetting
        },
      });
    };

    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: video,
      start: 'center center',  // Start the trigger when the video reaches the center
      end: '120% 5%',  // ScrollTrigger ends when the video is at the bottom
      scrub: false,  // Don't use scrub as we're controlling time manually
      pin: true,  // Pin the video during scroll
      markers: false,  // Set to true for debugging

      // Play video forward on scroll down
      onEnter: () => {
        video.play();
        gsap.to(video, { opacity: 1, duration: 1 });  // Fade in when video starts playing
      },

      onLeaveBack: () => {
        // Wait until the fade is complete before pausing and resetting
        gsap.to(video, {
          opacity: 0,
          duration: 1,
          onComplete: () => {
            video.play();
            video.currentTime = 0;  // Reset only after the fade-out is complete
             
          },
        });
      },

      // Make sure to play the video when it re-enters the scroll trigger (even after fading out)
      onEnterBack: () => {
          // Ensure the video plays when it re-enters
        gsap.to(video, { opacity: 1, duration: 1 });  // Fade in again when re-entering
      }
    });

    // Cleanup ScrollTrigger instance on unmount
    return () => {
      scrollTriggerInstance.kill();
    };
  }, []);

  return (
    <section className="additional-section">
      <div className="wrapper-2">
        <video
          className="Video-2"
          ref={videoRef}
          src="Text-video-1.mp4"
          type="video/mp4"
        />
      </div>
    </section>
  );
}

function NewSection3() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Select all the grid items
    const gridItems = document.querySelectorAll('.grid-container .grid-item');

    gsap.fromTo(
      gridItems,
      { opacity: 0, visibility: "hidden" },
      {
        rotation: 360,
        opacity: 1,
        visibility: "visible", // Set visibility to visible on animation start
        duration: 10,
        ease: "power2.inOut", // A smoother, more gradual easing for the rotation
        scrollTrigger: {
          trigger: '.grid-item-1',
          start: '0% 65%',
          end: '65% 50%',
          scrub: true,
          markers: false,
          toggleActions: 'play reverse play reverse',
          onEnterBack: () => {
            resetText();
          },
          onLeaveBack: () => {
            resetText();
          },
        },
      }
    );

 
    
    const handleMouseEnter = (event) => {
      const image = event.target;
    
      // Track the mouse position and apply hover effect only while hovering
      const handleMouseMove = (e) => {
        const { left, top, width, height } = image.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
    
        const moveX = deltaX / 20;
        const moveY = deltaY / 20;
    
        // Only change position on hover without affecting the rotation path
         
        image.style.transform = `translateY(-10px) translate(${moveX}px, ${moveY}px)`;
      };
    
  
      image.addEventListener('mousemove', handleMouseMove);
    
      image.addEventListener('mouseleave', () => {
        // Reset the hover transform when mouse leaves
        image.style.transform = 'translateY(-10px) translate(0, 0)';
        image.removeEventListener('mousemove', handleMouseMove);
    
        // Optionally, if needed, reset GSAP animation here if it doesn't resume correctly
        gsap.set(image, { rotation: 0 }); // Reset rotation
      
      });
    };
    
    // Apply event listeners to all grid items
    gridItems.forEach((item) => {
      item.addEventListener('mouseenter', handleMouseEnter);
    });
    
    // Add event listener for clicks outside grid items
    const handleClickOutside = (e) => {
      if (!e.target.closest('.grid-container')) {
        resetAll();
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    

    // Select the background video
    const video = document.querySelector('.background-video');

    // Set initial video state
    video.pause();
    video.currentTime = 0;

    let isPlaying = false;

    // GSAP ScrollTrigger for background video
    ScrollTrigger.create({
      trigger: '.section-grid',
      start: '-10% 65%',
      end: '0% 50%',
      scrub: true,
     
      onEnter: () => {
        if (!isPlaying) {
          video.play();
          gsap.to(video, { opacity: 1, duration: 1 });
          isPlaying = true;
        }
      },
      onLeaveBack: () => {
        // Wait until the fade is complete before pausing and resetting
        gsap.to(video, {
          opacity: 0,
          duration: 1,
          onComplete: () => {
            video.play();
            video.currentTime = 0;  // Reset only after the fade-out is complete
            isPlaying = false;
            
          },
      
        });
     
      },
      markers: false,
    });
    // Clean up event listeners on unmount
    return () => {
      gridItems.forEach((item) => {
        item.removeEventListener('mouseenter', handleMouseEnter);
      });
    };
  }, []);

  // Reset text opacity when leaving the viewport
 
 

const resetAll = () => {
  const gridItems = document.querySelectorAll('.grid-container .grid-item');
  const textItems = document.querySelectorAll('.text-item');

  // Reset all images to full opacity
  gridItems.forEach((item) => {
    gsap.to(item, { opacity: 1, duration: 0.5 });
  });

  // Reset all text items to hidden
  textItems.forEach((text) => {
    gsap.to(text, { opacity: 0, duration: 0.5 });
  });
};

const handleImageClick = (index) => {
  const gridItems = document.querySelectorAll('.grid-container .grid-item');
  const textItems = document.querySelectorAll('.text-item');

  // Fade out all images except the clicked one
  gridItems.forEach((item, i) => {
    if (i === index) {
      gsap.to(item, { opacity: 1, duration: 0.5 });
    } else {
      gsap.to(item, { opacity: 0, duration: 0.5 });
    }
  });

  // Show the corresponding text
  textItems.forEach((text, i) => {
    if (i === index) {
      gsap.to(text, { opacity: 1, duration: 0.5 });
    } else {
      gsap.to(text, { opacity: 0, duration: 0.5 });
    }
  });
};
const resetText = () => {
  const textItems = document.querySelectorAll('.text-item');

  // Reset all text items to hidden
  textItems.forEach((text) => {
    gsap.to(text, { opacity: 0, duration: 0.5 });
  });
};



  return (
  <section className="section-grid">
      <div className="background-video-container">
        <video className="background-video" muted>
          <source src="BG-Trees(12).mp4" type="video/mp4" />
        </video>
      </div>
      <div className="grid-container">
        <div
          className="grid-item grid-item-1"
          onClick={() => handleImageClick(0)}
        >
          <img src="1.png" alt="Image 1" />
        </div>
        <div
          className="grid-item grid-item-2"
          onClick={() => handleImageClick(1)}
        >
          <img src="2.png" alt="Image 2" />
        </div>
        <div
          className="grid-item grid-item-3"
          onClick={() => handleImageClick(2)}
        >
          <img src="3.png" alt="Image 3" />
        </div>
        <div
          className="grid-item grid-item-4"
          onClick={() => handleImageClick(3)}
        >
          <img src="4.png" alt="Image 4" />
        </div>
        <div className="text-item text-item-1" style={{ opacity: 0 }}>
          Text 1
        </div>
        <div className="text-item text-item-2" style={{ opacity: 0 }}>
          Text 2
        </div>
        <div className="text-item text-item-3" style={{ opacity: 0 }}>
          Text 3
        </div>
        <div className="text-item text-item-4" style={{ opacity: 0 }}>
          Text 4
        </div>
      </div>
    </section>
  );
}


function NewSection4() {
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Create a new GSAP timeline and ScrollTrigger instance
    const tlHero = gsap.timeline({
      scrollTrigger: {
        trigger: ".Section-hero-3", // Trigger element
        start: "center center", // Start when the section center reaches viewport center
        end: "1500rem top", // End when the section top reaches 1500rem from top of viewport
        scrub: true, // Smooth scrubbing effect
        pin: true, // Pin the section during animation
        pinSpacing: true,
        markers: false, // Enable markers for debugging
      },
    });

    // Sequentially fade in images, then fade them out in reverse as the scroll progresses
    tlHero
      .set(".carousel-image", { opacity: 0, zIndex: 0 }) // Set initial opacity and stacking
      .set(".carousel-image:first-child", { opacity: 1, zIndex: 1 }) // Show the first image
      .to(".carousel-image", {
        opacity: 1, // Fade in the images
        zIndex: 1, // Bring the image to the front
        stagger: {
          each: 5, // Duration per image
        },
        duration: 2.5, // How quickly each fade-in happens
      })
      .to(".carousel-image", {
        opacity: 0, // Fade out the images when scrolling back
        zIndex: 0, // Send the images back
        stagger: {
          each: 5, // Duration per image
        },
        duration: 2.5, // How quickly each fade-out happens
      });

    // Cleanup on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
  return (
    <section className="Section-hero-3">
      <div className="hero-3">
        <section className="carousel-container" id="carousel">
          <img
            className="carousel-image"
            id="image1"
            src="cara-1.png"
            alt="Image 1"
          />
          <img className="carousel-image" id="image2" src="cara-2.png" alt="Image 2" />
          <img className="carousel-image" id="image3" src="cara-3.png" alt="Image 3" />
          <img className="carousel-image" id="image4" src="cara-4.png" alt="Image 4" />
        </section>
      </div>
    </section>
  );
}




function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top whenever the location changes
  }, [location]);

  return null;
}

function App() {
  const [scrollingUp, setScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < lastScrollY) {
        setScrollingUp(true); // Scrolling up
      } else if (window.scrollY > lastScrollY) {
        setScrollingUp(false); // Scrolling down
      }

      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    // Scroll to top on refresh or initial load
    if (window.scrollY === 0) {
      setScrollingUp(true);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);
  return (
    <Router>
          <ScrollToTop /> {/* This component will trigger scroll to top on route change */}
      <div className="App">
        <header id="main-header" className={scrollingUp ? 'show' : 'hide'}>
          <div className="header-content">
            <div className="logo">
              <Link to="/">
                <img src="CG Logo-01.jpg" alt="Logo" />
              </Link>
            </div>
            <nav className="nav-container">
              <Link className="header-menu" to="/">Home</Link>
              <Link className="header-menu" to="/About">About</Link>
              <Link className="header-menu" to="/Contact">Contact</Link>
              <Link className="header-menu" to="/Donate">Donate</Link>
            </nav>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={
              <>
                <NewSection />
                <NewSection2 />
                <NewSection3 />  
                <NewSection4 />
              </>
            } />
            <Route path="/About" element={<About />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/Donate" element={<Donate />} />
          </Routes>
        </main>

        <footer id="main-footer">
          <div className="footer-content">
            <div className="footer-info">
              <p>&copy; 2024 Your Company. All rights reserved.</p>
              <p>Follow us on social media:</p>
              <div className="footer-icons">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
 
}


export default App;