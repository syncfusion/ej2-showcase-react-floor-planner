import { Node, Connector, ShapeAnnotation, PathAnnotation, DiagramConstraints } from "@syncfusion/ej2-diagrams";
import { SnapConstraints } from "@syncfusion/ej2-react-diagrams";

export class DiagramClientSideEvents {
    constructor(selectedItem) {
        this.selectedItem = selectedItem;
        this.diagram = null;
        this.toolbarEditor = undefined;
        this.ddlTextPosition = null;
    }

    // Handles changes in the selection of diagram items, updating toolbar and UI
    selectionChange(args) {
        const diagram = document.getElementById("diagram").ej2_instances[0];
        const toolbarEditor = document.getElementById("toolbarEditor").ej2_instances[0];
        if (this.selectedItem.preventSelectionChange || this.selectedItem.isLoading) {
            return;
        }

        if (args.state === "Changed") {
            let selectedItems = diagram.selectedItems.nodes;
            if (args.newValue && args.newValue[0] && args.newValue[0] instanceof Connector) {
                document.getElementById("connectorOpacity").ej2_instances[0].value = args.newValue[0].style.opacity * 100;
            }
            if (args.newValue && args.newValue[0] && args.newValue[0] instanceof Node) {
                document.getElementById("nodeOpacity").ej2_instances[0].value = args.newValue[0].style.opacity * 100;
            }
            let insertImageDiv = document.getElementById("insertImageDiv");
            if (insertImageDiv && selectedItems[0] && selectedItems[0].children && selectedItems[0].children.length > 0) {
                insertImageDiv.style.opacity = 0.5;
                insertImageDiv.style.pointerEvents = 'none';
            }
            else if (insertImageDiv) {
               insertImageDiv.style.opacity = 1;
               insertImageDiv.style.pointerEvents = 'all';
            }
            selectedItems = selectedItems.concat(diagram.selectedItems.connectors);
            this.selectedItem.utilityMethods.enableToolbarItems(selectedItems);

            let nodeContainer = document.getElementById("nodePropertyContainer");
            nodeContainer.classList.remove("multiple");
            nodeContainer.classList.remove("connector");

            if (selectedItems.length > 1) {
                this.multipleSelectionSettings(selectedItems);
                toolbarEditor.items[7].tooltipText = 'Group';
                toolbarEditor.items[7].prefixIcon = 'sf-icon-group';
                for (var i = 7; i <= 28; i++) {
                    toolbarEditor.items[i].visible = true;
                }
            } else if (selectedItems.length === 1) {
                this.singleSelectionSettings(selectedItems[0]);
                for (var j = 7; j <= 28; j++) {
                    if(j<=16)
                    {
                        toolbarEditor.items[j].visible = false;
                    }
                    else
                    {
                        toolbarEditor.items[j].visible = true;
                    }
                }
                if (selectedItems[0].children && selectedItems[0].children.length > 0) {
                    toolbarEditor.items[7].tooltipText = 'UnGroup';
                    toolbarEditor.items[7].prefixIcon = 'sf-icon-ungroup';
                    toolbarEditor.items[7].visible = true;
                }
            } else {
                this.selectedItem.utilityMethods.objectTypeChange("diagram");
                for (var k = 7; k <= 27; k++) {
                    toolbarEditor.items[k].visible = false;
                }
            }
        }
    }

