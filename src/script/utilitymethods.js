import { NodeConstraints, Node, PortConstraints, PortVisibility } from '@syncfusion/ej2-diagrams';
import { Ajax } from '@syncfusion/ej2-base';

export class PaperSize {
    constructor() {
        this.pageWidth = 0;
        this.pageHeight = 0;
    }
}

export class UtilityMethods {
    constructor() {
        this.fillColorCode = ['#C4F2E8', '#F7E0B3', '#E5FEE4', '#E9D4F1', '#D4EFED', '#DEE2FF'];
        this.borderColorCode = ['#8BC1B7', '#E2C180', '#ACCBAA', '#D1AFDF', '#90C8C2', '#BBBFD6'];
        this.tempDialog = undefined;
        this.toolbarEditor = undefined;
    }

    residentialImage = [
        { source: 'assets/dbstyle/common_images/blank_diagram.svg', name: 'Blank Diagram', type: 'svg_blank' },
        { source: 'assets/dbstyle/residential/2BHK.png', name: 'Modern 2BHK Efficient Family Layout' },
        { source: 'assets/dbstyle/residential/studio_apartment.png', name: 'Studio Apartment Smart‑Space Open Layout' },
        { source: 'assets/dbstyle/residential/3BHK.png', name: 'Spacious 3BHK Layout' },
    ];

    commercialImage = [
        { source: 'assets/dbstyle/common_images/blank_diagram.svg', name: 'Blank Diagram', type: 'svg_blank' },
        { source: 'assets/dbstyle/commercial/office_space.png', name: 'Open‑Plan Modern Office Layout' },
        { source: 'assets/dbstyle/commercial/boutique_store.png', name: 'Boutique Retail Store Floor Plan' },
        { source: 'assets/dbstyle/commercial/restaurant.png', name: 'Restaurant With Dining Plan' },
    ];

    // Binds node properties to the selected item
    bindNodeProperties(node, selectedItem, isMultiSelect) {
        selectedItem.preventPropertyChange = true; 
        selectedItem.nodeProperties.opacity.value = node.style.opacity * 100;
        if (node.children && node.children.length > 0) {
            let childNode = selectedItem.selectedDiagram.nameTable[node.children[0]];
            selectedItem.nodeProperties.offsetX.value = Math.round(node.offsetX * 100) / 100;
            selectedItem.nodeProperties.offsetY.value = Math.round(node.offsetY * 100) / 100;
            selectedItem.nodeProperties.width.value = node.width ? Math.round(node.width * 100) / 100 : Math.round(node.minWidth * 100) / 100;
            selectedItem.nodeProperties.height.value = node.height ? Math.round(node.height * 100) / 100 : Math.round(node.minHeight * 100) / 100;
            selectedItem.nodeProperties.strokeWidth.value = childNode.style.strokeWidth;
            selectedItem.nodeProperties.strokeColor.value = this.getHexColor(childNode.style.strokeColor);
            selectedItem.nodeProperties.strokeStyle.value = childNode.style.strokeDashArray;
            selectedItem.nodeProperties.fillColor.value = this.getHexColor(childNode.style.fill);
            selectedItem.nodeProperties.opacity.value = childNode.style.opacity * 100;
            selectedItem.nodeProperties.opacityText = selectedItem.nodeProperties.opacity.value + '%';
        }
        else if (!isMultiSelect) {
            selectedItem.nodeProperties.offsetX.value = Math.round(node.offsetX * 100) / 100;
            selectedItem.nodeProperties.offsetY.value = Math.round(node.offsetY * 100) / 100;
            selectedItem.nodeProperties.width.value = node.width ? Math.round(node.width * 100) / 100 : Math.round(node.minWidth * 100) / 100;
            selectedItem.nodeProperties.height.value = node.height ? Math.round(node.height * 100) / 100 : Math.round(node.minHeight * 100) / 100;
            selectedItem.nodeProperties.rotateAngle.value = node.rotateAngle;
            selectedItem.nodeProperties.strokeWidth.value = node.style.strokeWidth;
            selectedItem.nodeProperties.strokeColor.value = this.getHexColor(node.style.strokeColor);
            selectedItem.nodeProperties.strokeStyle.value = node.style.strokeDashArray;
            selectedItem.nodeProperties.fillColor.value = this.getHexColor(node.style.fill);
            selectedItem.nodeProperties.opacity.value = node.style.opacity * 100;
            selectedItem.nodeProperties.opacityText = selectedItem.nodeProperties.opacity.value + '%';
            let aspectRatioBtn = document.getElementById('aspectRatioBtn').ej2_instances[0];
            node.constraints & NodeConstraints.AspectRatio ? document.getElementById('aspectRatioBtn').classList.add('e-active') : document.getElementById('aspectRatioBtn').classList.remove('e-active');
            node.constraints & NodeConstraints.AspectRatio ? aspectRatioBtn.iconCss = 'sf-icon-lock' : aspectRatioBtn.iconCss = 'sf-icon-unlock';
            selectedItem.nodeProperties.gradient = node.style.gradient.type !== 'None' ? true : false;
        }
        selectedItem.preventPropertyChange = false;
    }

