import { UILayer } from "../ui-components";
import EventBus from "./EventBus";

interface UIEventData {
    id: string;
    data: any;
}

export default class UiManager {

    public uiLayers: UILayer[] = [];
  
    init(eventBus: EventBus) {
        eventBus.on('ui.show', (data: UIEventData) => {
            this.show(data);
        });

        eventBus.on('ui.hide', (data: UIEventData) => {
            this.hide(data);
        });

        eventBus.on('ui.update', (data) => {
            this.update(data);
        });
    }

    addLayer(layer: UILayer) {
        this.uiLayers.push(layer);
        this.uiLayers.sort((a, b) => a.order - b.order);
    }

    show(uiData: UIEventData) {
        const element = this.findById(uiData.id);

        element.forEach((e) => {
            if (e) {
                e.visible = true;
            }
        });
    }

    hide(data: UIEventData) {
        const element = this.findById(data.id);
        
        element.forEach((e) => {
            if (e) {
                e.visible = false;
            }
        });
    }

    update(data: any) {}

    private findById(id: string) {
        return this.uiLayers.map((layer) => layer.findById(id));
    }
}