    // Configures UI for multiple selected diagram items, showing appropriate panels
    multipleSelectionSettings(selectedItems) {
        this.selectedItem.utilityMethods.objectTypeChange("None");
        let showConnectorPanel = false, showNodePanel = false;
        let showTextPanel = false, showConTextPanel = false;
        let nodeContainer = document.getElementById("nodePropertyContainer");
        selectedItems.forEach(object => {
            if (object instanceof Node && (!showNodePanel || !showTextPanel)) {
                showNodePanel = true;
                showTextPanel = object.annotations.length > 0 && object.annotations[0].content ? true : false;
            } else if (object instanceof Connector && (!showConnectorPanel || !showConTextPanel)) {
                showConnectorPanel = true;
                showConTextPanel = object.annotations.length > 0 && object.annotations[0].content ? true : false;
            }
        });

        let selectItem1 = document.getElementById("diagram").ej2_instances[0].selectedItems;
        let textNode;
        if (showNodePanel) {
            nodeContainer.style.display = "";
            nodeContainer.classList.add("multiple");
            if (showConnectorPanel) {
                nodeContainer.classList.add("connector");
            }
            this.selectedItem.utilityMethods.bindNodeProperties(selectItem1.nodes[0], this.selectedItem, true);
        }
        if (showConnectorPanel && !showNodePanel) {
            document.getElementById("connectorPropertyContainer").style.display = "";
            this.selectedItem.utilityMethods.bindConnectorProperties(selectItem1.connectors[0], this.selectedItem, true);
        }
        if (showTextPanel || showConTextPanel) {
            
            if (showConTextPanel) {
                this.ddlTextPosition.dataSource = this.selectedItem.textProperties.getConnectorTextPositions();
            } else {
                this.ddlTextPosition.dataSource = this.selectedItem.textProperties.getNodeTextPositions();
            }
            this.ddlTextPosition.dataBind();
            let labelNode;
            if (selectItem1.nodes && selectItem1.nodes.length > 0) {
                labelNode = selectItem1.nodes.find(node=>node.annotations && node.annotations.length > 0 && node.annotations[0].content);
                if (labelNode) {
                    let el = document.getElementById("textPropertyContainer");
                    el.style.display = "";
                    document.getElementById("toolbarTextAlignmentDiv").style.display = "";
                    document.getElementById("textPositionDiv").style.opacity = 1;
                    document.getElementById("textPositionDiv").style.pointerEvents = 'all';
                    document.getElementById("textPositionText").style.opacity = 1;
                    // Reset opacity controls for non-text nodes
                    const opacitySlider = document.getElementById('textOpacityProperty');
                    if (opacitySlider) {
                        opacitySlider.style.visibility = 'visible';
                    }
                    this.selectedItem.utilityMethods.bindTextProperties(labelNode.annotations[0].style, this.selectedItem);
                    this.selectedItem.utilityMethods.updateHorVertAlign(labelNode.annotations[0].horizontalAlignment, labelNode.annotations[0].verticalAlignment);
                }
            }
        }
        if (selectItem1.nodes && selectItem1.nodes.length > 0) {
            textNode = selectItem1.nodes.find(node=> node.shape && node.shape.type === "Text");
            if (textNode) {
                let el = document.getElementById("textPropertyContainer");
                el.style.display = "";
                document.getElementById("toolbarTextAlignmentDiv").style.display = "none";
                document.getElementById("textPositionDiv").style.opacity = 0.5;
                document.getElementById("textPositionDiv").style.pointerEvents = 'none';
                document.getElementById("textPositionText").style.opacity = 0.5;
                // Disable opacity slider and text input
                const opacitySlider = document.getElementById('textOpacityProperty');
                if (opacitySlider) {
                    opacitySlider.style.visibility = 'hidden';
                }
                this.selectedItem.utilityMethods.bindTextProperties(textNode.style, this.selectedItem);
            }
        }
    }

