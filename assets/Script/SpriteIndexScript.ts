/**
 * 图片切换组件
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("SpriteIndexScript")
export default class SpriteIndexScript extends cc.Component {

    private _index: number = 0;
    @property({ type: cc.Integer, tooltip: "当前index" })
    set index(i: number) {
        this._index = i;
        const img = this.getComponent(cc.Sprite);
        if (img) img.spriteFrame = this.list[i] || null;
    }
    get index(): number {
        return this._index;
    }

    @property({ type: [cc.SpriteFrame], tooltip: "图片列表" })
    private list: cc.SpriteFrame[] = [];

    resetInEditor() {
        const img = this.getComponent(cc.Sprite);
        if (img?.spriteFrame && !this.list.length) this.list.push(img.spriteFrame);
    }

    start() {

    }

}
