//buid plot
function buildPlot(id) {

//read in data
    d3.json("samples.json").then((data) => {
        console.log(data);

//Grab values to build plots

        let wFrequency = data.metadata.map(d => d.wFrequency)
            console.log(`Washing Frequency: ${wFrequency}`);

        let samples = data.samples.filter(x => x.id.toString() ===id)[0];
            console.log(samples);

        let labels = samples.otu_labels.slice(0, 10);
       
        let sampleValues = samples.sample_values;

        let topSampleValues = sampleValues.slice(0, 10).reverse();

        let topOTU = (samples.otu_ids.slice(0, 10)).reverse();
        let otu_ID = topOTU.map(d => "OTU " + d); 

        let otuLabels = samples.otu_ids;

        //Bar chart with top 10 values

        let trace1= {
            x: topSampleValues,
            y: otu_ID,
            text: labels,
            name: "Top 10 OTUs found",
            type: "bar", 
            orientation: "h",
            marker: {color: 'rgb(235, 171, 68)'},
        };

        let barData = [trace1];

        let layout1 = {
            title: {
                text: "Top 10 OTUs",
                font: {
                    family: 'Segoe UI Light',
                    size: 24
                },
            },
            yaxis:{
                tickmode: "linear",
            },
        };

        Plotly.newPlot("bar", barData, layout1);

//Bubble chart of all sample values

        let trace2 = {
            x:otuLabels,
            y: sampleValues,
            mode: "markers", 
            marker: {
                size: sampleValues,
                color: otuLabels
            },
            text: samples.otu_labels
        };

        let bubbleData = [trace2];

        let layout2 = {
            title: {
                text: "OTU Samples",
                font: {
                    family: 'Segoe UI Light',
                    size: 24
                },
                xref: 'paper',
                x: 0.05,
            },
            xaxis: {title: "OTU IDs"},
            yaxis: {title: "Sample Values"}
        };

        Plotly.newPlot("bubble", bubbleData, layout2);
    });
};

function getData(id) {

    d3.json("samples.json").then((data) => {

        let metaData = data.metadata;

        let results = metaData.filter(meta => meta.id.toString() === id)[0];

        let demographics = d3.select("#sample-metadata");
        demographics.html("");

        Object.entries(results).forEach((key) => {
            demographics.append("h5").text(key[0].toUpperCase()+ ": " +key[1] + "\n");

        });
    });
};

function optionChanged(id) {
    buildPlot(id);
    getData(id);
};



function init() {

    let sel = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        console.log(data);

        data.names.forEach((name) => {
            sel.append("option").text(name).property("value");
        });

        buildPlot(data.names[0]);
        getData(data.names[0]);

    })


};

init();