
// function to collect data from meta data and put punction into the panel
function buildMetadata(sample) {

    // view data
    d3.json("samples.json").then((data) => {
        // console.log("main data" ,data);

        // stepping through the json to get to metadata
        var metadata = data.metadata;
        // console.log("Metadata" ,metadata);

        // filter metadata for a sample
        var resultArray = metadata.filter(sampleObject => sampleObject.id == sample);
        // console.log("resultsArray", resultArray);

        // cleaner results Array
        var result = resultArray[0];
        // console.log("result, " ,result)

        var wfreq = result.wfreq
        // console.log("wash freq", wfreq)

              // Guage for wash frequency
        var traceGauge = {
          domain: { x: [0, 1], y: [0, 1] },
          value: wfreq,
          title: { text: "Belly Button Wash Frequency <br> Scrubs per Week" },
          type: "indicator",
          mode: "gauge+number",
          delta: { reference: 400 },
          gauge: { axis: { range: [null, 9]}}
        }

        var data_gauge = [traceGauge];
      
        var layout_gauge = { width: 600, height: 400}
        Plotly.newPlot('gauge',data_gauge,layout_gauge)

        // identify panel
        var panel = d3.select("#sample-metadata");

        // Make sure panel is clear before loading metadata
        panel.html("");

        // collect all the data in json (key value pairs) and put them in the panel
        Object.entries(result).forEach(([key, value]) => {
            panel.append("h6").text(`${key.toUpperCase()}: ${value}`);

        });


    });


}

function buildCharts (sample) {
    d3.json("samples.json").then((data) => {
        // console.log("main data" ,data);

        // parse data

        var samples = data.samples
        // console.log("sampleValue data" ,samples);


        // filter metadata for a sample
        var resultArray = samples.filter(sampleObject => sampleObject.id == sample);
        // console.log("resultsArray", resultArray);

        var result = resultArray[0];
        // console.log("result, " ,result)
        
        var sampleValues = result.sample_values;
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        // console.log("sampleValues, " ,sampleValues)
        // console.log("otu_ids, " ,otu_ids)
        // console.log("otu_labels, " ,otu_labels)


        // BAR CHART CODE
        // use map to iterate over each
        var yticks = otu_ids.slice(0,10).map(ids => `OTU ${ids}`).reverse()

        var traceBar = {
            x: sampleValues.slice(0,10).reverse(),
            y: yticks,
            text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: 'h'
        }

        var data_bar = [traceBar];

        var layout_bar = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {
              l: 100,
              r: 100,
              t: 100,
              b: 100
            }
          };

        Plotly.newPlot("bar", data_bar, layout_bar);


        // BUBBLE CHART CODE
        var traceBubble = {
            x: otu_ids,
            y: sampleValues,
            text: otu_labels,
            mode: 'markers',
            marker: {
              color: otu_ids,
              size: sampleValues,
              colorscale: 'Earth'
            }
          
          };

        var data_bubble = [traceBubble];

        var layout_bubble = {
            title: "Bacteria Cultures Per Sample",
            showlegend: false,
            height: 600,
            width: 1200,
            // hovermode: "closest",
            xaxis: { title: "OTU ID"}
          };
        
          Plotly.newPlot("bubble", data_bubble, layout_bubble);

    });
}

// Drop down filter


// initialize dashboard with init function
function init() {

  var pullDownMenu = d3.select('#selDataset');

  d3.json("samples.json").then((data) => {
    // console.log("main data #2" ,data.names);

    var names = data.names

    names.forEach((sample) => {
      pullDownMenu.append("option").property("value", sample).text(sample);

    })

  });

  buildMetadata(940);
  buildCharts(940);
}

function optionChanged(sample_cycle) {
  buildMetadata(sample_cycle);
  buildCharts(sample_cycle);
}

init()