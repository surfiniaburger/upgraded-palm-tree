const Footer = () => {
    return (
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Grid Layout for Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* MedZK Logo and Description */}
            <div>
              <h3 className="text-xl font-semibold text-white">Zero Kare</h3>
              <p className="mt-4">
                Zero Kare provides privacy-preserving health assessments using cutting-edge zero-knowledge proof technology, ensuring your data stays secure.
              </p>
            </div>
  
            {/* Useful Links */}
            <div>
              <h4 className="text-lg font-medium text-white">Useful Links</h4>
              <ul className="mt-4 space-y-2">
                <li><a href="" className="hover:underline">About Us</a></li>
                <li><a href="" className="hover:underline">Our Services</a></li>
                <li><a href="" className="hover:underline">Blog</a></li>
                <li><a href="" className="hover:underline">Contact</a></li>
              </ul>
            </div>
  
            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-medium text-white">Contact Us</h4>
              <ul className="mt-4 space-y-2">
                <li>Email: <a href="mailto:support@medzk.com" className="hover:underline">support@medzk.com</a></li>
                <li>Phone: <a href="tel:+2347056547253" className="hover:underline">+1 (234) 567-89</a></li>
                <li>Address: 1234 Health Ave, Suite 500, Lagos, Nigeria</li>
              </ul>
            </div>
  
            {/* Social Media Links */}
            <div>
              <h4 className="text-lg font-medium text-white">Follow Us</h4>
              <div className="flex space-x-4 mt-4">
                <a href="" aria-label="Twitter" className="hover:text-white">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.28 4.28 0 001.88-2.36 8.58 8.58 0 01-2.73 1.05 4.27 4.27 0 00-7.28 3.9 12.13 12.13 0 01-8.79-4.45 4.27 4.27 0 001.32 5.7 4.26 4.26 0 01-1.93-.53v.05a4.27 4.27 0 003.43 4.18 4.3 4.3 0 01-1.92.07 4.28 4.28 0 004 2.96A8.58 8.58 0 012 18.2 12.09 12.09 0 008.29 20c7.55 0 11.68-6.25 11.68-11.68l-.01-.53A8.35 8.35 0 0024 5.08a8.49 8.49 0 01-2.54.7z"></path>
                  </svg>
                </a>
                <a href="" aria-label="LinkedIn" className="hover:text-white">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M4.98 3C3.35 3 2 4.35 2 5.98s1.35 2.98 2.98 2.98 2.98-1.35 2.98-2.98S6.61 3 4.98 3zm.02 5.75h-.04C3.47 8.75 3 9.22 3 10.03v10.34c0 .78.48 1.25 1.25 1.25h3.5c.78 0 1.25-.47 1.25-1.25V10.03c0-.82-.47-1.28-1.25-1.28h-3.5zm7.25 0v-.01c-.76 0-1.36.43-1.68 1.03h-.04V9.03c0-.76-.47-1.28-1.25-1.28h-3.5c-.76 0-1.25.47-1.25 1.25V20.5c0 .78.47 1.25 1.25 1.25h3.5c.78 0 1.25-.47 1.25-1.25v-7.31c0-.66.37-1.28 1.01-1.28.62 0 1.01.61 1.01 1.28v7.31c0 .78.47 1.25 1.25 1.25h3.5c.78 0 1.25-.47 1.25-1.25V10.03c0-.82-.47-1.28-1.25-1.28h-3.5z"></path>
                  </svg>
                </a>
                <a href="https://github.com/surfiniaburger/upgraded-palm-tree" aria-label="GitHub" className="hover:text-white">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.11.82-.26.82-.577v-2.21c-3.338.727-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.084-.729.084-.729 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.806 1.304 3.492.998.108-.775.418-1.305.76-1.605-2.665-.305-5.466-1.333-5.466-5.932 0-1.312.467-2.382 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.323 3.301 1.23a11.52 11.52 0 013.003-.403c1.02.005 2.047.137 3.003.404 2.292-1.554 3.298-1.23 3.298-1.23.653 1.653.242 2.873.118 3.176.77.839 1.235 1.91 1.235 3.221 0 4.61-2.802 5.624-5.475 5.921.43.372.823 1.102.823 2.222v3.293c0 .32.218.694.825.576C20.565 22.093 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Footer Bottom */}
          <div className="mt-8 border-t border-gray-800 pt-4 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} MedZK. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  