    // Sets properties for a single selected diagram item, handling nodes and connectors.
    singleSelectionSettings(selectedObject) {
        let object;
        if (selectedObject instanceof Node) {
            this.selectedItem.utilityMethods.objectTypeChange("node");
            object = selectedObject;
            this.selectedItem.utilityMethods.bindNodeProperties(object, this.selectedItem);
        } else if (selectedObject instanceof Connector) {
            this.selectedItem.utilityMethods.objectTypeChange("connector");
            object = selectedObject;
            this.selectedItem.utilityMethods.bindConnectorProperties(object, this.selectedItem);
        }

        if (object.shape && object.shape.type === "Text") {
            let el = document.getElementById("textPropertyContainer");
            el.style.display = "";
            document.getElementById("toolbarTextAlignmentDiv").style.display = "none";
            document.getElementById("textPositionDiv").style.opacity = 0.5;
            document.getElementById("textPositionDiv").style.pointerEvents = 'none';
            document.getElementById("textPositionText").style.opacity = 0.5;
            // Disable opacity slider and text input
            const opacitySlider = document.getElementById('textOpacityProperty');
            if (opacitySlider) {
                opacitySlider.style.visibility = 'hidden';
            }
            this.selectedItem.utilityMethods.bindTextProperties(object.style, this.selectedItem);
        } else if (object.annotations.length > 0 && object.annotations[0].content) {
            let el = document.getElementById("textPropertyContainer");
            el.style.display = "";
            document.getElementById("toolbarTextAlignmentDiv").style.display = "";
            document.getElementById("textPositionDiv").style.opacity = 1;
            document.getElementById("textPositionDiv").style.pointerEvents = 'all';
            document.getElementById("textPositionText").style.opacity = 1;
             // Reset opacity controls for non-text nodes
            const opacitySlider = document.getElementById('textOpacityProperty');
            if (opacitySlider) {
                opacitySlider.style.visibility = 'visible';
            }
            this.selectedItem.utilityMethods.bindTextProperties(object.annotations[0].style, this.selectedItem);
            this.selectedItem.utilityMethods.updateHorVertAlign(object.annotations[0].horizontalAlignment, object.annotations[0].verticalAlignment);
            if (object.annotations[0] instanceof ShapeAnnotation) {
                let annotation = object.annotations[0];
                this.ddlTextPosition.dataSource = this.selectedItem.textProperties.getNodeTextPositions();
                this.ddlTextPosition.value = this.selectedItem.textProperties.textPosition = this.selectedItem.utilityMethods.getPosition(annotation.offset);
                this.ddlTextPosition.dataBind();
            } else if (object.annotations[0] instanceof PathAnnotation) {
                let annotation = object.annotations[0];
                this.ddlTextPosition.dataSource = this.selectedItem.textProperties.getConnectorTextPositions();
                this.ddlTextPosition.value = this.selectedItem.textProperties.textPosition = annotation.alignment;
                this.ddlTextPosition.dataBind();
            }
        }
    }

    // Updates node properties when its position changes in the diagram
    nodePositionChange(args) {
        this.selectedItem.preventPropertyChange = true;
        this.selectedItem.nodeProperties.offsetX.value = Math.round(args.newValue.offsetX * 100) / 100;
        this.selectedItem.nodeProperties.offsetY.value = Math.round(args.newValue.offsetY * 100) / 100;
        if (args.state === "Completed") {
            this.selectedItem.isModified = true;
            this.selectedItem.preventPropertyChange = false;
        }
    }

    // Updates node properties when its size changes in the diagram
    nodeSizeChange(args) {
        this.selectedItem.preventPropertyChange = true;
        this.selectedItem.nodeProperties.width.value = Math.round(args.newValue.width * 100) / 100;
        this.selectedItem.nodeProperties.height.value = Math.round(args.newValue.height * 100) / 100;
        if (args.state === "Completed") {
            this.selectedItem.isModified = true;
            this.selectedItem.preventPropertyChange = false;
        }
    }

    // Updates node properties when its rotation angle changes in the diagram
    nodeRotationChange(args) {
        this.selectedItem.preventPropertyChange = true;
        this.selectedItem.nodeProperties.rotateAngle.value = Math.round(args.newValue.rotateAngle * 100) / 100;
        this.selectedItem.preventPropertyChange = false;
        if (args.state === "Completed") {
            this.selectedItem.isModified = true;
        }
    }

    // Marks the diagram as modified when the selection changes
    collectionChange(args) {
        if (args.state === 'Changed') {
            this.selectedItem.isModified = true;
        }
    }

