import {_decorator, Component, instantiate, Label, Node, Prefab, ToggleContainer} from 'cc';
import SudokuCell from './SudokuCell';
import {DifficultInfoProvider} from './DifficultInfoProvider';
import {CellState} from "db://assets/scripts/CellState";
import {NumbersController} from "db://assets/scripts/NumbersController";


const { ccclass, property } = _decorator;

@ccclass
export default class SudokuGame extends Component {
    
    @property(Label)
    private label: Label = null;

    @property(NumbersController)
    private numbersController: NumbersController = null;


    @property(Prefab)
    private cellPrefab: Prefab = null;

    @property(ToggleContainer)
    private difficultyDropdown: ToggleContainer = null;    

    @property(Node)
    private spawnRoot: Node = null;


    @property([Array])
    solution: number[][] = []; // Решение, полученное от сервера


    
    static instance: SudokuGame = null;
    private selectedValue: string = 'Easy';
    private grid: SudokuCell[][] = [];

    onLoad() {

        if (!SudokuGame.instance) {
            SudokuGame.instance = this;
        } else {
            this.node.destroy();
            return;
        }


        this.OnSelectCell(null);
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
                    this.initializeSudoku(data.newboard.grids[0]);
                }
            })
            .catch(error => {
                console.error("Ошибка при получении судоку:", error);
            });
    }

    private initializeSudoku(board: any) {

        this.solution = board.solution;


        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const value = board.value[row][col];
                this.grid[row][col].setValue(value);
                if (value === 0) {
                    this.grid[row][col].setEditable(true);
                } else {
                    this.grid[row][col].setEditable(false);
                }
            }
        }
    }





    private selectedCell: SudokuCell = null;


    public OnSelectCell(cell: SudokuCell) {

        if (cell != null && this.selectedCell == cell)
        {
            this.selectedCell.Unselect();
            this.selectedCell = null;
            this.numbersController.Ready(false);
            return;
        }


        if (this.selectedCell !== null)
        {
            this.selectedCell.Unselect();
        }
        this.selectedCell = null;



        if (cell !== null && (cell.state == CellState.Idle || cell.state == CellState.Wrong))
        {
            this.selectedCell = cell;
            cell.Select();

            this.numbersController.Ready(true);
        }
        else
        {
            this.numbersController.Ready(false);
        }
    }

    setValueAtCurrentCell(number: number) {
        if (this.selectedCell === null)
        {
            return;
        }


        this.selectedCell.setValue(number);

        const currentValue = number;
        const neededValue = this.solution[this.selectedCell.row][this.selectedCell.col];

        if (currentValue == neededValue)
        {
            this.selectedCell.MarkCorrect();
            this.OnSelectCell(null);
        }
        else
        {
            this.selectedCell.MarkWrong();
        }
    }
}
