// Global variables to store chart elements
let root, chart, xAxis, yAxis, series;

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const button = document.getElementById('submit');
        let dataN = parseInt(document.getElementById('inputData').value)
        if ((button) && (dataN)) {
            button.click();
        }
    }
});

function doit(){
    let n = parseInt(document.getElementById('inputData').value)
    let data = []

    while(n!=0 && n){
        if(n%2==0){
            n=n/2
            data.push(n)
        } else if(n==1) {
            data.push(n)
            n=0
            document.getElementById('chartDisplayText').style.opacity = 0;
            updateGraph(data)
            break
        } else {
            n = n*3
            n = n+1
            data.push(n)
        }
        const dataWrite = data.map((value) => {
            return `<p>${value}</p>`
        })
        let maximum = Math.max(...data);
        let minimum = Math.min(...data);
        document.getElementById('numberData').innerHTML = dataWrite.join(" ")
        document.getElementById('highest').innerHTML = "Highest Number : " + maximum
        document.getElementById('lowest').innerHTML = "Lowest Number : " + minimum
    }
    updateGraph(data);
}

function createChart() {
// Remove existing chart if it exists
if (root) {
    root.dispose();
}
root = am5.Root.new("chartdiv");
const myTheme = am5.Theme.new(root);
myTheme.rule("AxisLabel", ["minor"]).setAll({
    dy: 1
});
myTheme.rule("Grid", ["minor"]).setAll({
    strokeOpacity: 0.08
});
root.setThemes([
    am5themes_Animated.new(root),
    myTheme
]);
chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: false,
    panY: false,
    wheelX: "panX",
    wheelY: "zoomY",
    paddingLeft: 0
}));
var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
    behavior: "zoomXY"
}));
cursor.lineY.set("visible", true);
xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
    renderer: am5xy.AxisRendererX.new(root, {
        minGridDistance: 60,
        cellStartLocation: 0.1,
        cellEndLocation: 0.9,
        minorGridEnabled: true,
        minorLabelsEnabled: true
    }),
    categoryField: "category"
}));
xAxis.get("renderer").labels.template.setAll({
    rotation: -45,
    centerY: am5.p50,
    centerX: am5.p100,
    paddingRight: 15,
    fontFamily: "Fredoka" // Custom font for x-axis labels
});
xAxis.get("renderer").labels.template.set("maxWidth", 200);
xAxis.get("renderer").labels.template.adapters.add("visible", function(visible, target) {
    return xAxis.dataItems.indexOf(target.dataItem) % Math.ceil(xAxis.dataItems.length / 20) === 0;
});

// Custom number formatter
var numberFormatter = am5.NumberFormatter.new(root, {
    numericFields: ["value"]
});

numberFormatter.set("numberFormat", function(value) {
    if (Math.abs(value) >= 1e12) {
        return (value / 1e12).toFixed(1) + "T";
    } else if (Math.abs(value) >= 1e9) {
        return (value / 1e9).toFixed(1) + "B";
    } else if (Math.abs(value) >= 1e6) {
        return (value / 1e6).toFixed(1) + "M";
    } else if (Math.abs(value) >= 1e3) {
        return (value / 1e3).toFixed(1) + "K";
    } else {
        return value.toFixed(0);
    }
});

yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, {
        minGridDistance: 40
    }),
    numberFormat: "#a"
}));

yAxis.get("renderer").labels.template.setAll({
    fontFamily: "Fredoka", // Custom font for y-axis labels
    fontSize: 12,
    maxWidth: 50,
    oversizedBehavior: "truncate"
});

series = chart.series.push(am5xy.LineSeries.new(root, {
    name: "Series",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "value",
    categoryXField: "category",
    tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}"
    })
}));

// Apply the custom number formatter to the series
series.set("valueYShow", "valueYWorking");
series.set("valueYNumberFormatter", numberFormatter);

// Apply the custom number formatter to the tooltip
series.get("tooltip").label.set("numberFormatter", numberFormatter);

series.bullets.push(function () {
    var bulletCircle = am5.Circle.new(root, {
        radius: 5,
        fill: series.get("fill")
    });
    return am5.Bullet.new(root, {
        sprite: bulletCircle
    });
});

// Custom font for tooltip
series.get("tooltip").label.setAll({
    fontFamily: "Fredoka"
});

// Add horizontal scrollbar
chart.set("scrollbarX", am5.Scrollbar.new(root, {
    orientation: "horizontal"
}));

// Add vertical scrollbar
chart.set("scrollbarY", am5.Scrollbar.new(root, {
    orientation: "vertical"
}));

series.appear(1000);
chart.appear(1000, 100);


//ODD----EVEN

//     am5.ready(function() {
        
//         var root = am5.Root.new("chartdiv");
//         root.setThemes([am5themes_Animated.new(root)]);
  
//         var container = root.container.children.push(
//           am5.Container.new(root, {
//             width: am5.percent(100),
//             height: am5.percent(100),
//             layout: root.verticalLayout
//           })
//         );

//         var zoomableContainer = root.container.children.push(
//   am5.ZoomableContainer.new(root, {
//     width: am5.p100,
//     height: am5.p100,
//     wheelable: true,
//     pinchZoom: true
//   })
// );

// var zoomTools = zoomableContainer.children.push(am5.ZoomTools.new(root, {
//   target: zoomableContainer
// }));
  
//         var series = zoomableContainer.contents.children.push(
//           am5hierarchy.Tree.new(root, {
//             singleBranchOnly: false,
//             downDepth: 1,
//             initialDepth: 10,
//             valueField: "value",
//             categoryField: "name",
//             childDataField: "children"
//           })
//         );
  
//         series.labels.template.set("minScale", 0);

//         function generateTreeData(rootValue, values) {
//           var data = {
//             name: rootValue.toString(),
//             value: rootValue,
//             children: [
//               { name: "Even", children: [] },
//               { name: "Odd", children: [] }
//             ]
//           };
  
//           function addNode(value, parent) {
//             var newNode = {
//               name: value.toString(),
//               value: value
//             };
//             parent.children.push(newNode);
//             return newNode;
//           }
  
//           values.forEach(value => {
//             if (value % 2 === 0) {
//               addNode(value, data.children[0]);  // Add to "Even" branch
//             } else {
//               addNode(value, data.children[1]);  // Add to "Odd" branch
//             }
//           });
  
//           // Remove empty branches
//           data.children = data.children.filter(child => child.children.length > 0);
  
//           return data;
//         }
  
//         var rootValue = parseInt(document.getElementById('inputData').value);
//         var values = data;
  
//         var treeData = generateTreeData(rootValue, values);
//         series.data.setAll([treeData]);
//         series.appear(1000, 100);
//       });


    //ODD--EVEN END

    
}

function updateGraph(data){
    createChart(); // Recreate the chart

    let chartData = data.map((value, index) => ({
        category: "Value " + (index + 1),
        value: value
    }));

    series.data.setAll(chartData);
    xAxis.data.setAll(chartData);
}

// Don't create the chart when the page loads
// am5.ready(createChart);



/* ----------------------------- INFO-POPUP ----------------------------- */

function openHelp(){
    document.getElementById('infoMain').style.opacity = 1
    document.getElementById('infoMain').style.zIndex = 9999
}

function closeHelp(){
    document.getElementById('infoMain').style.opacity = 0
    document.getElementById('infoMain').style.zIndex = -2
}