import { _decorator, Component, Node, Prefab, Label, instantiate, ToggleContainer } from 'cc';
import SudokuCell from './SudokuCell';
import { DifficultInfoProvider } from './DifficultInfoProvider';


const { ccclass, property } = _decorator;

@ccclass
export default class SudokuGame extends Component {

    @property(Label)
    private label: Label = null; 


    @property(Prefab)
    private cellPrefab: Prefab = null;

    @property(ToggleContainer)
    private difficultyDropdown: ToggleContainer = null;

    

    @property(Node)
    private spawnRoot: Node = null;


    private selectedValue: string = 'Easy';

    private grid: SudokuCell[][] = [];

    onLoad() {
        this.onToggleContainerChanged();
        this.createGrid();

        const eventHandler = new Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = "SudokuGame";
        eventHandler.handler = "onToggleContainerChanged";

        this.difficultyDropdown.checkEvents.push(eventHandler);
    }


    private onToggleContainerChanged() {
        const toggles = this.difficultyDropdown.toggleItems;
        toggles.forEach(toggle => {
            if (toggle.isChecked) {
                this.selectedValue = toggle.node.getComponent(DifficultInfoProvider).difficult;
                this.label.string = `Current diffucult: ${this.selectedValue}`;

                this.fetchSudokuBoard(this.selectedValue);
            }
        });
    }

    public getSelectedValue(): string {
        return this.selectedValue;
    }


    private createGrid() {
        const size = 9;
        for (let row = 0; row < size; row++) {
            this.grid[row] = [];
            for (let col = 0; col < size; col++) {
                const cellNode = instantiate(this.cellPrefab);
                this.spawnRoot.addChild(cellNode);
                const cell = cellNode.getComponent(SudokuCell);
                cell.row = row;
                cell.col = col;
                this.grid[row][col] = cell;
            }
        }
    }


    private fetchSudokuBoard(difficulty: string) {
        const url = `https://sudoku-api.vercel.app/api/dosuku?difficulty=${difficulty}`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.newboard && data.newboard.grids.length > 0) {
                    const board = data.newboard.grids[0].value;
                    this.initializeSudoku(board);
                }
            })
            .catch(error => {
                console.error("Ошибка при получении судоку:", error);
            });
    }

    private initializeSudoku(board: number[][]) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const value = board[row][col];
                this.grid[row][col].setValue(value);
                if (value === 0) {
                    this.grid[row][col].setEditable(true);
                } else {
                    this.grid[row][col].setEditable(false);
                }
            }
        }
    }
}
