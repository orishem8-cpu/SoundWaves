"use client";

import { useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { seedPublications } from "@/data/mock";

export default function Publications() {
  const [filter, setFilter] = useState("Все");
  const [q, setQ] = useState("");

  const filters = ["Все", "В очереди", "В работе", "Выполнено"];

  const rows = seedPublications.filter((publication) => {
    const matchesFilter =
      filter === "Все" || publication.status === filter;

    const matchesSearch = `${publication.title} ${publication.platform}`
      .toLowerCase()
      .includes(q.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="dash-content">
      <h1 style={{ fontSize: 30, margin: "0 0 8px" }}>
        Мои публикации
      </h1>

      <p className="muted">
        Отслеживай выходы своего контента на площадках.
      </p>

      <div className="card" style={{ marginTop: 24 }}>
        {/* Фильтры и поиск */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {filters.map((item) => (
              <button
                key={item}
                className={`btn ${
                  filter === item ? "btn-primary" : ""
                }`}
                style={{
                  padding: "8px 13px",
                  fontSize: 12,
                }}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Поиск */}
          <div
            style={{
              position: "relative",
              width: 220,
            }}
          >
            <Search
              size={15}
              className="muted"
              style={{
                position: "absolute",
                left: 12,
                top: 12,
              }}
            />

            <input
              className="field"
              style={{
                padding: "9px 10px 9px 34px",
              }}
              placeholder="Поиск..."
              value={q}
              onChange={(event) => setQ(event.target.value)}
            />
          </div>
        </div>

        {/* Таблица публикаций */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Релиз</th>
                <th>Площадка</th>
                <th>Дата</th>
                <th>Статус</th>
                <th>Ссылка</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((publication) => (
                <tr key={publication.id}>
                  <td style={{ fontWeight: 700 }}>
                    {publication.title}
                  </td>

                  <td>{publication.platform}</td>

                  <td>{publication.date}</td>

                  <td>
                    <span
                      className={`status ${
                        publication.status === "Выполнено"
                          ? "done"
                          : publication.status === "В работе"
                          ? "progress"
                          : "pending"
                      }`}
                    >
                      {publication.status}
                    </span>
                  </td>

                  <td>
                    <a
                      href={publication.url}
                      target="_blank"
                      rel="noreferrer"
                      className="muted"
                      aria-label={`Открыть публикацию ${publication.title}`}
                    >
                      <ExternalLink size={15} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Пустой результат поиска */}
          {rows.length === 0 && (
            <p
              className="muted"
              style={{
                textAlign: "center",
                padding: 25,
              }}
            >
              Публикаций по заданным условиям не найдено.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}