    // Binds text properties to the selected item
    bindTextProperties(text, selectedItem) {
        selectedItem.preventPropertyChange = true;
        selectedItem.textProperties.fontSize.value = text.fontSize;
        selectedItem.textProperties.fontColor.value = this.getHexColor(text.color);
        selectedItem.textProperties.fontFamily.value = text.fontFamily;
        selectedItem.textProperties.opacity.value= text.opacity * 100;
        selectedItem.textProperties.opacityText = selectedItem.textProperties.opacity + '%';
        let toolbarTextStyle = document.getElementById('toolbarTextStyle');
        if (toolbarTextStyle) {
            toolbarTextStyle = toolbarTextStyle.ej2_instances[0];
        }
        if (toolbarTextStyle) {
            toolbarTextStyle.items[0].cssClass = text.bold ? 'tb-item-start tb-item-selected' : 'tb-item-start';
            toolbarTextStyle.items[1].cssClass = text.italic ? 'tb-item-middle tb-item-selected' : 'tb-item-middle';
            toolbarTextStyle.items[2].cssClass = text.textDecoration === 'Underline' ? 'tb-item-end tb-item-selected' : 'tb-item-end';
        }
        this.updateTextAlign(text.textAlign);
        selectedItem.preventPropertyChange = false;
    }

    // Updates the text alignment in the toolbar
    updateTextAlign(textAlign) {
        let toolbarTextSubAlignment = document.getElementById('toolbarTextSubAlignment');
        if (toolbarTextSubAlignment) {
            toolbarTextSubAlignment = toolbarTextSubAlignment.ej2_instances[0];
        }
        if (toolbarTextSubAlignment) {
            for (let i = 0; i < toolbarTextSubAlignment.items.length; i++) {
                toolbarTextSubAlignment.items[i].cssClass = toolbarTextSubAlignment.items[i].cssClass.replace(' tb-item-selected', '');
            }
            let index = textAlign === 'Left' ? 0 : (textAlign === 'Center' ? 1 : 2);
            toolbarTextSubAlignment.items[index].cssClass += ' tb-item-selected';
        }
    }

    // Updates horizontal and vertical alignment in the toolbar
    updateHorVertAlign(horizontalAlignment, verticalAlignment) {
        let toolbarHorVerAlignment = document.getElementById('toolbarTextAlignment');
        if (toolbarHorVerAlignment) {
            toolbarHorVerAlignment = toolbarHorVerAlignment.ej2_instances[0];
        }
        if (toolbarHorVerAlignment) {
            for (let i = 0; i < toolbarHorVerAlignment.items.length; i++) {
                toolbarHorVerAlignment.items[i].cssClass = toolbarHorVerAlignment.items[i].cssClass.replace(' tb-item-selected', '');
            }
            let index = horizontalAlignment === 'Right' ? 0 : (horizontalAlignment === 'Center' ? 1 : 2);
            toolbarHorVerAlignment.items[index].cssClass += ' tb-item-selected';
            index = verticalAlignment === 'Top' ? 3 : (verticalAlignment === 'Center' ? 4 : 5);
            toolbarHorVerAlignment.items[index].cssClass += ' tb-item-selected';
        }
    }