    // Adjusts size parameters of elements when they are dragged into the diagram
    dragEnter(args) {
        if (args.element.id.indexOf('Doorclose') !== -1) {
            args.element.width = 40;
            args.element.height = 42;
        }
        else if (args.element.id.indexOf('Doubledoorclose') !== -1) {
            args.element.width = 80;
            args.element.height = 42;
        }
        else if (args.element.id.indexOf('CircleDiningTable') !== -1) {
            args.element.width = 50;
            args.element.height = 50;
        }
        else if (args.element.id.indexOf('CircleStudyTable') !== -1 || args.element.id.indexOf('CircleStudyTable1') !== -1 || args.element.id.indexOf('CircleStudyTable2') !== -1 || args.element.id.indexOf('CircleStudyTable3') !== -1) {
            args.element.width = 40;
            args.element.height = 40;
        }
        else if (args.element.id.indexOf('RectangleDiningTable') !== -1) {
            args.element.width = 50;
            args.element.height = 50;
        }
        else if (args.element.id.indexOf('OblongDiningTable') !== -1 || args.element.id.indexOf('OvalDiningTable') !== -1) {
            args.element.width = 90;
            args.element.height = 50;
        }
        else if (args.element.id.indexOf('RectangularTableforTwo') !== -1 || args.element.id.indexOf('CircularTableforTwo') !== -1) {
            args.element.width = 50;
            args.element.height = 60;
        }
        else if (args.element.id.indexOf('RectangleStudyTable') !== -1 || args.element.id.indexOf('RectangleStudyTable1') !== -1) {
            args.element.width = 80;
            args.element.height = 40;
        }
        else if (args.element.id.indexOf('Refrigerator') !== -1) {
            args.element.width = 52;
            args.element.height = 60;
        }
        else if (args.element.id.indexOf('Stool') !== -1) {
            args.element.width = 23;
            args.element.height = 23;
        }
        else if (args.element.id.indexOf('WallCorner') !== -1 || args.element.id.indexOf('WallCorner1') !== -1) {
            args.element.width = 50;
            args.element.height = 50;
        }
        else if (args.element.id.indexOf('WaterCooler') !== -1 || args.element.id.indexOf('Elevator') !== -1) {
            args.element.width = 40;
            args.element.height = 40;
        }
        else if (args.element.id.indexOf('Chair1') !== -1) {
            args.element.width = 25;
            args.element.height = 25;
        }
        else if (args.element.id.indexOf('Chair') !== -1 || args.element.id.indexOf('LargePlant') !== -1) {
            args.element.width = 28;
            args.element.height = 32;
        }
        else if (args.element.id.indexOf('Doublebed') !== -1 || args.element.id.indexOf('Doublebed1') !== -1) {
            args.element.width = 100;
            args.element.height = 90;
        }
        else if (args.element.id.indexOf('Singlebed') !== -1 || args.element.id.indexOf('Singlebed1') !== -1) {
            args.element.width = 50;
            args.element.height = 90;
        }
        else if (args.element.id.indexOf('BookCase') !== -1) {
            args.element.width = 60;
            args.element.height = 20;
        }
        else if (args.element.id.indexOf('Warddrobe') !== -1 || args.element.id.indexOf('Warddrobe1') !== -1) {
            args.element.width = 73;
            args.element.height = 35;
        }
        else if (args.element.id.indexOf('SmallPlant') !== -1 || args.element.id.indexOf('Lamplight') !== -1) {
            args.element.width = 25;
            args.element.height = 25;
        }
        else if (args.element.id.indexOf('Matte') !== -1 || args.element.id.indexOf('Matte1') !== -1) {
            args.element.width = 40;
            args.element.height = 20;
        }
        else if (args.element.id.indexOf('FlatTV') !== -1 || args.element.id.indexOf('FlatTV1') !== -1) {
            args.element.width = 68;
            args.element.height = 10;
        }
        else if (args.element.id.indexOf('TV') !== -1) {
            args.element.width = 40;
            args.element.height = 25;
        }
        else if (args.element.id.indexOf('SingleSofa') !== -1 || args.element.id.indexOf('Couch') !== -1) {
            args.element.width = 45;
            args.element.height = 40;
        }
        else if (args.element.id.indexOf('Sofa') !== -1 || args.element.id.indexOf('DoubleSofa') !== -1 || args.element.id.indexOf('Lounge') !== -1) {
            args.element.width = 100;
            args.element.height = 35;
        }
        else if (args.element.id.indexOf('WindowGarden') !== -1) {
            args.element.width = 80;
            args.element.height = 18;
        }
        else if (args.element.id.indexOf('SmallGasRange') !== -1) {
            args.element.width = 80;
            args.element.height = 32;
        }
        else if (args.element.id.indexOf('LargeGasRange') !== -1 || args.element.id.indexOf('LargeGasRange1') !== -1) {
            args.element.width = 100;
            args.element.height = 32;
        }
        else if (args.element.id.indexOf('Window') !== -1 || args.element.id.indexOf('window1') !== -1) {
            args.element.width = 50;
            args.element.height = 6;
        }
        else if (args.element.id.indexOf('Piano') !== -1) {
            args.element.width = 68;
            args.element.height = 71;
        }
        else if (args.element.id.indexOf('Staircase1') !== -1) {
            args.element.width = 150;
            args.element.height = 100;
        }
        else if (args.element.id.indexOf('Staircase') !== -1) {
            args.element.width = 150;
            args.element.height = 50;
        }
        else if (args.element.id.indexOf('Printer') !== -1 || args.element.id.indexOf('Laptop') !== -1) {
            args.element.width = 30;
            args.element.height = 30;
        }
        else if (args.element.id.indexOf('Room') !== -1 || args.element.id.indexOf('TRoom') !== -1 || args.element.id.indexOf('LRoom') !== -1 || args.element.id.indexOf('TWall') !== -1) {
            args.element.width = 50;
            args.element.height = 50;
        }
        else if (args.element.id.indexOf('DoubleSink') !== -1 || args.element.id.indexOf('DoubleSink1') !== -1 || args.element.id.indexOf('DoubleSink2') !== -1 || args.element.id.indexOf('DoubleSink4') !== -1) {
            args.element.width = 76;
            args.element.height = 38;
        }
        else if (args.element.id.indexOf('Toilet1') !== -1 || args.element.id.indexOf('Toilet2') !== -1) {
            args.element.width = 23;
            args.element.height = 36;
        }
        else if (args.element.id.indexOf('CornerShower') !== -1 || args.element.id.indexOf('Shower') !== -1) {
            args.element.width = 50;
            args.element.height = 50;
        }
        else if (args.element.id.indexOf('WashBasin1') !== -1 || args.element.id.indexOf('WashBasin2') !== -1 || args.element.id.indexOf('WashBasin3') !== -1 || args.element.id.indexOf('WashBasin5') !== -1 || args.element.id.indexOf('WashBasin6') !== -1) {
            args.element.width = 35;
            args.element.height = 30;
        }
        else if (args.element.id.indexOf('BathTub') !== -1 || args.element.id.indexOf('BathTub1') !== -1 || args.element.id.indexOf('BathTub2') !== -1 || args.element.id.indexOf('BathTub3') !== -1) {
            args.element.width = 55;
            args.element.height = 30;
        }
        else {
            args.element.width = 50;
            args.element.height = 50;
        }
    }

