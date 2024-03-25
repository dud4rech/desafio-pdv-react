import className from "classnames";

function Button ({
    children,
    id,
    primary,
    secondary,
    action,
    icon,
    picker,
    ...rest
 }) {
    const classes = 
        className(rest.className, 'flex justify-center font-medium transform ease-in duration-200', {
        'border-sky-700 border-2 bg-sky-700 text-white rounded hover:bg-green-500 hover:border-green-500 hover:shadow-lg items-center uppercase py-1.5 px-5 mt-2 w-full': primary,
        'border-2 text-white rounded hover:bg-slate-400 hover:shadow-lg items-center uppercase py-1.5 px-5 mt-2': secondary,
        'bg-amber-600 text-white rounded-full hover:bg-green-500 hover:shadow-lg px-4 py-2': action,
        'transform ease-in duration-200 hover:scale-110 mx-3 py-1 px-5': icon,
        'bg-transparent items-center': picker,
        }
    );

    return (
        <div>
            <button {...rest} id={id} className={classes}>{children}</button>
        </div>
    )
};

export default Button;