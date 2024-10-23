import {_decorator, Color, Component, Label, Node, Sprite} from 'cc';
import SudokuGame from './SudokuGame';
import {CellState} from "db://assets/scripts/CellState";

const { ccclass, property } = _decorator;


@ccclass
export default class SudokuCell extends Component {

    @property(Label)
    private label: Label = null;

    @property(Sprite)
    private bgSprite: Sprite = null;


    @property(Color)
    private defaultBgColor: Color = new Color(255, 255, 255);
    @property(Color)
    private defaultTextColor: Color = new Color(255, 255, 255);

    @property(Color)
    private lockedBgColor: Color = new Color(255, 255, 255);
    @property(Color)
    private lockedTextColor: Color = new Color(255, 255, 255);

    @property(Color)
    private selectedBgColor: Color = new Color(255, 255, 255);
    @property(Color)
    private selectedTextColor: Color = new Color(255, 255, 255);

    @property(Color)
    private correctBgColor: Color = new Color(255, 255, 255);
    @property(Color)
    private correctTextColor: Color = new Color(255, 255, 255);

    @property(Color)
    private wrongBgColor: Color = new Color(255, 255, 255);
    @property(Color)
    private wrongTextColor: Color = new Color(255, 255, 255);


    @property
    public  row: number = 0;

    @property
    public  col: number = 0;


    public state: CellState = CellState.None;


    private value: number = 0;
    private isEditable: boolean = false;


    onLoad() {
        this.state = CellState.None;
        this.node.on(Node.EventType.TOUCH_END, this.onCellClick, this);
    }

    public setValue(value: number) {
        this.value = value;
        if (value === 0) {
            this.label.string = '';
        } else {
            this.label.string = value.toString();
        }
    }

    public setEditable(editable: boolean) {
        this.isEditable = editable;
        if (editable) {
            this.state = CellState.Idle;
            this.Unselect();
        } else {
            this.state = CellState.Locked;
            this.SetLockedLayout()
        }
    }

    private onCellClick() {
        // if (this.isEditable) {
            SudokuGame.instance.OnSelectCell(this);
        // }
    }


    private SetLockedLayout()
    {
        this.label.color = this.lockedBgColor;
        this.label.color = this.lockedTextColor;
    }

    public Unselect() {

        if (this.state == CellState.Correct)
        {
            return;
        }

        this.bgSprite.color = this.defaultBgColor;
        this.label.color = this.defaultTextColor;
    }

    public MarkCorrect()
    {
        this.state = CellState.Correct;
        this.bgSprite.color = this.correctBgColor;
        this.label.color = this.correctTextColor;
    }

    public MarkWrong()
    {
        this.state = CellState.Wrong;
        this.bgSprite.color = this.wrongBgColor;
        this.label.color = this.wrongTextColor;
    }

    public Select()
    {
        this.bgSprite.color = this.selectedBgColor;
        this.label.color = this.selectedTextColor;
    }
}
