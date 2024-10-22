import { _decorator, Component, Node, Label, Color} from 'cc';
const { ccclass, property } = _decorator;

@ccclass
export default class SudokuCell extends Component {
    @property(Label)
    private label: Label = null;

    @property
    public  row: number = 0;

    @property
    public  col: number = 0;

    private value: number = 0;
    private isEditable: boolean = false;

    onLoad() {
        if (this.value !== 0) {
            this.label.string = this.value.toString();
        } else {
            this.label.string = '';
            this.isEditable = true;
        }

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
        const color = (editable) ? new Color(255, 0, 255, 255) : new Color(0, 0, 0, 255);
        this.label.color = color;
    }

    private onCellClick() {
        if (this.isEditable) {
            const newValue = prompt('Enter number in range from 1 to 9');
            const num = parseInt(newValue);
            if (num >= 1 && num <= 9) {
                this.setValue(num);
            }
        }
    }
}
