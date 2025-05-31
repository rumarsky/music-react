import * as d3 from "d3";
import { useEffect, useMemo, useRef, useState } from "react";

const ChartDraw = (props) => {
	const chartRef = useRef(null);
	
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);

	// заносим в состояния ширину и высоту svg-элемента
	useEffect(() => {
        const svg = d3.select(chartRef.current);      
        setWidth(parseFloat(svg.style('width')));
		setHeight(parseFloat(svg.style('height')));
    }); 
	// задаем отступы в svg-элементе
	const  margin = {
		top:10, 
		bottom:60, 
		left:40, 
		right:10
	};
		
	// вычисляем ширину и высоту области для вывода графиков
    const boundsWidth = width -  margin.left - margin.right;
    const boundsHeight = height - margin.top - margin.bottom;

	useEffect(() => {
        const svg = d3.select(chartRef.current);
        // выводим прямоугольник, 		
		svg
		.append("rect")
		.attr("x", margin.left)
		.attr("y", margin.top)
		.attr("width",  boundsWidth)
		.attr("height",  boundsWidth)
		.style("fill", "lightgrey");
	});

    // const indexOY = 1; // диаграмма для максимальных значений
    const allValues = props.data.flatMap(d => [d.values[0], d.values[1]]);
	let [min, max] = d3.extent(allValues);
		
	// формируем шкалы для осей
    const scaleX = useMemo(() => {
        return d3
            .scaleBand()
            .domain(props.data.map(d => d.labelX))
            .range([0,boundsWidth])
    }, [props.data, boundsWidth]);
  
    const scaleY = useMemo(() => {
        return d3
            .scaleLinear()
            .domain([min * 0.85, max * 1.1 ])
            .range([boundsHeight, 0])
    }, [boundsHeight, min, max]);

    	
	useEffect(() => {
        if (!props.showMax && !props.showMin) return;

        const svg = d3.select(chartRef.current);
        svg.selectAll("*").remove();
        
        // рисуем оси
        const xAxis = d3.axisBottom(scaleX);     
        svg .append("g")
            .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
            .call(xAxis)
            .selectAll("text") 
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", d => "rotate(-30)");

        const yAxis = d3.axisLeft(scaleY);
        svg .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .call(yAxis);
        
         // Настройки ширины столбцов
        const barWidth = scaleX.bandwidth() * 0.3; // Узкие столбцы (30% от доступной ширины)
        const barOffset = (scaleX.bandwidth() - barWidth) / 2; // Центрирование

        //рисуем график
        if (props.chartType === "scatter") {
            // Точечная диаграмма
            if (props.showMax) {
                svg.selectAll(".max-dot")
                    .data(props.data)
                    .enter()
                    .append("circle")
                    .attr("r", 5)
                    .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
                    .attr("cy", d => scaleY(d.values[1]))
                    .attr("transform", `translate(${margin.left}, ${margin.top})`)
                    .style("fill", "red")
                    .attr("opacity", 0.7);
            }
            
            if (props.showMin) {
                svg.selectAll(".min-dot")
                    .data(props.data)
                    .enter()
                    .append("circle")
                    .attr("r", 5)
                    .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
                    .attr("cy", d => scaleY(d.values[0]))
                    .attr("transform", `translate(${margin.left}, ${margin.top})`)
                    .style("fill", "blue")
                    .attr("opacity", 0.7);
            }
        } else {
            // Гистограмма
            const barWidth = 10; // Фиксированная ширина столбцов
            
            if (props.showMax) {
                svg.selectAll(".max-bar")
                    .data(props.data)
                    .enter()
                    .append("rect")
                    .attr("x", d => scaleX(d.labelX) + scaleX.bandwidth() / 2 - barWidth/2 + 5)
                    .attr("y", d => scaleY(d.values[1]))
                    .attr("width", barWidth)
                    .attr("height", d => boundsHeight - scaleY(d.values[1]))
                    .attr("transform", `translate(${margin.left}, ${margin.top})`)
                    .style("fill", "red")
                    .attr("opacity", 0.7);
            }
            
            if (props.showMin) {
                svg.selectAll(".min-bar")
                    .data(props.data)
                    .enter()
                    .append("rect")
                    .attr("x", d => scaleX(d.labelX) + scaleX.bandwidth() / 2 - barWidth/2 - 5)
                    .attr("y", d => scaleY(d.values[0]))
                    .attr("width", barWidth)
                    .attr("height", d => boundsHeight - scaleY(d.values[0]))
                    .attr("transform", `translate(${margin.left}, ${margin.top})`)
                    .style("fill", "blue")
                    .attr("opacity", 0.7);
            }
        }

    }, [scaleX, scaleY, props.data, props.showMax, props.showMin, props.chartType]);

    return (
      <svg ref={chartRef} >  </svg>
	)
}

export default ChartDraw;