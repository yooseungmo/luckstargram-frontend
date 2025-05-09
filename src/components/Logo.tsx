import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex justify-center items-center">
      <img 
        src="/logo.png" 
        alt="LuckStargram" 
        className="h-12 w-auto"
      />
    </Link>
  );
};

export default Logo; 