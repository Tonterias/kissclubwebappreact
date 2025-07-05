import { useState } from 'react';


interface DropdownProps {
    options: string[];
    selected: string;
    onSelect: (value: string) => void;
}

const Dropdown = ({ options, selected, onSelect }:DropdownProps) => {
    const [open, setOpen] = useState(false);

    return (
        <div style={{ position: 'relative', width: '100vw' }}>
            <div
                onClick={() => setOpen(!open)}
                style={{
                    border: '1px solid #ccc',
                    padding: '0.5rem',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    backgroundColor: '#f9f9f9',
                    width: '90vw'
                }}
            >
                {selected || 'Select an option'}
            </div>
            {open && (
                <div
                    style={{
                        position: 'absolute',
                        top: '2.5rem',
                        left: 0,
                        width: '50%',
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        zIndex: 1000
                    }}
                >
                    {options.map((option, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                onSelect(option);
                                setOpen(false);
                            }}
                            style={{
                                padding: '0.5rem',
                                cursor: 'pointer',
                                borderBottom: index !== options.length - 1 ? '1px solid #eee' : 'none'
                            }}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
