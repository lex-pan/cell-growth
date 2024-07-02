interface cellProps {
    coordinate: [number, number];
    status: number;
    changeCell: (coordinate: [number, number]) => void;
}

export default function Cell({coordinate, status, changeCell} : cellProps) {
    return(
        <div className={`cell ${status == 1 ? "filled" : ""}`} onClick={() => changeCell(coordinate)}>
            
        </div>
    )
}