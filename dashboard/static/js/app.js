var json = 'samples.json';

d3.json(json).then(function (data) {
    var names = data.names;
    var id = d3.select('#selDataset');
    var select;
    for (var i = 0; i < names.length; i++) {
        select = id.append('option').text(names[i]);
    };
});

d3.select('#selDataset').on('change', dropdownChoice);

function unpack(rows, index) {
    return rows.map(function (row) {
        return row[index];
    });
};

function dropdownChoice() {
    d3.event.preventDefault();
    var id = d3.select('#selDataset').node().value;
    console.log(id);
    buildPlot(id);
    buildBubble(id);
    demoInfo(id);
    buildGauge(id);
};

function buildPlot(id) {
    d3.json(json).then(function (data) {

        var id_data = data.samples.filter(x => x['id'] === id);

        var id_data_sorted = id_data.sort((a, b) => b.sample_values - a.sample_values);

        // console.log(id_data);


        // var sample_values = id_data[0].sample_values;
        var sample_values_10 = id_data_sorted[0].sample_values.slice(0, 10);
        // var otu_ids = id_data[0].otu_ids;
        var otu_ids_10 = id_data_sorted[0].otu_ids.slice(0, 10);
        // var otu_labels = id_data[0].otu_labels;
        var otu_labels_10 = id_data_sorted[0].otu_labels.slice(0, 10);

        otu_ids_10 = otu_ids_10.map(String);
        for (var i = 0; i < otu_ids_10.length; i++) {
            otu_ids_10[i] = 'OTU ' + otu_ids_10[i];
        }

        // sample_values = sample_values.sort((a, b) => b - a).slice(0, 10);

        // console.log(sample_values_10);
        // console.log(otu_ids_10);
        // console.log(otu_labels_10);

        var trace = {
            type: 'bar',
            x: sample_values_10,
            y: otu_ids_10,
            text: otu_labels_10,
            orientation: 'h',
            transforms: [{
                type: 'sort',
                target: 'y',
                order: 'descending'
            }]
        };

        var data = [trace];

        var layout = {
            title: 'Most Populous Microbial Species',
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
        };

        Plotly.newPlot('bar', data, layout)

        // var trace2 = {
        //     x: otu_ids,
        //     y: sample_values,
        //     text: otu_labels,
        //     mode: 'markers',
        //     marker: {
        //         size: sample_values,
        //         color: otu_ids,
        //     }
        // };

        // var data2 = [trace2];

        // Plotly.newPlot('bubble', data2, layout);

    });
};

function buildBubble(id) {
    d3.json(json).then(function (data) {
        var id_data = data.samples.filter(x => x['id'] === id);
        var sample_values = id_data[0].sample_values;
        var otu_ids = id_data[0].otu_ids;
        var otu_labels = id_data[0].otu_labels;

        var trace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'Portland'
            }
        };

        var data = [trace];

        var layout = {
            title: 'test',
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
        };

        Plotly.newPlot('bubble', data, layout);

    })
};

function buildGauge(id) {
    d3.json(json).then(function (data) {
        for (var i = 0; i < data.metadata.length; i++) {
            if (data.metadata[i].id === parseInt(id)) {
                var user_id = data.metadata[i].id;
                var wfreq = data.metadata[i].wfreq;
            }
        }


        var data = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: wfreq,
                title: { text: '<b>Belly Button Washing Frequency</b> <br> Scrubs Per Week' },
                type: 'indicator',
                mode: 'gauge+number',
                gauge: {
                    axis: { range: [null, 9] },
                    bar: { color: '#00308f' },
                    steps: [
                        { range: [0, 3], color: '#eeeeee' },
                        { range: [3, 6], color: '#cccccc' },
                        { range: [6, 9], color: '#999999' },
                    ]
                }

            }
        ]
        var layout = {
            width: 600,
            height: 500,
            margin: { t: 0, b: 0 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
        };
        Plotly.newPlot('gauge', data, layout)
    })
};

function demoInfo(id) {
    d3.json(json).then(function (data) {
        // console.log(data.metadata[0].id);
        for (var i = 0; i < data.metadata.length; i++) {
            if (data.metadata[i].id === parseInt(id)) {
                var user_id = data.metadata[i].id;
                var ethnicity = data.metadata[i].ethnicity;
                var gender = data.metadata[i].gender;
                var age = data.metadata[i].age;
                var location = data.metadata[i].location;
                var bbtype = data.metadata[i].bbtype;
                var wfreq = data.metadata[i].wfreq;
            }
        }

        // console.log(user_id, ethnicity, gender, age, location, bbtype, wfreq);
        var card = d3.select('.card-body');
        card.html('');
        card.append('p').text(`ID: ${user_id}`).classed('card-text', true);
        card.append('p').text(`Ethnicity: ${ethnicity}`).classed('card-text', true);
        card.append('p').text(`Gender: ${gender}`).classed('card-text', true);
        card.append('p').text(`Age: ${age}`).classed('card-text', true);
        card.append('p').text(`Location: ${location}`).classed('card-text', true);
        card.append('p').text(`BBtype: ${bbtype}`).classed('card-text', true);
        card.append('p').text(`Wfreq: ${wfreq}`).classed('card-text', true);
    })
};

buildPlot('940');