    // Updates toolbar state based on the availability of undo and redo actions
    historyChange(args) {
        const diagram = document.getElementById("diagram").ej2_instances[0];
        const toolbarContainer = document.getElementsByClassName("db-toolbar-container")[0];
        const toolbarEditor = document.getElementById("toolbarEditor").ej2_instances[0];
        toolbarContainer.classList.remove("db-undo");
        toolbarContainer.classList.remove("db-redo");

        if (diagram.historyManager.undoStack.length > 0) {
            toolbarContainer.classList.add("db-undo");
            toolbarEditor.items[0].disabled = false;
        }
        else {
            toolbarEditor.items[0].disabled = true;
        }

        if (diagram.historyManager.redoStack.length > 0) {
            toolbarContainer.classList.add("db-redo");
            toolbarEditor.items[1].disabled = false;
        }
        else {
            toolbarEditor.items[1].disabled = true;
        }
    }

}

export class DiagramPropertyBinding {
    constructor(selectedItem) {
        this.selectedItem = selectedItem;
        this.diagram = null;
        this.ddlTextPosition = null;
    }

    // Updates page break settings and icons in response to checkbox changes
    pageBreaksChange(args) {
        const diagram = this.selectedItem.selectedDiagram;
        diagram.constraints = diagram.constraints &= ~ DiagramConstraints.UndoRedo;
        const btnViewMenu = document.getElementById('diagram-menu').ej2_instances[0];
        const items = btnViewMenu.items[4].items;
        if (args.event) {
            this.selectedItem.pageSettings.pageBreaks = args.checked;
            this.selectedItem.selectedDiagram.pageSettings.showPageBreaks = args.checked;
            items[4].iconCss = args.checked === true ? 'sf-icon-check-tick' : '';
        }
        diagram.dataBind();
        diagram.constraints = diagram.constraints |= DiagramConstraints.UndoRedo;
    }

