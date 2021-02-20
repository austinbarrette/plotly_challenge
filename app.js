function init() {
    // Select the HTML Dropdown element
    var selector = d3.select("#selDataset");
    
    // Add list of IDs to "Select Sample" HTML Dropdown menu
      d3.json("/samples.json").then((dataset) => {
        var subjectID = dataset.names;
        subjectID.forEach((ID) => {
          selector
          .append("option")
          .text(ID)
          .property("value", ID);
        });
      
      // Build plot using the first sample subject ID
      // for when the page 1st loads
      const firstID = subjectID[0];
      updateCharts(firstID);
      updateMetadata(firstID);
    });
  }

  //Update the Demographic Info inside the index.html metapanel id
  //Using the keys from the metadata to populate
  function updateMetadata(demographicinfo) {
    d3.json("/samples.json").then((dataset) => {
        var metadata = dataset.metadata;
        var filterArray = metadata.filter(thing => thing.id == demographicinfo);
        var result = filterArray[0];
        var panelbody = d3.select("#sample-metadata");
        panelbody.html("");
        //Object.entries adds each key and value pair to metapanel
        Object.entries(result).forEach(([key, value]) => {
            panelbody.append("h5").text(`${key.toUpperCase()}: ${value}`)
        })
    });
  }
  
  //Create function to update chart data
  //from the data json object, to build the plots
  function updateCharts(sample) {    
    d3.json("/samples.json").then((dataset) => {
    var samples = dataset.samples;
    var filterArray = samples.filter(thing => thing.id == sample);
    var result = filterArray[0];
    var sample_values = result.sample_values;
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;  

    // Bar Chart Trace
    var trace1 = {
        x: sample_values.slice(0,10).reverse(),
        y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        name: "OTU BAR",
        type: "bar",
        orientation: "h"
    };
    //data
    var data = [trace1];
    //layout
    var layout = {
        title: "OTU ID #" + sample,
        margin: {l: 100, r: 100, t: 100, b: 100}
    };
    // Render the plot to the div tag with id "bar"
    Plotly.newPlot("bar", data, layout);   


    // Bubble Chart Trace 
    var trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
        size: sample_values,
        color: otu_ids,
        colorscale:"Electric"
        }
    };
    //data
    var data = [trace1];
    //layout
    var layout = {
        title: 'Bacteria Cultures in Sample #' + sample,
        showlegend: false,
        hovermode: 'closest',
        xaxis: {title:"OTU ID " +sample},
        margin: {t:30}
    };
    // Render the plot to the div tag with id "bubble"
    Plotly.newPlot('bubble', data, layout); 
});
}
  
function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    updateCharts(newSample);
    updateMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();
