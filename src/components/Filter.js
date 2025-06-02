// Компонент для фильтрации данных таблицы
// Предоставляет форму с полями для фильтрации по всем столбцам
import { useState, useRef, useEffect } from 'react';

const Filter = (props) => {
  useEffect(() => {
        if (props.resetRef.current) {
            props.resetRef.current = false;
        }
    }, [props.resetRef.current]);

  // Обработчик отправки формы фильтрации
  const handleSubmit = (event) => {
    event.preventDefault();

    // Собирает значения полей формы в объект filterField
    const filterField = {
      'Название трека': event.target.track.value.toLowerCase(),
      'Исполнитель': event.target.artist.value.toLowerCase(),
      'Альбом': event.target.album.value.toLowerCase(),
      'Жанр': event.target.genre.value.toLowerCase(),
      'Год выпуска': [
        Number(event.target.yearFrom.value) || null, // Минимальный год (или null)
        Number(event.target.yearTo.value) || null, // Максимальный год (или null)
      ],
      'Прослушивания': [
        Number(event.target.playsFrom.value) || null, // Минимальная высота (или null)
        Number(event.target.playsTo.value) || null, // Максимальная высота (или null)
      ],
    };

    // Фильтрует данные по каждому полю формы
    let arr = props.fullData;
    for (const key in filterField) {
      const value = filterField[key];

      // Условия для числовых диапазонов
      if (key === 'Год выпуска' || key === 'Прослушивания') {
        const [min, max] = value;
        arr = arr.filter((item) => {
          const itemValue = item[key];
          return (
            (min === null || itemValue >= min) &&
            (max === null || itemValue <= max)
          );
        });
      } else if (value) {
        // Фильтрация по строковым полям
        arr = arr.filter((item) =>
          item[key].toLowerCase().includes(value)
        );
      }
    }

    // Передаёт отфильтрованные данные в родительский компонент
    props.filtering(arr);
  };

  // Сбрасывает фильтры, восстанавливая исходные данные
  const handleClear = () => {
    props.onFullReset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>
        <label>Название трека:</label>
        <input name="track" type="text" />
      </p>
      <p>
        <label>Исполнитель:</label>
        <input name="artist" type="text" />
      </p>
      <p>
        <label>Альбом:</label>
        <input name="album" type="text" />
      </p>
      <p>
        <label>Жанр:</label>
        <input name="genre" type="text" />
      </p>
      <p>
        <label>Год выпуска от:</label>
        <input name="yearFrom" type="number" />
      </p>
      <p>
        <label>Год выпуска до:</label>
        <input name="yearTo" type="number" />
      </p>
      <p>
        <label>Прослушивания от:</label>
        <input name="playsFrom" type="number" />
      </p>
      <p>
        <label>Прослушивания до:</label>
        <input name="playsTo" type="number" />
      </p>
      <p>
        <button type="submit">Фильтровать</button>
        <button type="reset" onClick={handleClear}>
          Очистить фильтры
        </button>
      </p>
    </form>
  );
};

export default Filter;