    // Binds connector properties to the selected item
    bindConnectorProperties(connector, selectedItem, isMultiSelect) {
        selectedItem.preventPropertyChange = true;
        selectedItem.connectorProperties.opacity.value = connector.style.opacity * 100;
        if (!isMultiSelect) {
            selectedItem.connectorProperties.lineColor.value = this.getHexColor(connector.style.strokeColor);
            selectedItem.connectorProperties.lineWidth.value = connector.style.strokeWidth;
            selectedItem.connectorProperties.opacity.value = connector.style.opacity * 100;
            selectedItem.connectorProperties.opacityText = selectedItem.connectorProperties.opacity + '%';
        }
        selectedItem.preventPropertyChange = false;
    }

    // Converts a color string to its hexadecimal representation
    getHexColor(colorStr) {
        let a = document.createElement('div');
        a.style.color = colorStr;
        let colors = window.getComputedStyle(document.body.appendChild(a)).color.match(/\d+/g).map(
            (a) => { return parseInt(a, 10); }
        );
        document.body.removeChild(a);
        return (colors.length >= 3) ? '#' + (((1 << 24) + (colors[0] << 16) + (colors[1] << 8) + colors[2]).toString(16).substr(1)) : '';
    }

    // Gets the offset position based on a predefined string position
    getOffset(position) {
        switch (position.toLowerCase()) {
            case 'topleft': return { x: 0, y: 0 };
            case 'topcenter': return { x: 0.5, y: 0 };
            case 'topright': return { x: 1, y: 0 };
            case 'middleleft': return { x: 0, y: 0.5 };
            default: return { x: 0.5, y: 0.5 };
            case 'middleright': return { x: 1, y: 0.5 };
            case 'bottomleft': return { x: 0, y: 1 };
            case 'bottomcenter': return { x: 0.5, y: 1 };
            case 'bottomright': return { x: 1, y: 1 };
        }
    }

    // Gets the position string based on the offset values
    getPosition(offset) {
        if (offset.x === 0 && offset.y === 0) {
            return 'TopLeft';
        } else if (offset.x === 0.5 && offset.y === 0) {
            return 'TopCenter';
        } else if (offset.x === 1 && offset.y === 0) {
            return 'TopRight';
        } else if (offset.x === 0 && offset.y === 0.5) {
            return 'MiddleLeft';
        } else if (offset.x === 1 && offset.y === 0.5) {
            return 'MiddleRight';
        } else if (offset.x === 0 && offset.y === 1) {
            return 'BottomLeft';
        } else if (offset.x === 0.5 && offset.y === 1) {
            return 'BottomCenter';
        } else if (offset.x === 1 && offset.y === 1) {
            return 'BottomRight';
        } else {
            return 'Center';
        }
    }

    // Toggles the visibility of properties in the diagram container
    hideElements(elementType, diagram) {
        const diagramContainer = document.getElementsByClassName('diagrambuilder-container')[0];
        if (diagramContainer.classList.contains(elementType)) {
            diagramContainer.classList.remove(elementType);
            (document.getElementById('hideProperty')).style.backgroundColor = '';
            (document.getElementById('hideProperty')).style.color = '#fff';
            (document.getElementById('hideProperty')).ej2_instances[0].isPrimary = true;
        }
        else {
            diagramContainer.classList.add(elementType);
            (document.getElementById('hideProperty')).style.backgroundColor = '#e3e3e3';
            (document.getElementById('hideProperty')).style.color = 'black';
            (document.getElementById('hideProperty')).ej2_instances[0].isPrimary = false;
        }
        if (diagram) {
            diagram.updateViewPort();
        }
    }

