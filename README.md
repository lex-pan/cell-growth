# Cell Growth Simulation

Cell Growth Simulation is an interactive web application designed to model and visualize the growth patterns of bacterial colonies within a controlled environment, similar to a petri dish. Developed using **React** and **TypeScript**, the simulation showcases how bacterial cells divide and proliferate over time, adhering to biological growth rules. The interface features a dynamic grid, initially set to a default 20x20 cells, where each cell can either be empty or occupied by a bacterium. Users can interact with the grid to manually place or remove bacterial cells, providing an engaging way to explore and understand colony expansion.

## Features

- **Simulation Control**: Start and pause the simulation with simple controls.
- **Dynamic Grid Size**: Adjust the grid size to observe growth patterns under different spatial constraints.
- **Time Interval Adjustment**: Modify the time interval between cell divisions to see how it affects colony growth.
- **Interactive Grid**: Manually place or remove cells to experiment with different initial conditions.

The simulation follows specific growth rules: cells divide at regular intervals only if there is an adjacent empty space (up, down, left, or right). Users can dynamically change the grid size to explore how colonies grow in various settings. This tool serves as an educational resource, highlighting the principles of bacterial colony growth with simple and intuitive controls, making it accessible for both educational and scientific purposes.

## Project Set Up

To run the app in the development mode:

1. Clone the repository. 
  ```
  https://github.com/lex-pan/cell-growth.git
  ```
2. Install dependencies:
  ```
  npm install
  ```
3. Start the dev server
  ```
  npm start
  ```
Open http://localhost:3000 to view the application in your browser. The page will reload if you make edits, and you will also see any lint errors in the console.

## Project Structure
  ```
  /cell-growth
  │
  ├── /public                # Public files served directly (e.g., index.html, favicon)
  │
  ├── /src                   # Source files for the project
  │   ├── /components        # Reusable components like Cell
  │   ├── App.css            # Global CSS file for app
  │   ├── App.tsx            # Main application component
  │   ├── index.tsx          # Entry point for React application
  │
  ├── package.json           # Project dependencies and scripts
  ├── tsconfig.json          # TypeScript configuration
  ├── .gitignore             # Files and directories to ignore in version control
  └── README.md              # Project documentation and instructions
  ```
### Key Components

1. **App Component (`App.tsx`)**:
   - **Purpose**: The `App` component serves as the central hub of the application, managing the overall state and coordinating interactions between different parts of the simulation.
   - **Key Responsibilities**:
     - **Grid Management**: Initializes and maintains the grid (`petriDish`) representing the petri dish where the simulation occurs. The grid is dynamically updated based on user input and cell growth rules.
     - **Simulation Controls**: Handles the start/pause functionality of the cell division process, controlling the timing of cell growth and updating the grid accordingly.
     - **User Interactions**: Allows users to reset the grid, set the growth interval, and dynamically adjust the number of rows and columns in the grid.

2. **Grid and Cell Management**:
   - **Petri Dish Initialization (`initialDish`)**: A helper function to create the initial grid. It sets up a 2D array of cells, randomly populating a few cells to start the simulation and marking them as active.
   - **Cell Growth Logic (`cellDivision`)**: Manages the rules for how cells divide and spread within the grid. It checks for available adjacent spaces and ensures that cells only divide if there is at least one adjacent empty cell.
   - **Cell Coordinate Utilities**:
     - **`coordinateToString`** and **`stringToCoordinate`**: Utility functions to convert between cell coordinates and string representations. These are used to manage the unique identification of cells within sets for active and used cells.

3. **User Controls and State Management**:
   - **Simulation Control Functions**:
     - **`startPauseCellDivision`**: Toggles the simulation on and off, using a debounced approach to manage the timing of cell divisions.
     - **`resetPetriDish`**: Resets the grid to its initial state and stops the simulation, clearing the current active and used cells.
   - **Dynamic Grid Adjustment**:
     - **`inputRows`** and **`inputColumns`**: Allow users to dynamically change the size of the grid by setting the number of rows and columns. These functions also reset the grid and stop the simulation to accommodate the new dimensions.
   - **Time Interval Setting (`setTimeInterval`)**: Updates the interval at which cells divide, allowing users to control the speed of the simulation.

4. **Cell Component (`Cell.tsx`)**:
   - **Purpose**: Represents a single cell within the grid. It displays the current state of the cell (empty or filled) and responds to user interactions.
   - **Key Responsibilities**:
     - **Display State**: Applies a CSS class based on the cell’s status to visually indicate whether the cell is empty or occupied by a bacterial cell.
     - **Handle Click Events**: Triggers the `changeCell` function when a user clicks on a cell, allowing users to manually place or remove cells from the grid. This interaction provides a way to directly influence the simulation.

### Performance Analysis

#### 1. `startPauseCellDivision`

**Function Overview**:
- This function toggles the simulation's running state.
- It either starts or pauses the cell division process by calling `debouncedContinueCellDivision` or clearing the current timeout, respectively.

**Optimizations**:
- **Frequent State Changes**: Rapid toggling of the simulation state could lead to excessive calls to `debouncedContinueCellDivision`, which is why a debounce feature was introduced so that no unexpected cellDivision would occur.

**Sample Complexity Analysis**:
- Time Complexity: \(O(1)\) for toggling the state and managing the timeout.
- The indirect cost comes from calling `debouncedContinueCellDivision`, whose performance impacts need careful monitoring.

#### 2. `cellDivision`

**Function Overview**:
- Responsible for simulating cell division according to biological rules.
- Identifies potential new growth spots adjacent to active cells.
- Updates the grid state and manages the sets of active and used cells.

**How the function works**:
- **Iteration Over Active Cells**: The function iterates over the current set of active cells (`activeCells.current`) looking for non filled spots.
- **Checking Adjacent Cells**: For each active cell, the function checks up to four adjacent cells to determine potential new growth locations. Then it chooses a random viable direction to fill.

**Optimizations**:
- When a cell has all four directions filled up, it's no longer considered an active cell and is removed from the pool of cells.

**Complexity Analysis**:
- Time Complexity: O(N) where N is the number of active cells
