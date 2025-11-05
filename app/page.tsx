export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-4">
          Crypto Portfolio Dashboard
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Track and manage your cryptocurrency portfolio with advanced analytics.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">📊 Portfolio Tracking</h3>
            <p className="text-gray-600">Real-time tracking of your crypto holdings</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">📈 Advanced Charts</h3>
            <p className="text-gray-600">Visualize your portfolio performance</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">🔐 WebAuthn Security</h3>
            <p className="text-gray-600">Secure authentication with biometrics</p>
          </div>
        </div>
      </div>
    </main>
  )
}
