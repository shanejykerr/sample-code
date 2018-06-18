//Function found in parent object which contains other functions.
//Determined how filters behaved on specific events, as well as how filters interacted with other portions of the dashboard.
window.bindFilterDropdowns = function () {
    var _self = this;
    // console.log('DETAIL bindFilterDropdowns: entered');

    var _property_filters = this.configuration.lookupData.property_filters;


    _.forEach(_property_filters, function (_filterOptions, _filterKey) {

      // these filters are numbers but are by default sorted as strings
      // sort them as numbers
      if (_filterKey == 'bedroom_count' || _filterKey == 'bathroom_count' || _filterKey == 'occupancy' ) {
        _filterOptions = _.sortBy(_filterOptions, [function (o)
          { return Number(o); }
        ]);
      }

      // empty out any previous options from previous page loads
      $('select.filter-' + _filterKey).empty();


      $('select.filter-' + _filterKey).attr('multiple', '')

      if (_filterKey == 'property_location' || _filterKey == 'property_structure' || _filterKey == 'property_amenity' ) {

        _.forEach(_filterOptions, function (_option) {
          $('select.filter-' + _filterKey).append($('<option value="' + _option.id + '">' + _option.vi_title + '</option>'))
        });

      } else {
        _.forEach(_filterOptions, function (_option) {
          $('select.filter-' + _filterKey).append($('<option value="' + _option + '">' + _option + '</option>'))
        });

      }

      $('select.filter-' + _filterKey).val(_self.internals.state.common.filters[_filterKey]);

      $('select.filter-' + _filterKey).selectpicker();

      _self.checkFilterSets();

      $('select.filter-' + _filterKey).on('changed.bs.select', function (e) {
        let counter = 0
        // console.log('DETAIL bindFilterDropdowns.changed.bs.select: filter dropdown change detected on ' + _filterKey);
        _self.internals.state.common.filters[_filterKey] = $(e.target).val() || [];
        _self.checkFilterSets();

        // check filter list content
        for (let filter in _self.internals.state.common.filters) {
          // console.log(filter)
          // console.log(_self.internals.state.common.filters[filter])
          if(_self.internals.state.common.filters[filter].length != 0) {
            // if the filter object is not empty, then increase counter by 1
            ++counter
            // console.log('REVEAL COUNTER: ' + counter)
          }
        }

        if (counter > 0) {
          // if one or more selects are filled, reveal the clear filters link
          $('.clear-filters').removeClass('hidden')
        } else {
          // if none of the selects are filled, hide the clear filters link
          $('.clear-filters').addClass('hidden')
        }

        // $(e.target).selectpicker('destroy');

        // console.log('DETAIL bindFilterDropdowns.changed.bs.select: calling triggerCountDown');
        _self.triggerStateChange('count-down');
      });

    });

    $('select.kpi-select').selectpicker();

    $('.clear-filters').on('click', function (e) {
      // on click, reset content of each filter object
      for (let filter in _self.internals.state.common.filters){
          _self.internals.state.common.filters[filter] = [];
      }
      // reset each filter select to default settings
      $('div.show-tick:not(.filter-market) button.btn.dropdown-toggle').addClass('bs-placeholder').attr('title', 'Nothing selected')
      $('div.show-tick:not(.filter-market) span.filter-option').text('Nothing selected')
      $('div.show-tick:not(.filter-market) ul.dropdown-menu li.selected').removeClass('selected')
      $('div.show-tick:not(.filter-market) select[multiple="multiple"] option:selected').prop('selected', false)

      // hide clear filters link & call triggerCountDown for processing delay
      $('.clear-filters').addClass('hidden')
      _self.triggerStateChange('count-down')
    })

    $('select.kpi-select').on('changed.bs.select', function (e) {
      // console.log('DETAIL bindFilterDropdowns.changed.bs.select: detailKpi dropdown change detected');
      _self.internals.state.detail.vi_kpi = $(e.target).val()

      // console.log('DETAIL bindFilterDropdowns.changed.bs.select: calling changeDetailKpi');
      _self.changeDetailKpi()
    });

  }