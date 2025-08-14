"use client";

import { useEffect, useState } from "react";
import { fetchEvents } from "../lib/event";
import { Event, PaginatedEvents } from "../types/event";
import "../style/login.css";


export default function EventPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginatedEvents | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getEvents = async () => {
      setLoading(true);
      try {
        const data = await fetchEvents(page);
        setEvents(data.data);
        setPagination(data);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };
    getEvents();
  }, [page]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý sự kiện</h1>

      {loading && <p>Đang tải dữ liệu...</p>}

      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 border">ID</th>
            <th className="py-2 border">Tên</th>
            <th className="py-2 border">Trạng thái</th>
            <th className="py-2 border">Nổi bật</th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map(event => (
              <tr key={event.id}>
                <td className="py-2 border text-center">{event.id}</td>
                <td className="py-2 border">{event.name}</td>
                <td className="py-2 border text-center">{event.status}</td>
                <td className="py-2 border text-center">
                  {event.is_featured ? "✅" : "❌"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="py-4 text-center">Không có dữ liệu</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-center mt-4 space-x-4">
        <button
          disabled={!pagination?.links.prev}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Trang {pagination?.meta.current_page} / {pagination?.meta.last_page}
        </span>
        <button
          disabled={!pagination?.links.next}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
