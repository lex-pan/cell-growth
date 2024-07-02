import React, { act, useRef, useState } from 'react';
import './App.css';
import Cell from './components/cell';

function App() {
  const [numRows, setNumRows] = useState(20);
  const [numColumns, setNumColumns] = useState(20);
  let simulationState = useRef(false);
  let activeCells = useRef<Set<string>>(new Set());
  let usedCells = useRef<Set<string>>(new Set());
  let seconds = useRef(1);
  const [petriDish, setPetriDish] = useState(() => initialDish(numRows, numColumns));  // stops from setting this as the value each and every time, calls once on initialization
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  function initialDish(numRows : number, numColumns : number) : Array<Array<number>> {
      // Create an empty array to hold the rows
      const grid: Array<Array<number>> = [];

      // Loop through the number of rows
      for (let row = 0; row < numRows; row++) {
        // Create a new row with the specified number of columns, initializing with 0
        const currentRow: Array<number> = Array(numColumns).fill(0);
        
        // Add the row to the grid
        grid.push(currentRow);
      }

      for (let i = 0; i < 5; i++) {
        const randomRow = Math.floor(Math.random() * numRows);
        const randomColumn = Math.floor(Math.random() * numColumns);

        grid[randomRow][randomColumn] = 1;
        activeCells.current.add(coordinateToString(randomRow, randomColumn));
      }
      
      // Return the fully populated 2D array
      return grid;
  }

  function cellDivision() : void {
    let newActiveCells : Set<string> = new Set();

    activeCells.current.forEach((activeCell) => {
      let coordinate : [number, number] = stringToCoordinate(activeCell);
      let row = coordinate[0];
      let column = coordinate[1];

      let cellGrowthPossibility : Array<string> = [];
      let moveDirection = [[1,0], [-1,0], [0, 1], [0, -1]];  // represents row up, row down, column right, column left by one 

      for (let i = 0; i < moveDirection.length; i++) {
        if (row + moveDirection[i][0] >= 0 && row + moveDirection[i][0] < numRows && column + moveDirection[i][1] >= 0 && column + moveDirection[i][1] < numColumns) {
          let newCell = coordinateToString(row + moveDirection[i][0], column + moveDirection[i][1]);
          if (!activeCells.current.has(newCell) && !newActiveCells.has(newCell) && !usedCells.current.has(newCell)) {
            cellGrowthPossibility.push(newCell);
          }
        }
      }

      if (cellGrowthPossibility.length > 0) {
        let chosenDirection = Math.floor(Math.random() * cellGrowthPossibility.length);
        newActiveCells.add(cellGrowthPossibility[chosenDirection]);
      } 
      
      if (cellGrowthPossibility.length < 2) {
        let currentCell = coordinateToString(row, column);
        usedCells.current.add(currentCell);
        activeCells.current.delete(currentCell);
      }
    }) 

    let petriDishCopy = [...petriDish];
    newActiveCells.forEach(cell => {
      let coordinate = stringToCoordinate(cell);
      let row = coordinate[0];
      let column = coordinate[1];
      activeCells.current.add(cell);
      petriDishCopy[row][column] = 1;
    })

    setPetriDish(petriDishCopy);
  }

  function coordinateToString(row : number, column : number) {
    return `${row}-${column}`;
  }

  function stringToCoordinate(stringCoord : string) : [number, number] {
    let coordinate = stringCoord.split("-");
    return [parseInt(coordinate[0]), parseInt(coordinate[1])];
  }

  function startPauseCellDivision() {
    simulationState.current = !simulationState.current;
    if (simulationState.current) {
      debouncedContinueCellDivision();
    } else {
      clearTimeout(timeoutRef.current!); // Clear any pending timeouts when simulation stops
    }
  };

  const debouncedContinueCellDivision = () => {
    // Clear previous timeout to debounce rapid calls
    clearTimeout(timeoutRef.current!);

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      if (simulationState.current && activeCells.current.size > 0) {
        cellDivision();
        debouncedContinueCellDivision(); // Recursive call for continued debouncing
      } else {
        simulationState.current = false;
      }
    }, seconds.current * 1000);
  };
  
  function resetPetriDish() {
    activeCells.current = new Set();
    usedCells.current = new Set();
    setPetriDish(initialDish(numRows, numColumns));
    simulationState.current = false;
  }

  function changeCell(coordinate : [number, number]) {
    let petriDishCopy = [...petriDish];
    let row = coordinate[0];
    let column = coordinate[1];
    let coordinateValue = petriDishCopy[row][column];

    if (coordinateValue == 1) {
      petriDishCopy[row][column] = 0;
      let coordinateToRemove = coordinateToString(row, column);
      activeCells.current.delete(coordinateToRemove);
      usedCells.current.delete(coordinateToRemove);
      let moveDirection = [[1,0], [-1,0], [0, 1], [0, -1]];  // represents row up, row down, column right, column left by one 
      
      for (let i = 0; i < moveDirection.length; i++) {
        if (row + moveDirection[i][0] >= 0 && 
          row + moveDirection[i][0] < numRows && 
          column + moveDirection[i][1] >= 0 && 
          column + moveDirection[i][1] < numColumns &&
          petriDish[row + moveDirection[i][0]][column + moveDirection[i][1]] == 1) {
          let newCell = [row + moveDirection[i][0], column + moveDirection[i][1]];
          let newCellToString = coordinateToString(newCell[0], newCell[1]);
          activeCells.current.add(newCellToString);
          usedCells.current.delete(newCellToString);
        }
      }

    } else {
      petriDishCopy[row][column] = 1;
      activeCells.current.add(coordinateToString(row, column));
    }

    setPetriDish(petriDishCopy);
  }

  function setTimeInterval(interval: number) {
    if (isNaN(interval) || interval < 1) {
      seconds.current = 1;
    } else {
      seconds.current = interval;
    }
  }

  function inputRows(rows : number) {
    if (isNaN(rows) || rows > 20) {
      return;
    } else if (rows < 0) {
      setNumRows(0);
    } else {
      setNumRows(rows);
    }

    activeCells.current = new Set();
    usedCells.current = new Set();
    setPetriDish(initialDish(rows, numColumns));
    simulationState.current = false;
  }

  function inputColumns(columns : number) {
    if (isNaN(columns) || columns > 20) {
      return;
    } else if (columns < 0) {
      setNumColumns(0);
    } else {
      setNumColumns(columns);
    }

    activeCells.current = new Set();
    usedCells.current = new Set();
    setPetriDish(initialDish(numRows, columns));
    simulationState.current = false;
  }
    
  return (
    <div className='wrapper'>
      <h1>Cell Growth Stimulation</h1>
      <div className="petri-dish" style={{gridTemplateColumns: `repeat(${numColumns}, 2.066em)`}}>
      {petriDish.map((row, rowIndex) => (
        row.map((column, columnIndex) => (
          < Cell key={`${rowIndex}- ${columnIndex}`} coordinate={[rowIndex, columnIndex]} status={column} changeCell={changeCell}/>
        ))
      ))}
      </div>
      <button onClick={startPauseCellDivision}>Start/Pause</button>
      <button onClick={resetPetriDish}>Reset</button>
      <input type="number" placeholder='Interval' onChange={(e) => setTimeInterval(parseInt(e.target.value))}/>
      <input type="number" placeholder='Row' onChange={(e) => inputRows(parseInt(e.target.value))}/>
      <input type="number" placeholder='Column' onChange={(e) => inputColumns(parseInt(e.target.value))}/>

    </div>
  );
}

export default App;
