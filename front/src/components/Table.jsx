import className from "classnames";

function Table ({
    config,
    data,
    primary,
    secondary,
}) {

    const classes = 
        className('table-fixed text-center text-md leading-10 border-collapse w-full  z-10 backdrop-filter backdrop-blur-lg rounded-lg text-gray-600', {
        'bg-white/70': primary,
        'bg-sky-600 text-white': secondary,
        }
    );

    const columns = config.map((column) => {
        if(column.label) {
            return <th className="py-2 px-6" key={column.label}>{column.label}</th>
        }
        return <th key={column.header}></th>
    });

    const rows = data.map((rowData) => {
        const cells = config.map((column) => {
            return <td className="break-words" key={column.label}>{column.render(rowData)}</td>
        });

        return (
            <tr>
                {cells}
            </tr>
            )
        });

    return (   
        <table className={classes}>
            <thead className="shadow-lg rounded-lg p-10 uppercase">
                <tr>{columns}</tr>
            </thead>
           <tbody>
                {rows}
           </tbody>
        </table>
    )
};

export default Table;