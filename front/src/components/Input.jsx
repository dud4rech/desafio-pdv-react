import className from "classnames";

function Input ({
    id,
    type,
    placeholder,
    min,
    step,
    pattern,
    primary, 
    secondary,
    ...rest
}) {
    const classes = 
        className(rest.className, 'rounded p-3 w-1/2 transform ease-in duration-200 ', {
        'mx-2 hover:bg-slate-200 shadow': primary,
        'rounded text-center': secondary,
        }
    );
    
    return (
        <input {...rest} id={id} type={type} placeholder={placeholder} min={min} step={step} pattern={pattern} className={classes} required></input>
    )
};

export default Input;