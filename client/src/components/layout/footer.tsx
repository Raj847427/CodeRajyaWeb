import { Crown } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center" data-testid="footer-logo">
              <Crown className="w-6 h-6 text-accent-500 mr-2" />
              CodeRajya
            </h3>
            <p className="text-gray-400 text-sm" data-testid="footer-description">
              Jahan har coder banega king. Master coding skills with expert mentors and comprehensive learning modules.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4" data-testid="footer-learn-title">Learn</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/modules" className="hover:text-white transition-colors" data-testid="footer-link-modules">Skill Modules</a></li>
              <li><a href="/interview-prep" className="hover:text-white transition-colors" data-testid="footer-link-interview">Interview Prep</a></li>
              <li><a href="#" className="hover:text-white transition-colors" data-testid="footer-link-challenges">Coding Challenges</a></li>
              <li><a href="#" className="hover:text-white transition-colors" data-testid="footer-link-progress">Progress Tracking</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4" data-testid="footer-community-title">Community</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/mentors" className="hover:text-white transition-colors" data-testid="footer-link-mentors">Find Mentors</a></li>
              <li><a href="/forum" className="hover:text-white transition-colors" data-testid="footer-link-forum">Doubt Forum</a></li>
              <li><a href="#" className="hover:text-white transition-colors" data-testid="footer-link-groups">Study Groups</a></li>
              <li><a href="#" className="hover:text-white transition-colors" data-testid="footer-link-stories">Success Stories</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4" data-testid="footer-support-title">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors" data-testid="footer-link-help">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors" data-testid="footer-link-contact">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors" data-testid="footer-link-privacy">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors" data-testid="footer-link-terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm" data-testid="footer-copyright">
            &copy; 2024 CodeRajya. Built with ❤️ by Developer Raj. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
