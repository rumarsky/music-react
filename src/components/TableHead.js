// Компонент для отображения заголовка таблицы (thead)
// Использует TableRow для создания строки с заголовками столбцов

import TableRow from './TableRow.js';

const TableHead = (props) => {
  return (
    <thead>
      <tr>
        <TableRow row={props.head} isHead="1" />
      </tr>
    </thead>
  );
};

export default TableHead;