    // Changes the visibility of property containers based on the object type
    objectTypeChange(objectType) {
        document.getElementById('diagramPropertyContainer').style.display = 'none';
        document.getElementById('nodePropertyContainer').style.display = 'none';
        document.getElementById('textPropertyContainer').style.display = 'none';
        document.getElementById('connectorPropertyContainer').style.display = 'none';
        switch (objectType) {
            case 'diagram':
                document.getElementById('diagramPropertyContainer').style.display = '';
                break;
            case 'node':
                document.getElementById('nodePropertyContainer').style.display = '';
                break;
            case 'connector':
                document.getElementById('connectorPropertyContainer').style.display = '';
                break;
            default:
                break;
        }
    }

    // Enables toolbar items according to the selected items
    enableToolbarItems(selectedItems) {
        let toolbarContainer = document.getElementsByClassName('db-toolbar-container')[0];
        let toolbarClassName = 'db-toolbar-container';
        if (toolbarContainer.classList.contains('db-undo')) {
            toolbarClassName += ' db-undo';
        }
        if (toolbarContainer.classList.contains('db-redo')) {
            toolbarClassName += ' db-redo';
        }
        toolbarContainer.className = toolbarClassName;
        if (selectedItems.length === 1) {
            toolbarContainer.className = toolbarContainer.className + ' db-select';
            if (selectedItems[0] instanceof Node) {
                if (selectedItems[0].children) {
                    if (selectedItems[0].children.length > 2) {
                        toolbarContainer.className = `${toolbarContainer.className} db-select db-double db-multiple db-node db-group`;
                    } else {
                        toolbarContainer.className = `${toolbarContainer.className} db-select db-double db-node db-group`;
                    }
                } else {
                    toolbarContainer.className = `${toolbarContainer.className} db-select db-node`;
                }
            }
        } else if (selectedItems.length === 2) {
            toolbarContainer.className = `${toolbarContainer.className} db-select db-double`;
        } else if (selectedItems.length > 2) {
            toolbarContainer.className = `${toolbarContainer.className} db-select db-double db-multiple`;
        }
        if (selectedItems.length > 1) {
            for (let i = 0; i < selectedItems.length; i++) {
                if (selectedItems[i] instanceof Node) {
                    toolbarContainer.className = `${toolbarContainer.className} db-select db-node`;
                    break;
                }
            }
        }
    }

    // Enables context menu items based on the current selection
    enableArrangeMenuItems(selectedItem) {
        let contextInstance = document.getElementById('arrangeContextMenu');
        let contextMenu = contextInstance.ej2_instances[0];
        
        for (let i = 0; i < contextMenu.items.length; i++) {
            contextMenu.enableItems([contextMenu.items[i].text], false);
        }
    }

     // Determines if menu items should be enabled based on selected items and command type
     enableMenuItems(itemText, selectedItem) {
        if (selectedItem && selectedItem.selectedDiagram) {
           var diagram = selectedItem.selectedDiagram;
            let selectedItems = selectedItem.selectedDiagram.selectedItems.nodes;
            selectedItems = selectedItems.concat(selectedItem.selectedDiagram.selectedItems.connectors);
            if (itemText) {
               var commandType = itemText.replace(/[' ']/g, '');
               if (selectedItems.length === 0) {
                   switch (commandType.toLowerCase()) {
                       case 'cut':
                           return true;
                       case 'copy':
                           return true;
                       case 'delete':
                           return true;
                        case 'insertlink':
                            return true;
                        case 'insertimage':
                            return true;
                        default:
                            break;
                   }
               }
               else if (selectedItems && selectedItems.length > 0 && selectedItems[0]
                    && selectedItems[0].children && selectedItems[0].children.length > 0 ) {
                    if (commandType === 'InsertImage') {
                        return true;
                   }
                }
               if (!(diagram.commandHandler.clipboardData.pasteIndex !== undefined
                   && diagram.commandHandler.clipboardData.clipObject !==undefined) && itemText === 'Paste') {
                   return true;
               }
                if (itemText === 'Undo' && selectedItem.selectedDiagram.historyManager.undoStack.length === 0) {
                    return true;
                }
                if (itemText === 'Redo' && selectedItem.selectedDiagram.historyManager.redoStack.length === 0) {
                    return true;
                }
            }
        }
        return false;
    }