    diagramPropertiesChange(args) {
        const diagram = this.selectedItem.selectedDiagram;
        diagram.constraints = diagram.constraints &= ~ DiagramConstraints.UndoRedo;
        const btnViewMenu = document.getElementById('diagram-menu').ej2_instances[0];
        const items = btnViewMenu.items[3].items;
        if (args.event) {
             let command = (args.event.currentTarget.textContent.replace(/[" "]/g, "").toLowerCase());
                switch(command){
                case 'showrulers':
                    diagram.rulerSettings.showRulers = args.checked;
                    items[0].iconCss = args.checked === true ? 'sf-icon-check-tick' : '';
                    break;
                case 'showgrid':
                    diagram.snapSettings.constraints = diagram.snapSettings.constraints ^ SnapConstraints.ShowLines;
                    items[1].iconCss = args.checked === true ? 'sf-icon-check-tick' : '';
                    break;
                case 'snaptogrid':
                    diagram.snapSettings.constraints = diagram.snapSettings.constraints ^ SnapConstraints.SnapToLines;
                    items[2].iconCss = args.checked === true ? 'sf-icon-check-tick' : '';
                    break;
                case 'showguides':
                    diagram.snapSettings.constraints = diagram.snapSettings.constraints ^ SnapConstraints.SnapToObject;
                    items[3].iconCss = args.checked === true ? 'sf-icon-check-tick' : '';
                    break;
                default:
                    break;
                }
        }
        diagram.dataBind();
        diagram.constraints = diagram.constraints |= DiagramConstraints.UndoRedo;
    }

    // Adjusts diagram page settings based on selected paper size
    paperListChange(args) {
        const diagram = this.selectedItem.selectedDiagram;
        diagram.constraints = diagram.constraints &= ~ DiagramConstraints.UndoRedo;
        document.getElementById('pageDimension').style.display = 'none';
        document.getElementById('pageOrientation').style.display = '';
        const viewmenu = document.getElementById('diagram-menu').ej2_instances[0];
        const value = args.value || args.item.value;
        const paperSize = this.selectedItem.utilityMethods.getPaperSize(value);
        let pageWidth = paperSize.pageWidth;
        let pageHeight = paperSize.pageHeight;
        if (pageWidth && pageHeight) {
            if (diagram.pageSettings.orientation === 'Portrait') {
                if (pageWidth > pageHeight) {
                    [pageWidth, pageHeight] = [pageHeight, pageWidth];
                }
            } else {
                if (pageHeight > pageWidth) {
                    [pageHeight, pageWidth] = [pageWidth, pageHeight];
                }
            }
            diagram.pageSettings.width = pageWidth;
            diagram.pageSettings.height = pageHeight;
            this.selectedItem.pageSettings.pageWidth = pageWidth;
            this.selectedItem.pageSettings.pageHeight = pageHeight;
        } else {
            document.getElementById('pageOrientation').style.display = 'none';
            document.getElementById('pageDimension').style.display = '';
            diagram.pageSettings.width = 1460;
            diagram.pageSettings.height = 600;
        }
        this.updatePaperSelection(viewmenu.items[3].items[1],value);
        diagram.dataBind();
        diagram.constraints = diagram.constraints |= DiagramConstraints.UndoRedo;
    }

    // Updates the selection icon in the menu for paper sizes
    updatePaperSelection(items, value) {
        for (var i = 0; i < items.items.length; i++) {
            if (value === items.items[i].value) {
                items.items[i].iconCss = 'sf-icon-check-tick';
            }
            else {
                items.items[i].iconCss = '';
            }
        }
    }

    // update the selection icon based on check and uncheck values of the Menubar Items.
    updateSelection(item) {
        for (var i = 0; i < item.parentObj.items.length; i++) {
            if (item.text === item.parentObj.items[i].text) {
                item.parentObj.items[i].iconCss = 'sf-icon-check-tick';
            }
            else {
                item.parentObj.items[i].iconCss = '';
            }
        }
    };

