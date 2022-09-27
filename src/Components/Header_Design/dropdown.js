import React, {useState} from 'react';
import onClickOutside  from 'react-onclickoutside';
import './style_design.css';


function Dropdown({title, items = []}){

    const [open, setOpen] = useState(false);
    const toggle = () => setOpen(!open); 

    // Nesta função ficarao o tratamento e funcionalidade de todos os botoões
    function handleOnClick(item){}
    
    Dropdown.handleClickOutside = () => setOpen(false);

    return(
        <div className='dd-wrapper'>
            <div
                tabIndex={0} 
                className='dd-header' 
                role='button' 
                onKeyPress={() => toggle(!open)} 
                onClick={() => toggle(!open)} 
            >
                <div className='dd-header-title'>
                    <strong className='dd-header-strong'>{title}</strong>
                </div> 
            </div>
            
            {open &&(
                <ul className='dd-list'>
                    {items.map(item => (
                        <li className='dd-list-item' key={item.id}>
                            <button type='button' onClick={() => handleOnClick(item)}>
                                <strong>{item.value}</strong>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

}

const clickOutsideConfig = {
    handleClickOutside: () => Dropdown.handleClickOutside,
};

export default onClickOutside(Dropdown, clickOutsideConfig);

