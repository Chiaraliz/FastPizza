import { Link } from "react-router-dom";

function Button({ children, disabled, to, type }) {
  const base = `text-sm bg-yellow-400 inline-block rounded-full 
            uppercase font-semibold hover:bg-yellow-300 transition-colors
             text-stone-700 focus:outline-none focus:ring focus:ring-yellow-300 
             focus:ring-offset-2 tracking-wide disabled:cursor-not-allowed disabled:bg-gray-300`;

  const styles = {
    primary: base + " py-3 px-4 md:px-6 md:py-4",
    small: base + " py-2 px-4 md: px-5 md:py-2 text-xs",
    secondary: `text-sm py-3 px-4 md:px-6 md:py-4 border-2 border-stone-300 inline-block rounded-full 
            uppercase font-semibold hover:bg-stone-300 hover:text-stone-700 transition-colors
             text-stone-400 focus:outline-none focus:ring focus:ring-stone-200 
             focus:ring-offset-2 tracking-wide disabled:cursor-not-allowed disabled:bg-gray-300`,
  };
  if (to)
    return (
      <Link to={to} className={styles[type]}>
        {children}
      </Link>
    );
  return (
    <button className={styles[type]} disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;