    // Retrieves the page dimensions for a given paper size
    getPaperSize(paperName) {
        let paperSize = new PaperSize();
        switch (paperName) {
            case 'Letter':
                paperSize.pageWidth = 816;
                paperSize.pageHeight = 1056;
                break;
            case 'Legal':
                paperSize.pageWidth = 816;
                paperSize.pageHeight = 1344;
                break;
            case 'Tabloid':
                paperSize.pageWidth = 1056;
                paperSize.pageHeight = 1632;
                break;
            case 'A3':
                paperSize.pageWidth = 1122;
                paperSize.pageHeight = 1587;
                break;
            case 'A4':
                paperSize.pageWidth = 793;
                paperSize.pageHeight = 1122;
                break;
            case 'A5':
                paperSize.pageWidth = 559;
                paperSize.pageHeight = 793;
                break;
            case 'A6':
                paperSize.pageWidth = 396;
                paperSize.pageHeight = 559;
                break;
            default:
                break;
        }
        return paperSize;
    }

    //To remove the selected icon css on toolbar option selection change
    removeSelectedToolbarItem() {
        let  toolbarEditor = document.getElementById('toolbarEditor').ej2_instances[0];;
        for (var i = 0; i < toolbarEditor.items.length; i++) {
            var item = toolbarEditor.items[i];
            if (item.cssClass.indexOf('tb-item-selected') !== -1) {
                item.cssClass = item.cssClass.replace(' tb-item-selected', '');
            }
        }
        toolbarEditor.dataBind();
    }

    // Displays a color picker in the toolbar
    showColorPicker(propertyName, toolbarName) {
        const fillElement = document.getElementById(propertyName).parentElement.querySelector('.e-dropdown-btn');
        if (fillElement) {
          fillElement.click();
          const popupElement = document.getElementById(`${fillElement.id}-popup`);
          const bounds = document.querySelector(`.${toolbarName}`).getBoundingClientRect();
          popupElement.style.left = `${bounds.left}px`;
          popupElement.style.top = `${bounds.top + 40}px`;
        }
    }

    // Creates a measurement label for a node's side (top, right, bottom, left).
    createNodeLabels(node, useTemplate, isUnitVisible, unitSystem, pxPerUnit) {
        const sides = ['top', 'right', 'bottom', 'left'];
        return sides.map(side => {
            // determine value to display based on side (width or height)
            const value = Math.round((side === 'top' || side === 'bottom') ? node.width : node.height);
            let offset, margin = {}, rotateAngle = 0;
            if (side === 'top') { offset = { x: 0.5, y: 0 }; margin.bottom = 15; }
            if (side === 'bottom') { offset = { x: 0.5, y: 1 }; margin.top = 15; }
            if (side === 'left') { offset = { x: 0, y: 0.5 }; margin.right = 15; rotateAngle = 270 }
            if (side === 'right') { offset = { x: 1, y: 0.5 }; margin.left = 15; rotateAngle = 270 }
            return {
                id: `_measure_room_${side}`,
                ...(useTemplate
                    ? {
                        template: `<div class="measure-room" style="white-space:nowrap;display:inline-block"
                        data-node-id="${node.id}" data-side="${side}">${value}</div>`
                    }
                    : {
                        content: this.formatMeasurement(value, unitSystem, pxPerUnit)
                    }),
                offset,
                margin,
                rotateAngle,
                width: 15, height: 15,
                visibility: isUnitVisible,
                style: { textWrapping: 'NoWrap' }
            };
        });
    }

