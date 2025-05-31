// Компонент для отображения строки таблицы
// В зависимости от параметра isHead создаёт ячейки th (заголовок) или td (данные)

const TableRow = (props) => {
  // Генерирует ячейки строки
  const cells =
    props.isHead === '1'
      ? props.row.map((item, index) => <th key={index}>{item}</th>) // Заголовки (th)
      : props.row.map((item, index) => <td key={index}>{item}</td>); // Данные (td)

  return <>{cells}</>;
};

export default TableRow;