"use client";
import { useState } from "react";

type ShopForm = {
  shopNumber: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  rent: string;
  lightBill: string;
  status: string;
};

export default function ShopManagement() {
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState<ShopForm>({
    shopNumber: "",
    name: "",
    email: "",
    mobile: "",
    address: "",
    rent: "",
    lightBill: "",
    status: "Pending",
  });

  const handleChange = (field: keyof ShopForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Created Shop:", formData);
    setShowModal(false);
  };

  const total =
    Number(formData.rent || 0) + Number(formData.lightBill || 0);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Shop Management</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create Shop
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
              Create Shop / Lead
            </h2>

            <div className="grid gap-3">
              <input
                placeholder="Shop Number"
                value={formData.shopNumber}
                onChange={(e) =>
                  handleChange("shopNumber", e.target.value)
                }
                className="border p-2 rounded"
              />

              <input
                placeholder="Renter / Lead Name"
                value={formData.name}
                onChange={(e) =>
                  handleChange("name", e.target.value)
                }
                className="border p-2 rounded"
              />

              <input
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  handleChange("email", e.target.value)
                }
                className="border p-2 rounded"
              />

              <input
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={(e) =>
                  handleChange("mobile", e.target.value)
                }
                className="border p-2 rounded"
              />

              <input
                placeholder="Address"
                value={formData.address}
                onChange={(e) =>
                  handleChange("address", e.target.value)
                }
                className="border p-2 rounded"
              />

              <input
                type="number"
                placeholder="Rent Amount"
                value={formData.rent}
                onChange={(e) =>
                  handleChange("rent", e.target.value)
                }
                className="border p-2 rounded"
              />

              <input
                type="number"
                placeholder="Light Bill"
                value={formData.lightBill}
                onChange={(e) =>
                  handleChange("lightBill", e.target.value)
                }
                className="border p-2 rounded"
              />

              <select
                value={formData.status}
                onChange={(e) =>
                  handleChange("status", e.target.value)
                }
                className="border p-2 rounded"
              >
                <option>Pending</option>
                <option>Paid</option>
              </select>

              {/* Total */}
              <div className="font-semibold">
                Total: ₹ {total}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}