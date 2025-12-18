import { NodeConstraints, Node } from '@syncfusion/ej2-diagrams';

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
}

