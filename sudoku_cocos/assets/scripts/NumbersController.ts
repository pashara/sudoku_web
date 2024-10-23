import { _decorator, Component, Node, Button, Label, EventHandler } from 'cc';
import SudokuGame from "db://assets/scripts/SudokuGame";
const { ccclass, property } = _decorator;

@ccclass('NumbersController')
export class NumbersController extends Component {


    @property(Button)
    buttons: Button[] = []; // Префаб кнопки с числом

    
    start() {
        this.createNumberButtons();
    }

    createNumberButtons() {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        numbers.forEach(number => {
            const button = this.buttons[number - 1];
            button.getComponentInChildren(Label).string = number.toString();

            const clickEventHandler = new EventHandler();
            // This node is the node to which your event handler code component belongs
            clickEventHandler.target = this.node;
            // This is the script class name
            clickEventHandler.component = 'NumbersController';
            clickEventHandler.handler = 'callback';
            clickEventHandler.customEventData = `${number}`;

            button.clickEvents.push(clickEventHandler);
        });
    }


    callback (event: Event, customEventData: string) {
        
        this.onNumberButtonClick(Number.parseInt(customEventData))
    }


    onNumberButtonClick(number: number) {
        // Здесь логика для установки значения в ячейку
        SudokuGame.instance.setValueAtCurrentCell(number);
    }

    Ready(isSelected: boolean) {
        this.buttons.forEach(button => {
            button.interactable = isSelected;
        });
    }
}


