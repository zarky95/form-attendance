import { Link } from "wouter";

export default function Footer() {
  const categories = [
    "Dog Grooming",
    "Pet Training", 
    "Veterinary Care",
    "Pet Photography",
    "Pet Boarding",
  ];

  const supportLinks = [
    "Help Center",
    "Contact Us", 
    "Submit Portfolio",
    "Privacy Policy",
    "Terms of Service",
  ];

  return (
    <footer className="bg-pet-charcoal text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <i className="fas fa-paw text-pet-orange text-2xl mr-2"></i>
              <span className="font-poppins font-bold text-xl">PetFolio</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Discover and share amazing pet care portfolios. Connect with professionals and get inspired by beautiful case studies from around the world.
            </p>
            <div className="flex space-x-4">
              <button className="text-gray-400 hover:text-pet-orange transition-colors" data-testid="social-facebook">
                <i className="fab fa-facebook-f text-xl"></i>
              </button>
              <button className="text-gray-400 hover:text-pet-orange transition-colors" data-testid="social-instagram">
                <i className="fab fa-instagram text-xl"></i>
              </button>
              <button className="text-gray-400 hover:text-pet-orange transition-colors" data-testid="social-twitter">
                <i className="fab fa-twitter text-xl"></i>
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-poppins font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2 text-gray-300">
              {categories.map((category) => (
                <li key={category}>
                  <a 
                    href="#" 
                    className="hover:text-pet-orange transition-colors"
                    data-testid={`footer-category-${category.toLowerCase().replace(' ', '-')}`}
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-poppins font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-gray-300">
              {supportLinks.map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="hover:text-pet-orange transition-colors"
                    data-testid={`footer-support-${link.toLowerCase().replace(' ', '-')}`}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; 2024 PetFolio. All rights reserved. Made with{" "}
            <i className="fas fa-heart text-pet-coral"></i> for pet lovers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