    // Updates node labels while element draw
    updateNodeSVGLabels(node, diagram, unitSystem, pxPerUnit) {
        if (node.annotations.length > 0 && node.annotations[0].id.includes('_measure_room')) {
            const width = Math.round(node.width);
            const height = Math.round(node.height);
            const entries = [
                ['top', 0, width],
                ['right', 1, height],
                ['bottom', 2, width],
                ['left', 3, height],
            ];
            const root = diagram.element;
            const baseSelector = `.measure-room[data-node-id="${node.id}"]`;
            for (const [side, idx, val] of entries) {
                const annotation = node.annotations[idx];
                const element = root.querySelector(`${baseSelector}[data-side="${side}"]`);
                const text = this.formatMeasurement(val, unitSystem, pxPerUnit);
                if (element && element.textContent !== text) {
                    element.textContent = text;
                    const rect = element.getBoundingClientRect();
                    annotation.width = (side === 'top' || side === 'bottom') ? rect.width : rect.height;
                    annotation.height = (side === 'top' || side === 'bottom') ? rect.height : rect.width;
                }
            }
        }
    }

    // Updates node label while size change
    updateNodeLabels(node, unitSystem, pxPerUnit) {
        if (node.annotations.length > 0 && node.annotations[0].id.includes('_measure_room')) {
            for (let i = 0; i < 4; i++) {
                const annotation = node.annotations[i];
                const side = ['top', 'right', 'bottom', 'left'][i];
                const value = (side === 'top' || side === 'bottom') ? Math.round(node.width) : Math.round(node.height);
                annotation.content = this.formatMeasurement(value, unitSystem, pxPerUnit);
            }
        }
    }
    /**
     * Returns a minimal SVG wrapper for the connector (wall) label text.
     * Used as the annotation template for wall measurements.
     * @param connectorId The connector's id
     */
    getConnectorSVGLabel(connectorId) {
        const ns = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(ns, 'svg');
        svg.setAttribute('id', connectorId + '_dimension_svg');
        svg.setAttribute('width', '37');
        svg.setAttribute('height', '17');
        svg.style.overflow = 'visible';
        const text = document.createElementNS(ns, 'text');
        text.setAttribute('id', connectorId + '_dimension_text');
        text.setAttribute('x', '50%');
        text.setAttribute('y', '50%');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.textContent = '0"';
        svg.appendChild(text);
        const div = document.createElement('div');
        div.style.pointerEvents = 'none';
        div.className = "measure-wall";
        div.setAttribute('data-connector-id', connectorId);
        div.appendChild(svg);
        return div;
    }

    // Updates connector label SVG text to show measured length while element draw
    updateConnectorSVGLabel(connector, diagram, unitSystem, pxPerUnit) {
        if (connector.annotations.length > 0 && this.isMeasureWall(connector)) {
            const measuredValue = this.getConnectorLength(connector, unitSystem, pxPerUnit);
            const textElement = diagram.element.querySelector(`.measure-wall[data-connector-id="${connector.id}"] svg text`);
            if (textElement) {
                textElement.textContent = measuredValue;
            }
        }
    }


    // Update connector annotation content while end point change
    updateConnectorContent(connector, unitSystem, pxPerUnit) {
        if (connector.annotations.length > 0 && this.isMeasureWall(connector)) {
            connector.annotations[0].content = this.getConnectorLength(connector, unitSystem, pxPerUnit);
        }
    }

    // Measure connector length
    getConnectorLength(connector, unitSystem, pxPerUnit) {
        const sp = connector.sourcePoint, tp = connector.targetPoint;
        const len = Math.hypot(tp.x - sp.x, tp.y - sp.y);
        return this.formatMeasurement(len, unitSystem, pxPerUnit);
    }

    // Collects all measurement annotation objects (for rooms and walls) in the diagram
    getMeasuredAnnotations(diagram) {
        const measuredAnnotations = [];
        diagram.nodes.forEach((node) => {
            node.annotations.filter((a) => a.id.includes('_measure_room'))
                .forEach((annotation) => measuredAnnotations.push(annotation));
        });
        diagram.connectors.forEach((connector) => {
            connector.annotations.filter((a) => a.id.includes('_measure_wall'))
                .forEach((annotation) => measuredAnnotations.push(annotation));
        });
        return measuredAnnotations;
    }

