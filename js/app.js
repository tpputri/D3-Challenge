
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "";

// function used for updating x-scale var upon click on axis label
function xScale(Data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(Data, d => d[chosenXAxis]) - (d3.min(Data, d => d[chosenXAxis]) * 0.03),
    d3.max(Data, d => d[chosenXAxis]) + (d3.min(Data, d => d[chosenXAxis]) * 0.03)])
    .range([0, width]);
  return xLinearScale;

}
// function used for updating y-scale var upon click on axis label
function yScale(Data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(Data, d => d[chosenYAxis]) - 1, 1 + d3.max(Data, d => d[chosenYAxis])])
    .range([height, 0]);

  return yLinearScale;
}

// function used for updating xAxis var upon click on  X axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on Y axis label
function renderAxesy(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}


// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]))
    .select(function () { return this.parentNode; })
    .select("circle")
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
  // .select(function() { return this.parentNode; })
  console.log(circlesGroup);
  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {



  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>${chosenXAxis}: ${d[chosenXAxis]}%<br>${chosenYAxis}: ${d[chosenYAxis]}%`);
    });


  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function (D3Data) {
    toolTip.show(D3Data);
  })
    // onmouseout event
    .on("mouseout", function (D3Data) {
      toolTip.hide(D3Data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("data-source/data.csv").then(function (D3Data, err) {
  if (err) throw err;

  var i = 3;
  var j = 12;
  // parse data
  function convert(i) {
    columnName = D3Data.columns[i];

    D3Data.forEach(function (data) {

      data[columnName] = +data[columnName];


    });
  }


  convert(i);
  convert(j);
  chosenXAxis = D3Data.columns[i];
  chosenYAxis = D3Data.columns[j];


  // Cal xLinearScale and YLinearScale function above csv import
  var xLinearScale = xScale(D3Data, chosenXAxis);
  var yLinearScale = yScale(D3Data, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .attr("transform", `translate(0, 0)`)
    .call(leftAxis);



  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(D3Data)
    .enter()
    .append("g")

    .attr("transform", `translate(0,0)`)
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .classed("stateCircle", true)


    .select(function () { return this.parentNode; })
    .append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .attr("dy", ".27em")
    .text(d => d.abbr)
    .classed('stateText', true);




  // Create group for three x-axis labels
  var XlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
  // Create group for three x-axis labels
  var YlabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

  var XLabel0 = XlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", 3) // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var XLabel1 = XlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", 5) // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  var XLabel2 = XlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", 7) // value to grab for event listener
    .classed("inactive", true)
    .text("Household income (Median)");

  // append y axis
  var YLabel0 = YlabelsGroup.append("text")

    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("inactive", true)
    .attr("value", 9) // value to grab for event listener
    .text("Lacks Healthcare (%)");

  // append y axis
  var YLabel1 = YlabelsGroup.append("text")

    .attr("y", 0 - margin.left + 20)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("inactive", true)
    .attr("value", 15) // value to grab for event listener
    .text("Smokes (%)");

  var YLabel2 = YlabelsGroup.append("text")

    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("active", true)
    .attr("value", 12) // value to grab for event listener
    .text("Obese (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  XlabelsGroup.selectAll("text")
    .on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {
        console.log(value)
        // replaces chosenXAxis with value
        chosenXAxis = D3Data.columns[value];
        convert(value);

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(D3Data, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes all the classess to iactive

        XLabel0.classed("inactive", true);
        XLabel1.classed("inactive", true);
        XLabel2.classed("inactive", true);
        d3.select(this).classed("inactive", false);
        d3.select(this).classed("active", true);

      }
    });

  // Y axis labels event listener
  YlabelsGroup.selectAll("text")
    .on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {
        console.log(value)
        // replaces chosenXAxis with value
        chosenYAxis = D3Data.columns[value];
        convert(value);

        console.log(chosenYAxis)

        // functions here found above csv import

        // updates y scale for new data
        yLinearScale = yScale(D3Data, chosenYAxis);


        // updates Y axis with transition
        yAxis = renderAxesy(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes all the classess to iactive

        YLabel0.classed("inactive", true);
        YLabel1.classed("inactive", true);
        YLabel2.classed("inactive", true);
        d3.select(this).classed("inactive", false);
        d3.select(this).classed("active", true);

      }
    });
}).catch(function (error) {
  console.log(error);
});