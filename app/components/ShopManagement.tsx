"use client";
import { useState } from "react";

type Shop ={
    id:number;
    tenant:string;
    rent:number;
}

export default function ShopManagement() {
    const [shops, setShops] = useState<Shop[]>(
        Array.from({length:20},(_,i)=>({
            id:i+1,
            tenant:"",
            rent:0,
        }))
    );

    const handleChange =(
        index:number,
        field:"tenant"|"rent",
        value:string
    )=>{
        const updated = [...shops];
        if(field === "tenant"){
            updated[index].tenant = value;
        }else{
            updated[index].rent = Number(value);
        }
        setShops(updated);
    }
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Shop Management</h1>
            <div className="grid gap-4">
                {shops.map((shop,index)=>(
                    <div key={shop.id}
                    className="border p-4 rounded-lg flex gap-4 items-center">
                        <div className="w-20 font-semibold">Shop{shop.id}
            </div>
            <input 
            type="text"            placeholder="Tenant Name"
            value={shop.tenant}
            onChange={(e)=>handleChange(index,"tenant",e.target.value)}
            className="border p-2 rounded w-1/3"
            />
            <input
            type="number"
            placeholder="Rent Amount"
            value={shop.rent}
            onChange={(e)=>handleChange(index,"rent",e.target.value)}
            className="border p-2 rounded w-1/3"
            />
        </div>
                ))}
            </div>
        </div>
    );

}

