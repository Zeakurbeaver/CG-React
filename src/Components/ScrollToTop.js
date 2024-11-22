function ScrollToTopComponent() {
    const location = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0); // Scroll to the top whenever the location changes
    }, [location]);
    return null;
  }
  
  // And update where it's used:
  <ScrollToTopComponent /> 
  