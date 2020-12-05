const url =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    dataset = data;
    console.log(d3);

    const w = 1000;
    const h = 500;

    const parseDate = d3.timeParse('%Y');
    const parseTime = d3.timeParse('%M:%S');

    const padding = 80;

    const minX = d3.min(dataset, function (d) {
      return parseDate(d.Year);
    });
    const maxX = d3.max(dataset, function (d) {
      return parseDate(d.Year);
    });

    const minY = d3.min(dataset, function (d) {
      return parseTime(d.Time);
    });
    const maxY = d3.max(dataset, function (d) {
      return parseTime(d.Time);
    });

    console.log(minX, maxX);
    console.log(minY, maxY);

    const xScale = d3
      .scaleTime()
      .domain([minX, maxX])
      .range([padding, w - padding]);

    const yScale = d3
      .scaleTime()
      .domain([minY, maxY])
      .range([padding, h - padding]);

    const svg = d3
      .select('.container')
      .append('svg')
      .attr('width', w)
      .attr('height', h);

    const tooltip = d3
      .select('body')
      .append('div')
      .attr('id', 'tooltip')
      .style('opacity', 0);

    const circle = svg
      .selectAll('circle')
      .data(dataset)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(parseDate(d.Year)))
      .attr('cy', (d) => yScale(parseTime(d.Time)))
      .attr('r', '5')
      .attr('fill', function (d) {
        if (d.Doping === '') return 'blue';
        return 'red';
      })
      .attr('class', 'dot')
      .attr('data-xvalue', (d) => parseDate(d.Year))
      .attr('data-yvalue', (d) => parseTime(d.Time));

    circle.on('mouseover', handleMouseOver).on('mouseout', handleMouseOut);

    const xAxis = d3.axisBottom(xScale);
    // const yAxis = d3.axisLeft(yScale);
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));

    svg
      .append('g')
      .attr('transform', 'translate(0,' + (h - padding) + ')')
      .attr('id', 'x-axis')
      .call(xAxis);

    svg
      .append('g')
      .attr('transform', 'translate(' + padding + ' , 0)')
      .attr('id', 'y-axis')
      .call(yAxis);

    // Create Event Handlers for mouse
    function handleMouseOver(e, d) {
      tooltip.transition().duration(200).style('opacity', 0.9);
      tooltip
        .html(d.Name + '<br/>' + d.Doping)
        .style('left', e.x + 'px')
        .style('top', e.y + 'px');

      tooltip.attr('data-year', parseDate(d.Year));
    }

    function handleMouseOut(e, d) {
      tooltip.transition().duration(500).style('opacity', 0);
    }
  });
