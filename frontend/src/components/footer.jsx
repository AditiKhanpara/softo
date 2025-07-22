const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          {/* Copyright */}
          <div className="text-sm text-gray-600 mb-4 sm:mb-0">
            © 2025 <span className="font-semibold text-[#800000]/80">SOFTO</span>. All rights reserved.
          </div>

          {/* Developed by */}
          <div className="text-sm text-gray-600">
            Developed by{' '}
            <span className="font-semibold text-[#c79a6f]/80">Endsecure</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