    isMeasureRoom(node) {
        return node.annotations.some(annotation => annotation.id.includes('_measure_room'));
    };

    isMeasureWall(connector) {
        return connector.annotations.some(annotation => annotation.id.includes('_measure_wall'));
    };


    // Updates all measurement labels in diagram with the current unit system
    updateAllMeasurements(diagram, unitSystem, pxPerUnit) {
        diagram.nodes.forEach((node) => {
            this.updateNodeLabels(node, unitSystem, pxPerUnit);
        });
        diagram.connectors.forEach((connector) => {
            this.updateConnectorContent(connector, unitSystem, pxPerUnit);
        });
    }

    /**
     * Formats a raw pixel value as a measurement string for display.
     * Supports 'Feet' (ft/in) and 'Meter' (m/cm) systems.
     * @param px The value in pixels
     * @param unitSystem The unit system ('Feet' or 'Meter')
     * @param pxPerUnit The pixels per unit
     */
    formatMeasurement(px, unitSystem = 'Feet', pxPerUnit = 1) {
        if (unitSystem === 'Feet') {
            const totalInches = (px / pxPerUnit) * 12;
            const feet = Math.floor(totalInches / 12);
            const inches = Math.round(totalInches % 12);
            if (feet === 0 && inches === 0) return `0"`;
            if (feet === 0) return `${inches}"`;
            if (inches === 0) return `${feet}'`;
            return `${feet}' ${inches}"`;
        } else {
            const totalMeters = px / (pxPerUnit);
            if (totalMeters < 0.01) return `0 cm`;
            return `${totalMeters.toFixed(1)} m`;
        }
    }
    
    // End ports for wall connectors
    getWallEndPorts() {
        return [
            {
                id: 'left',
                offset: 0,
                horizontalAlignment: 'Center',
                verticalAlignment: 'Center',
                constraints: PortConstraints.Default | PortConstraints.Draw,
                visibility: PortVisibility.Visible,
                width: 5,
                height: 5,
                style: { fill: 'black', strokeWidth: 0 },
            },
            {
                id: 'right',
                offset: 1,
                horizontalAlignment: 'Center',
                verticalAlignment: 'Center',
                constraints: PortConstraints.Default | PortConstraints.Draw,
                visibility: PortVisibility.Visible,
                width: 5,
                height: 5,
                style: { fill: 'black', strokeWidth: 0  },
            },
        ];
    }

    getDefaultDiagramTemplates1(selectedItem, tempCount, backgroundColor, parentId) {
        let i;
        let j;
        tempCount = tempCount ? tempCount : 4;
        backgroundColor = backgroundColor ? backgroundColor : 'red';
        parentId = parentId ? parentId : 'Residential';
        let parentDiv = document.getElementById('diagramTemplateDiv1');
        parentDiv = parentDiv.cloneNode(true);
        parentDiv.id = '';
        parentDiv.style.display = '';
        const parentElements = parentDiv.getElementsByClassName('db-diagram-template-parent-text');

        for (i = 0; i < parentElements.length; i++) {
            if (parentElements[i].children[0].innerHTML.trim() === parentId) {
                parentElements[i].classList.add('active');
            }
        }
        const diagramTemplatesDiv = parentDiv.getElementsByClassName('diagramTemplates')[0];
        diagramTemplatesDiv.appendChild(this.generateDiagramTemplates(tempCount, backgroundColor, parentId, selectedItem));
        this.tempDialog.content = parentDiv.outerHTML;
        this.tempDialog.dataBind();
        this.triggerTemplateEvent(selectedItem);
        return this.tempDialog.content;
    }

    showDiagramTemplates(selectedItem, evt) {
        let target = evt.target;
        if (target.tagName.toLowerCase() === 'span') {
            target = target.parentElement;
        }
        switch (target.children[0].innerHTML.trim()) {
            case 'Residential':
                this.getDefaultDiagramTemplates1(selectedItem, 4, 'red', 'Residential');
                break;
            case 'Commercial':
                this.getDefaultDiagramTemplates1(selectedItem, 4, 'blue', 'Commercial');
                break;
        }
    }