    // Modifies the page dimensions based on user input values
    pageDimensionChange(args) {
        if (args.event) {
            let pageWidth = Number(this.selectedItem.pageSettings.pageWidth);
            let pageHeight = Number(this.selectedItem.pageSettings.pageHeight);
            let target = args.event.target instanceof HTMLInputElement ? args.event.target : args.event.target.parentElement.children[0];
            const diagram = this.selectedItem.selectedDiagram;
            if (target.id === "pageWidth") {
                pageWidth = Number(target.value);
            } else {
                pageHeight = Number(target.value);
            }
            if (pageWidth && pageHeight) {
                if (pageWidth > pageHeight) {
                    this.selectedItem.pageSettings.isPortrait = false;
                    this.selectedItem.pageSettings.isLandscape = true;
                    diagram.pageSettings.orientation = "Landscape";
                } else {
                    this.selectedItem.pageSettings.isPortrait = true;
                    this.selectedItem.pageSettings.isLandscape = false;
                    diagram.pageSettings.orientation = "Portrait";
                }
                this.selectedItem.pageSettings.pageWidth = diagram.pageSettings.width = pageWidth;
                this.selectedItem.pageSettings.pageHeight = diagram.pageSettings.height = pageHeight;
                diagram.dataBind();
            }
        }
    }

    // Changes page orientation between portrait and landscape
    pageOrientationChange(args) {
        if (args.target) {
            const target = args.target;
            const arrangeContextMenu = document.getElementById('diagram-menu').ej2_instances[0];
            const diagram = this.selectedItem.selectedDiagram;
            diagram.constraints = diagram.constraints &= ~DiagramConstraints.UndoRedo;
            const items = arrangeContextMenu.items[3].items;
            const option = target.id ? target.id : (args.currentTarget.ej2_instances[0].iconCss === 'sf-icon-portrait' ? 'pagePortrait' : 'pageLandscape');
            switch (option) {
                case 'pagePortrait':
                    diagram.pageSettings.orientation = 'Portrait';
                    this.selectedItem.pageSettings.isPortrait = true;
                    this.selectedItem.pageSettings.isLandscape = false;
                    items[0].items[0].iconCss = '';
                    items[0].items[1].iconCss = 'sf-icon-check-tick';
                    document.getElementById('pageLandscape').classList.remove('e-active');
                    break;
                case 'pageLandscape':
                    diagram.pageSettings.orientation = 'Landscape';
                    this.selectedItem.pageSettings.isPortrait = false;
                    this.selectedItem.pageSettings.isLandscape = true;
                    items[0].items[0].iconCss = 'sf-icon-check-tick';
                    items[0].items[1].iconCss = '';
                    document.getElementById('pagePortrait').classList.remove('e-active');
                    break;
                default:
                    break;
            }
            diagram.dataBind();
            diagram.constraints = diagram.constraints |= DiagramConstraints.UndoRedo;
        }
    }

    // Changes the background color of the diagram page
    pageBackgroundChange1(args) {
        if (args.currentValue) {
            const diagram = this.selectedItem.selectedDiagram;
            diagram.constraints = diagram.constraints &= ~DiagramConstraints.UndoRedo;
            diagram.pageSettings.background = { color: args.currentValue.rgba };
            diagram.dataBind();
            diagram.constraints = diagram.constraints |= DiagramConstraints.UndoRedo;
        }
    }

    // Updates text position properties based on dropdown selection
    textPositionChange(args) {
        if (args.value !== null) {
            this.textPropertyChange("textPosition", args.value);
        }
    }

    // Handles changes in text style (bold, italic) from toolbar interactions
    toolbarTextStyleChange(args) {
        this.textPropertyChange(args.item.tooltipText, false);
    }

    // Updates text sub-alignment properties from toolbar settings
    toolbarTextSubAlignChange(args) {
        const propertyName = args.item.tooltipText.replace(/[" "]/g, "");
        this.textPropertyChange(propertyName, propertyName);
    }

