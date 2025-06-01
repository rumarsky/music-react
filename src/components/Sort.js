import { useState } from 'react';

const Sort = (props) => {

    const fieldMap = {
        "track": "Название трека",
        "artist": "Исполнитель",
        "album": "Альбом",
        "genre": "Жанр",
        "year": "Год выпуска",
        "plays": "Прослушивания"
    };

    // Состояние для хранения выбранных полей сортировки
    const [selectedFields, setSelectedFields] = useState({
        level1: "0", // Первый уровень сортировки
        level2: "0", // Второй уровень сортировки
        level3: "0"  // Третий уровень сортировки
    });

    const handleFieldChange = (level, value) => {
        const newSelectedFields = {...selectedFields, [level]: value};
        
        // Сброс зависимых уровней при изменении:
        if (level === "level1" && value === "0") {
            // Если сброшен первый уровень, сбрасываем все остальные
            newSelectedFields.level2 = "0";
            newSelectedFields.level3 = "0";
        } else if (level === "level2" && value === "0") {
            // Если сброшен второй уровень, сбрасываем третий
            newSelectedFields.level3 = "0";
        }
        
        setSelectedFields(newSelectedFields);
    };

    const getAvailableOptions = (currentLevel) => {
        const usedFields = [];
        
        // Собираем все уже выбранные поля (кроме текущего уровня)
        if (currentLevel !== "level1" && selectedFields.level1 !== "0") usedFields.push(selectedFields.level1);
        if (currentLevel !== "level2" && selectedFields.level2 !== "0") usedFields.push(selectedFields.level2);
        if (currentLevel !== "level3" && selectedFields.level3 !== "0") usedFields.push(selectedFields.level3);
        
        // Фильтруем поля, исключая уже выбранные
        return Object.entries(fieldMap).filter(([value]) => !usedFields.includes(value))
            .map(([value, label]) => ({value, label}));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        
        // Формируем параметры сортировки для каждого уровня
        const sortParametr = {
            level1: {
                field: selectedFields.level1,
                desc: event.target.level1_desc.checked // Сортировка по убыванию?
            },
            level2: {
                field: selectedFields.level2,
                desc: event.target.level2_desc.checked
            },
            level3: {
                field: selectedFields.level3,
                desc: event.target.level3_desc.checked
            }
        };

        // Преобразуем параметры сортировки в удобный формат
        const sorts = Object.values(sortParametr)
            .filter(l => l.field !== "0") // Убираем невыбранные уровни
            .map(l => ({
                field: fieldMap[l.field], // Получаем отображаемое имя поля
                desc: l.desc // Направление сортировки
            }));

        // Копируем данные для сортировки
        let arr = [...props.fullData];
        
        // Применяем сортировку, начиная с третьего уровня (чтобы приоритет был у первого)
        sorts.reverse().forEach(s => {
            arr.sort((a,b) => {
                const value_a = a[s.field];
                const value_b = b[s.field];

                // Сравнение строк
                if (typeof value_a === 'string') {
                    return s.desc ? 
                        value_b.localeCompare(value_a) : // По убыванию
                        value_a.localeCompare(value_b); // По возрастанию
                }
                // Сравнение чисел
                return s.desc ? 
                    value_b - value_a : // По убыванию
                    value_a - value_b;  // По возрастанию
            });
        });
        
        // Передаем отсортированные данные в родительский компонент
        props.sortering(arr);
    }

    const handleClear = (event) => {
        event.preventDefault();
        props.onFullReset(); // Вызываем функцию сброса из родительского компонента
    }

    // Получаем доступные опции для каждого уровня сортировки
    const level1Options = getAvailableOptions("level1");
    const level2Options = selectedFields.level1 !== "0" ? getAvailableOptions("level2") : [];
    const level3Options = selectedFields.level2 !== "0" ? getAvailableOptions("level3") : [];

    return (
            <form onSubmit={handleSubmit}>
                <p>
                    <label>Первый уровень:
                        <select 
                            name="level1" 
                            value={selectedFields.level1}
                            onChange={(e) => handleFieldChange("level1", e.target.value)}
                        >
                            <option value="0">Нет</option>
                            {level1Options.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <input type="checkbox" name="level1_desc" disabled={selectedFields.level1 === "0"}/> По убыванию
                    </label>
                </p>
                <p>
                    <label>Второй уровень:
                        <select 
                            name="level2" 
                            value={selectedFields.level2}
                            onChange={(e) => handleFieldChange("level2", e.target.value)}
                            disabled={selectedFields.level1 === "0"}
                        >
                            <option value="0">Нет</option>
                            {level2Options.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <input 
                            type="checkbox" 
                            name="level2_desc" 
                            disabled={selectedFields.level2 === "0"}
                        /> По убыванию
                    </label>
                </p>
                <p>
                    <label>Третий уровень:
                        <select 
                            name="level3" 
                            value={selectedFields.level3}
                            onChange={(e) => handleFieldChange("level3", e.target.value)}
                            disabled={selectedFields.level2 === "0"}
                        >
                            <option value="0">Нет</option>
                            {level3Options.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <input 
                            type="checkbox" 
                            name="level3_desc" 
                            disabled={selectedFields.level3 === "0"}
                        /> По убыванию
                    </label>
                </p>
                <button type="submit">Применить сортировку</button>
                <button type="reset" onClick={handleClear}>Очистить</button>
            </form>   
    )
}

export default Sort;