    generateDiagramTemplates(tempCount, backgroundColor, parentId, selectedItem) {
        const parentTemplateDiv = document.createElement('div');
        parentTemplateDiv.classList.add('class', 'db-parent-diagram-template');

        const divElement = document.getElementById('diagramTemplateDiv');
        for (let i = 0; i < tempCount; i++) {
            const cloneTemplateDiv = divElement.cloneNode(true);
            cloneTemplateDiv.style.display = '';
            cloneTemplateDiv.id = '';
            const imageDiv = cloneTemplateDiv.children[0];

            imageDiv.setAttribute('id', parentId.replace(' ', '').toLowerCase() + '_child' + i);
            const diagramType = this.getImageSource(parentId, i);
            (imageDiv.children[0]).style.backgroundImage = 'url(' + diagramType.source + ')';
            if (diagramType.type) {
                if (diagramType.type === 'svg_blank') {
                    (imageDiv.children[0]).className = 'db-diagram-template-svg-blank-image';
                } else {
                    (imageDiv.children[0]).className = 'db-diagram-template-svg-image';
                }
            } else {
                (imageDiv.children[0]).className = 'db-diagram-template-image';
            }
            cloneTemplateDiv.children[1].children[0].innerHTML = diagramType.name;
            parentTemplateDiv.appendChild(cloneTemplateDiv);
        }
        return parentTemplateDiv;
    }

    triggerTemplateEvent(selectedItem) {
        let i;
        const parentElements = document.getElementsByClassName('db-diagram-template-parent-text');
        for (i = 0; i < parentElements.length; i++) {
            parentElements[i].onclick = this.showDiagramTemplates.bind(this, selectedItem);
        }
        const parentElements1 = document.getElementsByClassName('db-diagram-template-image-div');
        for (i = 0; i < parentElements1.length; i++) {
            parentElements1[i].onclick = this.generateDiagram.bind(this, selectedItem);
        }
    }

    getImageSource(diagramType, index) {
        switch (diagramType) {
            case 'Residential':
                return this.residentialImage[index];
            case 'Commercial':
                return this.commercialImage[index];
            default:
                return this.residentialImage[index];
        }
    }
    generateDiagram(selectedItem, evt) {
        const target = evt.target;
        if (target.id.startsWith('residential')) {
            if (target.id === 'residential_child1') {
                this.readTextFile('assets/dbstyle/residential/2BHK.json', selectedItem);
            }
            else if (target.id === 'residential_child2') {
                this.readTextFile('assets/dbstyle/residential/Studio_Apartment.json', selectedItem);
            }
            else if (target.id === 'residential_child3') {
                this.readTextFile('assets/dbstyle/residential/3BHK.json', selectedItem);
            }
        }
        else if (target.id.startsWith('commercial')) {
            if (target.id === 'commercial_child1') {
                this.readTextFile('assets/dbstyle/commercial/Office_Space.json', selectedItem);
            }
            else if (target.id === 'commercial_child2') {
                this.readTextFile('assets/dbstyle/commercial/Boutique_Store.json', selectedItem);
            }
            else if (target.id === 'commercial_child3') {
                this.readTextFile('assets/dbstyle/commercial/Restaurant.json', selectedItem);
            }
        }
        const diagramName = target.parentElement.children[1].children[0].innerHTML;
        if (diagramName !== 'Blank Diagram') {
            document.getElementById('diagramName').innerHTML = diagramName;
        }
        this.tempDialog.hide();
    }

    readTextFile(file, selectedItem) {
        const ajax = new Ajax(file, 'GET', true);
        ajax.send().then();
        ajax.onSuccess = (data) => {
            selectedItem.preventSelectionChange = true;
            let diagram = document.getElementById('diagram').ej2_instances[0];
            diagram.loadDiagram(data);
            diagram.fitToPage({ mode: 'Page', region: 'Content' });
            selectedItem.preventSelectionChange = false;
        };
    }

}