    // Sets text alignment properties from toolbar settings
    toolbarTextAlignChange(args) {
        let propertyName = args.item.tooltipText.replace("Align ", "");
        const directionMap = {
            Left: "Right",
            Right: "Left",
            Top: "Bottom",
            Bottom: "Top"
        };
        propertyName = directionMap[propertyName] || propertyName;
        this.textPropertyChange(propertyName, propertyName);
    }

    // Applies specified text properties to the selected diagram annotations
    textPropertyChange(propertyName, propertyValue) {
        if (!this.selectedItem.preventPropertyChange) {
            const diagram = this.selectedItem.selectedDiagram;
            const selectedObjects = diagram.selectedItems.nodes.concat(diagram.selectedItems.connectors);
            propertyName = propertyName.toLowerCase();
            if (selectedObjects.length > 0) {
                selectedObjects.forEach(node => {
                    if (node.annotations.length > 0) {
                        node.annotations.forEach((annotation, j) => {
                            if (node.annotations[j] instanceof ShapeAnnotation) {
                                if (propertyName === "textposition") {
                                    this.selectedItem.textProperties.textPosition = propertyValue.toString();
                                    annotation.offset = this.selectedItem.utilityMethods.getOffset(propertyValue);
                                }
                            } else if (node.annotations[j] instanceof PathAnnotation) {
                                if (propertyName === "textposition") {
                                    this.selectedItem.textProperties.textPosition = propertyValue.toString();
                                    annotation.alignment = this.selectedItem.textProperties.textPosition;
                                }
                            }
                            if (["left", "right", "center"].includes(propertyName)) {
                                annotation.horizontalAlignment = propertyValue;
                                this.selectedItem.utilityMethods.updateHorVertAlign(annotation.horizontalAlignment, annotation.verticalAlignment);
                            } else if (["top", "bottom"].includes(propertyName)) {
                                annotation.verticalAlignment = propertyValue;
                                this.selectedItem.utilityMethods.updateHorVertAlign(annotation.horizontalAlignment, annotation.verticalAlignment);
                            } else if (propertyName === "middle") {
                                annotation.verticalAlignment = "Center";
                                this.selectedItem.utilityMethods.updateHorVertAlign(annotation.horizontalAlignment, annotation.verticalAlignment);
                            } else {
                                this.updateTextProperties(propertyName, propertyValue, annotation.style);
                            }
                        });
                    } else if (node.shape && node.shape.type === "Text") {
                        this.updateTextProperties(propertyName, propertyValue, node.style);
                    }
                });
                diagram.dataBind();
                this.selectedItem.isModified = true;
            }
        }
    }

    // Modifies text properties like bold, italic, and alignment for an annotation
    updateTextProperties(propertyName, propertyValue, annotation) {
        switch (propertyName) {
            case "bold":
                annotation.bold = !annotation.bold;
                this.updateToolbarState("toolbarTextStyle", annotation.bold, 0);
                break;
            case "italic":
                annotation.italic = !annotation.italic;
                this.updateToolbarState("toolbarTextStyle", annotation.italic, 1);
                break;
            case "underline":
                this.selectedItem.textProperties.textDecoration = !this.selectedItem.textProperties.textDecoration;
                annotation.textDecoration = annotation.textDecoration === "None" || !annotation.textDecoration ? "Underline" : "None";
                this.updateToolbarState("toolbarTextStyle", this.selectedItem.textProperties.textDecoration, 2);
                break;
            case "aligntextleft":
            case "aligntextright":
            case "aligntextcenter":
                annotation.textAlign = propertyValue.replace("AlignText", "");
                this.selectedItem.utilityMethods.updateTextAlign(annotation.textAlign);
                break;
            default:
                break;
        }
    }

    // Updates the visual state of toolbar items based on text property changes
    updateToolbarState(toolbarName, isSelected, index) {
        let toolbarTextStyle = document.getElementById(toolbarName);
        if (toolbarTextStyle) {
            toolbarTextStyle = toolbarTextStyle.ej2_instances[0];
            if (toolbarTextStyle) {
                const cssClass = toolbarTextStyle.items[index].cssClass;
                toolbarTextStyle.items[index].cssClass = isSelected ? cssClass + ' tb-item-selected' : cssClass.replace(' tb-item-selected', '');
                toolbarTextStyle.dataBind();
            }
        }
    }
}

