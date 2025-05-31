import './CSS/App.css';
import tracks from './data.js';
import Table from './components/Table.js';
import Chart from './components/Chart.js';
import { useState } from 'react';

function App() {
  const [filteredData, setFilteredData] = useState(tracks);

  return (
    <div className='App'>
      <h1>Музыкальные треки</h1>
      <Chart data={filteredData} />
      <Table data={tracks} amountRows="10" onFilter={setFilteredData} />
    </div>
  );
}

export default App;