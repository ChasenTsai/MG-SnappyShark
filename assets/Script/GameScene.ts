import SpriteIndexScript from "./SpriteIndexScript";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameScene extends cc.Component {

    @property(cc.Node)
    box_shark: cc.Node = null;
    @property(cc.Node)
    box_die: cc.Node = null;
    @property(cc.AudioClip)
    audio_tooth: cc.AudioClip = null;
    @property(cc.AudioClip)
    audio_die: cc.AudioClip = null;

    start() {
        this.initEvent();
        this.initData();
    }

    private initEvent(): void {
        for (const node of this.box_shark.children) {
            node.on(cc.Node.EventType.TOUCH_END, this.onToothClick, this);
        }
    }

    private deathTooth: number;

    private initData(first: boolean = true): void {
        this.hideDie(first);
        this.deathTooth = Math.floor(this.box_shark.childrenCount * Math.random());
        for (const node of this.box_shark.children) {
            node.getComponent(SpriteIndexScript).index = 0;
        }
        cc.tween(this.box_shark).set({ scale: .8 }).to(.6, { scale: 1 }).start();
    }

    private replay(): void {
        this.initData(false);
    }

    private onToothClick(e: cc.Event.EventTouch): void {
        const node: cc.Node = e.target;
        const idx = node.parent.children.indexOf(node);
        node.getComponent(SpriteIndexScript).index = 1;
        if (idx == this.deathTooth) {
            cc.audioEngine.playEffect(this.audio_die, false);
            this.showDie();
        } else {
            cc.audioEngine.playEffect(this.audio_tooth, false);
        }
    }

    private showDie(): void {
        this.box_die.active = true;
        const node1 = this.box_die.children[0];
        const node2 = this.box_die.children[1];
        const halfH = cc.winSize.height / 2;
        node1.height = node2.height = halfH;
        node1.y = halfH;
        node2.y = -halfH;
        cc.tween(node1).to(.2, { y: 0 }).start();
        cc.tween(node2).to(.2, { y: 0 }).delay(.5).call(this.replay, this).start();
    }

    private hideDie(init: boolean): void {
        if (init) {
            this.box_die.active = false;
            return;
        }
        const node1 = this.box_die.children[0];
        const node2 = this.box_die.children[1];
        const halfH = cc.winSize.height / 2;
        cc.tween(node1).to(.2, { y: halfH }).start();
        cc.tween(node2).to(.2, { y: -halfH }).call(() => {
            this.box_die.active = false;
        }).start();
    }


}

if (!CC_EDITOR) {
    // 强制开启动态合图
    cc.macro.CLEANUP_IMAGE_CACHE = false;
    cc.dynamicAtlasManager.enabled = true;
}
