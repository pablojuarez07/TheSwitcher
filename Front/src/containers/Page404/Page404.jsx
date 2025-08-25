import './Page404.css'; 
import cat from '../../assets/img/cat.png';



const Page404 = () => {
  return (
    <div className="not-found-wrapper red">
      <div className="not-found-container brown">
        <h1>404</h1>
        <p>Oops! The page you're looking for doesn't exist.</p>
      </div>
      <img className='img-404' src={cat} alt="" />
    </div>
  );
};

export default Page404;
