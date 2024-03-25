import Input from "./Input";

function Label ({
    children,
    id,
}) {
    return (
        <div className="table-results">
            <label>{children}</label>
            <Input id={id} className={"results-input clear"}/>
        </div>
        
    )
};

export default Label;