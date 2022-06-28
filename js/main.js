const MARGIN = { LEFT: 20, RIGHT: 100, TOP: 50, BOTTOM: 100 }
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM

const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)


// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
// set radius size for circle markers
var radius = Math.min(svgWidth/40, svgHeight/40);
console.log(`radius size ${radius}`)

// Create an SVG wrapper
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("viewBox", [0, 0, svgWidth, svgHeight].join(' '));
//   .attr("width", svgWidth)
//   .attr("height", svgHeight);
  

// Append an SVG group
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`)



// loading data
d3.csv("https://https://raw.githubusercontent.com/tpputri/D3-Challenge/main/Data/data.csv").then(function(smokingData, err) {
    if (err) throw err;


// parse data
    smokingData.forEach(function(d) {
        d.poverty = +d.poverty;
        d.povertyMoe = +d.povertyMoe;
        d.age = +d.age;
        d.ageMoe = +d.ageMoe;
        d.income = +d.income;
        d.incomeMoe = +d.incomeMoe;
        d.healthcare = +d.healthcare;
        d.healthcareLow = +d.healthcareLow;
        d.healthcareHigh = +d.healthcareHigh;
        d.obesity = +d.obesity;
        d.obesityLow = +d.obesityLow;
        d.obesityHigh = +d.obesityHigh;
        d.smokes = +d.smokes;
        d.smokesLow = +d.smokesLow;
        d.smokesHigh = +d.smokesHigh;
      });
    
    console.log(smokingData);
    console.log(`default X:${activeXAxis}; Y: ${activeYAxis}`);


//   scale functions
    var xLinearScale = setXScale(smokingData, activeXAxis);
    var yLinearScale = setYScale(smokingData, activeYAxis);   


// initial axes
    var bottomAx = d3.axisBottom(xLinearScale);
    var leftAx = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAx);

  var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAx);


// data binding and charts
  var circlesGroup = chartGroup.selectAll(".stateCircle")
        .data(smokingData)
        .enter()
        .append("circle")
        .attr("class", "stateCircle")
        .attr("cx", d => xLinearScale(d[activeXAxis]))
        .attr("cy", d => yLinearScale(d[activeYAxis]))
        .attr("r", radius)

  var textGroup = chartGroup.selectAll(".stateText")
        .data(smokingData)
        .enter()
        .append("text")
        .attr("class", "stateText")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d[activeXAxis]))
        .attr("y", d => yLinearScale(d[activeYAxis])+(radius/2))
        .attr("font-size", `${radius}px`);


// Create axes labels
    var yLabelsGroup = chartGroup.append("g")
        .attr("class", "chartLabel")
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("dy", "1em");
    
    var healthLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 80)
        .attr("x", 0 - (height / 2))
        .attr("value", "healthcare")
        .classed("active", true)
        .text("% Lacking Health Care");

    var smokeLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 60)
        .attr("x", 0 - (height / 2))
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("% Smokes");

    var obesityLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("value", "obesity")
        .classed("inactive", true)
        .text("% Obese");

    var xLabelsGroup = chartGroup.append("g")
        .attr("class", "chartLabel")
        .attr("text-anchor", "middle");

    var povertyLabel = xLabelsGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("value", "poverty")
        .classed("active", true)
        .text("% In Poverty");
    
    var ageLabel = xLabelsGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 50})`)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (Median)");

    var incomeLabel = xLabelsGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 70})`)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Household Income (Median)");

// initial toolTip
    updateToolTip(textGroup, activeXAxis, activeYAxis);


// event listeners for changing axes
    xLabelsGroup.selectAll("text").on("click", function(){
        var value = d3.select(this).attr("value");
        
        if (value !==activeXAxis){
            console.log(`switched X to ${value}`);
            activeXAxis=value;
            xLinearScale = setXScale(smokingData, value);
            xAxis = renderX(xLinearScale, xAxis);
            circlesGroup = xCircleUpdate(circlesGroup, xLinearScale, value);
            textGroup = xTextUpdate(textGroup, xLinearScale, value);
            
            updateToolTip(textGroup, activeXAxis, activeYAxis);

            if (activeXAxis === "poverty") {
                povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
              }
              else if (activeXAxis === "age") {
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                 }
              else if (activeXAxis === "income"){
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", true)
                    .classed("inactive", false);            
            }

        }
    });

    yLabelsGroup.selectAll("text").on("click", function(){
        var value = d3.select(this).attr("value");
        
        if (value !==activeYAxis){
            console.log(`switched Y to ${value}`);
            activeYAxis = value;
            yLinearScale = setYScale(smokingData, value);
            yAxis = renderY(yLinearScale, yAxis);
            circlesGroup = yCircleUpdate(circlesGroup, yLinearScale, value);
            textGroup = yTextUpdate(textGroup, yLinearScale, value);
            
            updateToolTip(textGroup, activeXAxis, activeYAxis);

            if (activeYAxis === "healthcare") {
                healthLabel
                    .classed("active", true)
                    .classed("inactive", false);
                smokeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
              }

              else if (activeYAxis === "smokes") {
                healthLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokeLabel
                    .classed("active", true)
                    .classed("inactive", false);
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                 }
                 
              else if (activeYAxis == "obesity") {
                healthLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obesityLabel
                    .classed("active", true)
                    .classed("inactive", false);
                }   
        }
    });




})
    .catch(function(error) {
        console.log(error);
    });



// update functions
function setXScale(data, axisChoice){
    var xScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[axisChoice])*0.80 , d3.max(data, d => d[axisChoice])*1.05])
        .range([0, width]);
    
    console.log(`x range min ${d3.min(data, d => d[axisChoice])}, max ${d3.max(data, d => d[axisChoice])}`);

    return xScale;
}

function setYScale(data, axisChoice){
    var yScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[axisChoice])*0.80 , d3.max(data, d => d[axisChoice])*1.05])
        .range([height, 0]);
    
    console.log(`y range min ${d3.min(data, d => d[axisChoice])}, max ${d3.max(data, d => d[axisChoice])}`);

    return yScale;
}

function renderX (newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
  
    return xAxis;
}

function renderY (newXScale, yAxis) {
    var leftAxis = d3.axisLeft(newXScale);
  
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
  
    return yAxis;
}
  
function xCircleUpdate(circlesGroup, newXScale, value){
    
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d=>newXScale(d[value]));

    return circlesGroup;
}

function yCircleUpdate(circlesGroup, newYScale, value){

    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d=>newYScale(d[value]));

    return circlesGroup;
}

function xTextUpdate(textGroup, newXScale, value){
    
    textGroup.transition()
        .duration(1000)
        .attr("x", d=>newXScale(d[value]));

    return textGroup;
}

function yTextUpdate(textGroup, newYScale, value){
    
    textGroup.transition()
        .duration(1000)
        .attr("y", d=>newYScale(d[value])+(radius/2));

    return textGroup;
}

function updateToolTip (textGroup, activeXAxis, activeYAxis) {
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([25, -50])
        .html(function(d) {
            return (`<strong>${(d.state)}</strong> <br> 
                    ${(activeYAxis)}: ${(d[activeYAxis])}<br>
                    ${(activeXAxis)}: ${(d[activeXAxis])}`);
        });

    textGroup.call(toolTip);

    textGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
        })
        .on("mouseout", function(d) {
            toolTip.hide(d);
        });            
}
