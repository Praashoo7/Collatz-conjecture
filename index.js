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
    let evenCount = 0
    let oddCount= 0
    let addEvenCount = 0
    let addOddCount = 0

    while(n!=0 && n){
        if(n%2==0){
            addEvenCount = addEvenCount+n
            n=n/2
            data.push(n)
            evenCount=evenCount+1
        } else if(n==1) {
            addOddCount = addOddCount+n
            data.push(n)
            n=0
            document.getElementById('chartDisplayText').style.opacity = 0;
            updateGraph(data)
            break
        } else {
            console.log("ODD : ", n)
            addOddCount = addOddCount+n
            n = n*3
            n = n+1
            data.push(n)
            oddCount=oddCount+1
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
    document.getElementById('chartDataOddText1').innerHTML = "Even Numbers : " + evenCount
    document.getElementById('chartDataEvenText1').innerHTML = "Odd Numbers : " + oddCount
    document.getElementById('chartDataOddText2').innerHTML = "Even Numbers Added : " + addEvenCount
    document.getElementById('chartDataEvenText2').innerHTML = "Odd Numbers Added : " + addOddCount
    updateGraph(data);
}

function createChart() {
    
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
        fontFamily: "Fredoka"
    });
    xAxis.get("renderer").labels.template.set("maxWidth", 200);
    xAxis.get("renderer").labels.template.adapters.add("visible", function(visible, target) {
        return xAxis.dataItems.indexOf(target.dataItem) % Math.ceil(xAxis.dataItems.length / 20) === 0;
    });

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
        fontFamily: "Fredoka",
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

    series.set("valueYShow", "valueYWorking");
    series.set("valueYNumberFormatter", numberFormatter);

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

    series.setAll({
        tooltip: am5.Tooltip.new(root, {
            labelText: "{valueY}"
        }),
        tooltipY: 0
    });

    series.get("tooltip").label.setAll({
        fontFamily: "Fredoka"
    });

    chart.set("scrollbarX", am5.Scrollbar.new(root, {
        orientation: "horizontal"
    }));

    chart.set("scrollbarY", am5.Scrollbar.new(root, {
        orientation: "vertical"
    }));

    // var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
    //     behavior: "none"
    // }));
    // cursor.lineY.set("visible", true);
    // cursor.lineX.set("visible", true);

    series.appear(1000);
    chart.appear(1000, 100);
    
}

function updateGraph(data){
    createChart();

    let chartData = data.map((value, index) => ({
        category: "Value " + (index + 1),
        value: value
    }));

    series.data.setAll(chartData);
    xAxis.data.setAll(chartData);
}



/* ----------------------------- INFO-POPUP ----------------------------- */

function openHelp(){
    document.getElementById('infoMain').style.opacity = 1
    document.getElementById('infoMain').style.zIndex = 9999
}

function closeHelp(){
    document.getElementById('infoMain').style.opacity = 0
    document.getElementById('infoMain').style.zIndex = -2
}