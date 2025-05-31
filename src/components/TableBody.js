// Компонент для отображения тела таблицы (tbody)
// Использует TableRow для создания строк с данными

import TableRow from './TableRow.js';

const TableBody = (props) => {
  // Рассчитывает диапазон строк для текущей страницы пагинации
  const begRange = (props.numPage - 1) * props.amountRows; 
  const endRange = begRange + Number(props.amountRows);

  // Генерирует строки таблицы, скрывая те, которые не попадают в текущую страницу
  const tbody = props.body.map((item, index) => (
    <tr
      key={index}
      className={index >= begRange && index < endRange ? 'show' : 'hide'}
    >
      <TableRow row={Object.values(item)} isHead="0" />
    </tr>
  ));

  return <tbody>{tbody}</tbody>;
};

export default TableBody;