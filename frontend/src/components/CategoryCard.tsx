import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
}

const CategoryCard = ({ id, title, description, image, price }: CategoryCardProps) => {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-gray-100">
      {/* Image */}
      <div className="h-56 overflow-hidden relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-3 bg-neru-gold text-white text-xs font-bold px-3 py-1 rounded-full shadow">
          {price}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-neru-darkGray mb-2 group-hover:text-neru-purple transition-colors duration-200">
          {title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{description}</p>
        <Link
          to={`/service/${id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-neru-purple hover:gap-2.5 transition-all duration-200"
        >
          View Details
          <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-neru-purple to-purple-400 group-hover:w-full transition-all duration-400 rounded-b-2xl" />
    </div>
  );
};

export default CategoryCard;
