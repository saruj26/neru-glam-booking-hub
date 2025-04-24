
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

interface CategoryCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
}

const CategoryCard = ({ id, title, description, image, price }: CategoryCardProps) => {
  return (
    <Card className="overflow-hidden card-hover">
      <div className="h-60 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-neru-purple">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-neru-gold font-semibold">{price}</span>
          <Button className="bg-neru-purple hover:bg-purple-600 text-white">
            <Link to={`/services/${id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
