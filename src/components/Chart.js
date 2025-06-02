import * as d3 from "d3";
import { useState } from "react";
import ChartDraw from './ChartDraw.js';

const Chart = (props) => {
    const [ox, setOx] = useState("Исполнитель");
    const [oy, setOy] = useState([true, false]);
    const [chartType, setChartType] = useState("scatter");
    const [error, setError] = useState("");
    const [highlightError, setHighlightError] = useState(false);
    
    const handleSubmit = (event) => {        
        event.preventDefault();
        setOx(event.target["ox"].value); 
        setOy([event.target["oy"][0].checked, event.target["oy"][1].checked]);
        setChartType(event.target["chartType"].value);
        
        // Проверка что выбрана хотя бы одна ось OY
        if (!event.target["oy"][0].checked && !event.target["oy"][1].checked) {
            setError(" ");
            setHighlightError(true);
        } else {
            setError("");
            setHighlightError(false);
        }
    }

    const createArrGraph = (data, key) => {   
        const groupObj = d3.group(data, d => d[key]);
        let arrGraph = [];
        for (let entry of groupObj) {
            let minMax = d3.extent(entry[1].map(d => d['Прослушивания']));
            arrGraph.push({labelX: entry[0], values: minMax});
        }
        
        // Сортировка по годам если выбран OX = "Год"
        if (key === "Год выпуска") {
            arrGraph.sort((a, b) => a.labelX - b.labelX);
        }
        return arrGraph;
    }

    return (
        <>
            <h4>Визуализация</h4>
            <form onSubmit={handleSubmit}>
                <p> Значение по оси OX: </p>
                <div>
                    <input type="radio" name="ox" value="Исполнитель" defaultChecked={ox === "Исполнитель"} />
                    Страна
                    <br/>		
                    <input type="radio" name="ox" value="Год выпуска" />
                    Год
                </div>

                <p> Значение по оси OY </p>
                <div style={highlightError ? {color: "red", padding: "5px"} : {}}>
                    <input type="checkbox" name="oy" defaultChecked={oy[0]} onChange={() => setHighlightError(false)} />
                    Максимальные прослушивания <br/>
                    <input type="checkbox" name="oy" defaultChecked={oy[1]} onChange={() => setHighlightError(false)} />
                    Минимальные прослушивания
                </div>

                <p>Тип диаграммы:</p>
                <select name="chartType" defaultValue={chartType}>
                    <option value="scatter">Точечная диаграмма</option>
                    <option value="bar">Гистограмма</option>
                </select>

                <p>  
                    <button type="submit">Построить</button>
                </p>
                {error && <div style={{color: "red"}}>{error}</div>}
            </form>
            
            {!error && (
                <ChartDraw 
                    data={createArrGraph(props.data, ox)} 
                    showMax={oy[0]} 
                    showMin={oy[1]} 
                    chartType={chartType}
                />
            )}
        </>
    )
}

export default Chart;