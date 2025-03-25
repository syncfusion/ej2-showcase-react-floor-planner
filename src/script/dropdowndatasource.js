export class DropDownDataSources {
constructor() {
    this.fileMenuItems = this.getFileMenuItems();
    this.editMenuItems = this.getEditMenuItems();
    this.viewMenuItems = this.getViewMenuItems();
    this.arrangeMenuItems = this.getArrangeMenuItems();
    this.insertMenuItems = this.getInsertMenuItems();

    // Array defining different file export formats with their values
    this.fileFormats = [
      { text: "JPG", value: "JPG" },
      { text: "PNG", value: "PNG" },
      { text: "SVG", value: "SVG" }
    ];

    // Array defining different diagram export regions
    this.diagramRegions = [
      { text: "Content", value: "Content" },
      { text: "PageSettings", value: "PageSettings" }
    ];

    // Array defining border styles with specific patterns and class names
    this.borderStyles = [
      { text: "None", value: "None", className: "ddl-svg-style ddl_linestyle_none" },
      { text: "1,2", value: "1,2", className: "ddl-svg-style ddl_linestyle_one_two" },
      { text: "3,3", value: "3,3", className: "ddl-svg-style ddl_linestyle_three_three" },
      { text: "5,3", value: "5,3", className: "ddl-svg-style ddl_linestyle_five_three" },
      { text: "4,4,1", value: "4,4,1", className: "ddl-svg-style ddl_linestyle_four_four_one" }
    ];

    // Array listing font families available for text styling
    this.fontFamilyList = [
      { text: "Arial", value: "Arial" },
      { text: "Aharoni", value: "Aharoni" },
      { text: "Bell MT", value: "Bell MT" },
      { text: "Fantasy", value: "Fantasy" },
      { text: "Times New Roman", value: "Times New Roman" },
      { text: "Segoe UI", value: "Segoe UI" },
      { text: "Verdana", value: "Verdana" }
    ];

    // Array defining various zoom levels and options for fitting the screen
    this.zoomMenuItems = [
        { text: 'Zoom In' }, { text: 'Zoom Out' }, { text: 'Zoom to Fit' }, { text: 'Zoom to 50%' },
        { text: 'Zoom to 100%' }, {text: 'Zoom to 200%'}
    ];

    // Array listing different paper sizes and a custom option for diagram pages
    this.paperList = [
      { text: "Letter (8.5 in x 11 in)", value: "Letter" },
      { text: "Legal (8.5 in x 14 in)", value: "Legal" },
      { text: "Tabloid (279 mm x 432 mm)", value: "Tabloid" },
      { text: "A3 (297 mm x 420 mm)", value: "A3" },
      { text: "A4 (210 mm x 297 mm)", value: "A4" },
      { text: "A5 (148 mm x 210 mm)", value: "A5" },
      { text: "A6 (105 mm x 148 mm)", value: "A6" },
      { text: "Custom", value: "Custom" }
    ];

}

  // Returns the list of file menu items with corresponding icons
  getFileMenuItems() {
    return [
      { text: 'New', iconCss: 'sf-icon-new' },
      { text: 'Open', iconCss: 'sf-icon-open' },
      { text: 'Save', iconCss: 'sf-icon-save' },
      { text: 'Export', iconCss: 'sf-icon-export' },
      { text: 'Print', iconCss: 'sf-icon-print' }
    ];
  }

  // Returns the list of edit menu items with corresponding icons
  getEditMenuItems() {
    return [
      { text: 'Undo', iconCss: 'sf-icon-undo' },
      { text: 'Redo', iconCss: 'sf-icon-redo' },
      { separator: true },
      { text: 'Copy', iconCss: 'sf-icon-copy' },
      { text: 'Cut', iconCss: 'sf-icon-cut' },
      { text: 'Paste', iconCss: 'sf-icon-paste' },
      { separator: true },
      { text: 'Delete', iconCss: 'sf-icon-delete' }
    ];
  }

  // Returns the list of view menu items such as rulers, grids, and fit options
  getViewMenuItems() {
    return [
      { text: 'Show Rulers', iconCss: 'sf-icon-check-tick' },
      { text: 'Show Grid', iconCss: 'sf-icon-check-tick' },
      { separator: true },
      { text: 'Snap To Grid',iconCss: 'sf-icon-check-tick' },
      { text: 'Show Guides', iconCss: 'sf-icon-check-tick' },
      { text: 'Page Break' },
      { separator: true },
      { text: 'Fit To Screen' },
      { separator: true }
    ];
  }

  // Returns the list of insert menu items for image and link insertion
  getInsertMenuItems() {
    return [
      { text: 'Insert Image', iconCss: 'sf-icon-insert_image' },
      { text: 'Insert Link', iconCss: 'sf-icon-insert_link' }
    ];
  }

  // Returns the list of arrange menu items including orientation and page size options
  getArrangeMenuItems() {
    return [
      {
        text: 'Orientation',
        items: [
          { text: 'Landscape', iconCss: 'sf-icon-check-tick' },
          { text: 'Portrait' }
        ]
      },
      {
        text: 'Page Size',
        items: [
          { text: 'Letter (8.5 in x 11 in)', value: 'Letter', iconCss: 'sf-icon-check-tick' },
          { text: 'Legal (8.5 in x 14 in)', value: 'Legal' },
          { text: 'Tabloid (279 mm x 432 mm)', value: 'Tabloid' },
          { text: 'A3 (297 mm x 420 mm)', value: 'A3' },
          { text: 'A4 (210 mm x 297 mm)', value: 'A4' },
          { text: 'A5 (148 mm x 210 mm)', value: 'A5' },
          { text: 'A6 (105 mm x 148 mm)', value: 'A6' }
        ]
      }
    ];
  }
}

export default DropDownDataSources;
    
