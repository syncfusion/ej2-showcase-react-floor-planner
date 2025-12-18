export class DropDownDataSources {
constructor() {

    // Array defining different file export formats with their values
    this.fileFormats = [
      { text: "JPG", value: "JPG" },
      { text: "PNG", value: "PNG" },
      { text: "SVG", value: "SVG" }
    ];

    // Array defining different diagram export regions
    this.diagramRegions = [
      { text: "Content", value: "Content" },
    ];

    // Array defining border styles with specific patterns and class names
    this.borderStyles = [
      { text: "", value: "", className: "ddl-svg-style ddl_linestyle_none" },
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
        { text: 'Zoom In' },
        { text: 'Zoom Out' },
        { text: 'Zoom to Fit' },
        { text: 'Zoom to 50 %' },
        { text: 'Zoom to 100 %' },
        { text: 'Zoom to 200 %' }
    ];

    // Array listing different paper sizes and a custom option for diagram pages
    this.paperList = [
      { text: "Letter (216 mm x 356 mm)", value: "Letter" },
      { text: "Legal (216 mm x 356 mm)", value: "Legal" },
      { text: "Tabloid (279 mm x 432 mm)", value: "Tabloid" },
      { text: "A3 (297 mm x 420 mm)", value: "A3" },
      { text: "A4 (210 mm x 297 mm)", value: "A4" },
      { text: "A5 (148 mm x 210 mm)", value: "A5" },
      { text: "A6 (105 mm x 148 mm)", value: "A6" },
      { text: "Custom", value: "Custom" }
    ];

}

}

export default DropDownDataSources;
    
