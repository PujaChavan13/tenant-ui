// import ShopManagement from "./components/ShopManagement";
import Layout from "./components/SideLayout";

export default function Home() {
  return (
    <Layout>
      <div className="p-6 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Welcome to Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your shops, tenants, and payments efficiently</p>
        </header>

        {/* Content Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="h-12 w-12 rounded-lg bg-blue-100 mb-4" />
              <h3 className="font-semibold text-gray-900">Card {item}</h3>
              <p className="text-sm text-gray-600 mt-2">This is a content placeholder card.</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}