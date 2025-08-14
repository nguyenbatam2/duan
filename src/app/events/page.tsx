// 'use client'
// import { useEffect, useState } from "react";
// import Link from "next/link";

// export default function EventsPage() {
//     const [events, setEvents] = useState([]);

//     useEffect(() => {
//         fetch("http://127.0.0.1:8000/api/user/events")
//             .then(res => res.json())
//             .then(data => setEvents(data.data));
//     }, []);

//     return (
//         <div className="container mx-auto p-6">
//             <h1 className="text-3xl font-bold mb-6">Sự kiện khuyến mãi</h1>
//             <div className="grid grid-cols-3 gap-6">
//                 {events.map((event: any) => (
//                     <Link key={event.id} href={`/events/${event.id}`}>
//                         <div className="bg-white shadow rounded-lg p-4 hover:shadow-lg cursor-pointer">
//                             <img src={event.banner_image} alt={event.name} className="w-full h-40 object-cover rounded" />
//                             <h2 className="text-lg font-semibold mt-3">{event.name}</h2>
//                             <p className="text-gray-500">{event.description}</p>
//                         </div>
//                     </Link>
//                 ))}
//             </div>
//         </div>
//     );
// }


export const mockEventProducts = [
    {
        id: 1,
        event_price: 800000,
        original_price: 1000000,
        discount_price: 800000,
        quantity_limit: 10,
        status: "active",
        product: {
            id: 101,
            name: "Tổ yến thô nguyên chất 100g",
            image: "https://picsum.photos/300/200?random=1",
            description: "Tổ yến nguyên chất chưa qua sơ chế, giữ nguyên dưỡng chất."
        }
    },
    {
        id: 2,
        event_price: 1200000,
        original_price: 1500000,
        discount_price: 1200000,
        quantity_limit: 5,
        status: "active",
        product: {
            id: 102,
            name: "Tổ yến tinh chế 100g",
            image: "https://picsum.photos/300/200?random=2",
            description: "Tổ yến đã được làm sạch lông và tạp chất, tiện lợi chế biến."
        }
    },
    {
        id: 3,
        event_price: 1500000,
        original_price: 1800000,
        discount_price: 1500000,
        quantity_limit: 8,
        status: "active",
        product: {
            id: 103,
            name: "Tổ yến cao cấp 100g",
            image: "https://picsum.photos/300/200?random=3",
            description: "Tổ yến loại 1, hàm lượng dinh dưỡng cao."
        }
    },
    {
        id: 4,
        event_price: 500000,
        original_price: 700000,
        discount_price: 500000,
        quantity_limit: 15,
        status: "active",
        product: {
            id: 104,
            name: "Tổ yến chưng sẵn 70ml x 6 lọ",
            image: "https://picsum.photos/300/200?random=4",
            description: "Tổ yến đã chưng sẵn, tiện lợi sử dụng ngay."
        }
    }
];



export default function TestPage() {
    return (
        <div className="grid grid-cols-4 gap-4 p-6">
            {mockEventProducts.map(item => (
                <div key={item.id} className="border rounded-lg p-3">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-40 object-cover rounded" />
                    <h3 className="font-semibold mt-2">{item.product.name}</h3>
                    <p className="text-red-500 font-bold">{item.discount_price.toLocaleString()}₫</p>
                    <p className="text-gray-400 line-through">{item.original_price.toLocaleString()}₫</p>
                    <p className="text-sm text-gray-500">{item.product.description}</p>
                </div>
            ))}
        </div>
    );
}
