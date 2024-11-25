export default function Footer() {
    return (
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">About SafeCard AI</h3>
              <p className="text-gray-300 text-sm">
                Advanced fraud detection system powered by machine learning, protecting your transactions in real-time.
              </p>
            </div>
  
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/prediction" className="text-gray-300 hover:text-white transition-colors">
                    Make Prediction
                  </a>
                </li>
                <li>
                  <a href="/retraining" className="text-gray-300 hover:text-white transition-colors">
                    Retrain Model
                  </a>
                </li>
                <li>
                  <a href="/visualizations" className="text-gray-300 hover:text-white transition-colors">
                    View Analytics
                  </a>
                </li>
              </ul>
            </div>
  
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-gray-300">
                  <span className="font-medium">Email:</span> support@safecardai.com
                </li>
                <li className="text-gray-300">
                  <span className="font-medium">Location:</span> African Leadership University
                </li>
              </ul>
            </div>
          </div>
  
          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            <p> {new Date().getFullYear()} SafeCard AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }