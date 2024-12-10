import { useNavigate } from "react-router-dom";

/**
Fs
 * @returns {Function} 
 */
const useNavigation = () => {
  const navigate = useNavigate();

  /**
   * Navigate to a specified path.
   * @param {string} path
   */
  const navigateTo = (path) => {
    navigate(path);
  };

  return navigateTo;
};

export default useNavigation;
