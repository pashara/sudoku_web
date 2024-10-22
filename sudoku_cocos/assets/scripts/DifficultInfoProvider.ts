import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DifficultInfoProvider')
export class DifficultInfoProvider extends Component {
    
    @property
    public  difficult: string = "";
}


