export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20" data-testid="footer">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Digital Aadhti Blog</h3>
            <p className="text-secondary leading-relaxed">
              Sharing insights about agricultural technology, commission management, and grain market innovations through expert articles and industry updates.
            </p>
          </div>
          <div>
            <h4 className="text-md font-medium text-primary mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-secondary hover:text-primary transition-colors" data-testid="footer-about">About</a></li>
              <li><a href="#" className="text-secondary hover:text-primary transition-colors" data-testid="footer-archive">Archive</a></li>
              <li><a href="#" className="text-secondary hover:text-primary transition-colors" data-testid="footer-contact">Contact</a></li>
              <li><a href="#" className="text-secondary hover:text-primary transition-colors" data-testid="footer-privacy">Privacy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-medium text-primary mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-secondary hover:text-accent transition-colors" data-testid="footer-twitter">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-secondary hover:text-accent transition-colors" data-testid="footer-linkedin">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
              <a href="#" className="text-secondary hover:text-accent transition-colors" data-testid="footer-github">
                <i className="fab fa-github text-xl"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 mt-8 pt-8 text-center">
          <p className="text-secondary">&copy; 2024 Digital Aadhti. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
