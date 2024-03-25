import { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";

function Dropdown ({ data, value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState('');
    const divEl = useRef();
    
    useEffect(() => {
      const handler = (event) => {
          if(!divEl.current) {
              return;
          };

          if(!divEl.current.contains(event.target)) {
              setIsOpen(false);
          };
      };

          document.addEventListener('click', handler, true);

          return () => {
              document.removeEventListener('click', handler);
          };
      }, []);

      const handleClick = () => {
        setIsOpen(!isOpen);
      };

      const handleOptionClick = (option) => {
        setIsOpen(false);
        setSelected(option);
        onChange(option);
    };

      const renderedOptions = data.map((option) => {
        return <div className="hover:bg-sky-100 rounded cursor-pointer p-1" onClick={() => handleOptionClick(option)} key={option}>{option}</div>
      });   

    return (
      <div ref={divEl} className="w-1/2 relative bg-white mx-2">
          <div value={value} className="flex justify-between items-center cursor-pointer border rounded p-3 shadow w-full" onClick={handleClick}>
              {selected || 'Select...'}
              <FaChevronDown />
          </div> 
              {isOpen && (
                <div className="bg-white w-full rounded absolute z-10 top-full">{renderedOptions}</div>
            )} 
      </div>
    )
};

export default Dropdown;