  //Part of parent object containing functions for dashboard page
  //Utilized Flot Charts (https://www.flotcharts.org/) instead of D3.js due to time constraints. D3 test script is still included at the bottom.
  //Parts of code utilized Lodash (https://lodash.com/), a library that was frequently used in this application
  
  window.plotChart = function (_chartId, _kpiName) {
    var _self = this;
    // console.log('DETAIL plotChart: entered for kpi: ' + _kpiNam);
    var fn = _self.formatNumber;

    let _displayMarkets = _self.internals.state.common.markets;
    let _data = [];
    let _colors = [];

    let _trendline = _self.internals.results.trendline;

    let _hiddenXaxis = [];

    // _.forEach(_trendline["91day"], function (_day) {
    //   _hiddenXaxis.push([
    //     _day.increment,
    //     0
    //   ])
    // });

    for (var i =1; i < 92; i++) {
      _hiddenXaxis.push([
        i,
        0
      ])
    }

    _data.push({
      data: _hiddenXaxis,
      xaxis: 1,
      lines: { show: false },
      points: { show: false }
    })

    _.forEach(_displayMarkets, function (_marketId) {

      _data.push({
        "data": _trendline[_marketId][_kpiName],
        "xaxis": 2
      });

      _colors.push(_self.configuration.lookupData.market[_marketId].ui_color);
    });

    var labelPercent = function (val, axis){
       return val + " %";
    };

    var labelCurrency = function (val, axis){
       return "$" + fn(val);
    };

    var labelNumber = function (val, axis){
       return fn(val);
    };

    let _yFormatter = labelCurrency;

    if (_kpiName == "occ" || _kpiName == "canc") _yFormatter = labelPercent;

    if (_kpiName == "tnb"
      || _kpiName == "tuna"
      || _kpiName == "tcr"
      || _kpiName == "tres"
      || _kpiName == "als"
      || _kpiName == "aabl"
    )
      _yFormatter = labelNumber;

    let _min = _trendline["yAxisMinMax"][_kpiName].min - (_trendline["yAxisMinMax"][_kpiName].min) * .05;
    let _max = _trendline["yAxisMinMax"][_kpiName].max + (_trendline["yAxisMinMax"][_kpiName].max) * .05;

    $.plot("#" + _chartId,
    _data,
      {
        series: {
          lines: {
              show: true,
              fill: false,
              lineWidth: 3
          },
          points: {
              radius: 2,
              show: false
          }
        },
        grid: {
          hoverable: true,
          clickable: true,
          backgroundColor: '#fff',
          borderWidth: 1,
          color: '#dcdcdc',
          margin: {
              top: 10,
              left: 10,
              bottom: 10,
              right: 10
          }
        },
        colors: _colors,
        xaxes: [
          {
            ticks: _trendline["91day"]
          },
          {
            show: false
          },
        ],
        yaxes: [{
          min: _min,
          max: _max,
          tickFormatter: _yFormatter
        }],
        tooltip: true
    });


    $("#" + _chartId).on("plothover plotclick", function (event, pos, item) {
        if (item) {
            // if ((previousLabel != item.series.label) || (previousPoint != item.dataIndex)) {
            //     previousPoint = item.dataIndex;
            //     previousLabel = item.series.label;
            //
            // }

            $("#tooltip").remove();

            var x = item.datapoint[0];
            var y = item.datapoint[1];

            // console.log(item)

            var color = item.series.color;

            //console.log(item.series.xaxis.ticks[x].label);

            _self.chartTooltip(
                item.pageX,
                item.pageY,
                color,
                    "<strong>" + y + " and " + x + "</strong>"
              );
        } else {
            $("#tooltip").remove();
            //previousPoint = null;
        }
  		// if (item) {
  		// 	var x = item.datapoint[0].toFixed(2),
  		// 		y = item.datapoint[1].toFixed(2);
      //
  		// 	$("#tooltip").html(item.series.label + " of " + x + " = " + y)
  		// 		.css({top: item.pageY+5, left: item.pageX+5})
  		// 		.fadeIn(200);
  		// } else {
  		// 	$("#tooltip").hide();
  		// }
    });


  }