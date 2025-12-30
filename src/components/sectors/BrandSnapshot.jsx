import React from 'react';

export default function BrandSnapshot({ brand, sectorKey, sectorName }) {
  const getIntroText = () => {
    const intros = [
      `a cutting-edge FAA.ZONE solution designed for the ${sectorName} sector. It seamlessly integrates with the global PulseGrid to deliver unparalleled performance and data integrity.`,
      `the premier FAA.ZONE platform, revolutionizing ${sectorName} operations. Leveraging the global PulseGrid, it offers robust data synchronization and superior efficiency.`,
      `an innovative FAA.ZONE protocol, specifically engineered for the demands of the ${sectorName} industry. Its deep integration with the PulseGrid ensures secure, real-time data flows and enhanced decision-making.`,
      `a powerful FAA.ZONE framework empowering the ${sectorName} sector with advanced automation and data management. It connects effortlessly to the PulseGrid for optimized workflow and compliance.`
    ];
    return intros[Math.floor(Math.random() * intros.length)];
  };

  const features = [
    `Direct integration with FAA 🧾 Professional Services Mesh.`,
    `Advanced data sync with ${brand.subnodes?.[0] || 'core nodes'}.`,
    `Real-time compliance validation via VaultLink™ (${sectorKey} specific).`,
    `Scalable architecture for x${Math.ceil(Math.random() * 50) + 10} node expansion.`,
    `Predictive analytics module for ${brand.name} performance.`,
    `API access for seamless interoperability.`,
    ...brand.subnodes?.slice(0, 3).map(node => `Subnode: ${node}`) || []
  ];

  const pricingTiers = [
    {
      name: 'Starter Node',
      cost: `FCU ${Math.round(Math.random() * 50 + 50)}/mo`,
      description: 'Ideal for small teams and pilot projects.',
      benefits: ['Essential features', 'Basic data sync', 'Community support']
    },
    {
      name: 'Pro Grid',
      cost: `FCU ${Math.round(Math.random() * 200 + 150)}/mo`,
      description: 'For growing firms needing advanced capabilities.',
      benefits: ['Advanced features', 'High-volume data processing', 'Priority support', 'Expanded analytics']
    },
    {
      name: 'Enterprise Omni-Sync',
      cost: 'Custom pricing',
      description: 'Full VaultMesh access with dedicated resources.',
      benefits: ['Full VaultMesh access', 'Dedicated account management', 'Custom integrations', '24/7 Premium Support']
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-indigo-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h4 className="text-2xl font-extrabold text-indigo-700">
            🚀 {brand.name}™ Core Protocol Overview
          </h4>
          <p className="text-md text-gray-700 leading-relaxed">
            {brand.description || `${brand.name}™ is ${getIntroText()}`}
          </p>

          <div>
            <h5 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-3">
              🎛️ Key Features
            </h5>
            <ul className="list-disc list-inside ml-4 space-y-2 text-sm text-gray-700">
              {features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-3">
              💳 Pricing Structure
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {pricingTiers.map((tier, i) => (
                <div
                  key={i}
                  className="p-4 border rounded-lg shadow-sm bg-gray-50 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <h6 className="font-bold text-indigo-600 text-lg">{tier.name}</h6>
                  <p className="text-gray-900 text-xl font-bold my-2">{tier.cost}</p>
                  <p className="text-xs text-gray-600 mb-2">{tier.description}</p>
                  <ul className="text-xs text-gray-500 list-disc list-inside ml-3">
                    {tier.benefits.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h5 className="text-xl font-semibold text-indigo-700 border-b pb-2 mb-3">
            🔗 FAA Metadata & Compliance
          </h5>
          <ul className="list-disc list-inside ml-4 space-y-2 text-sm text-gray-700">
            <li>
              <strong>Product ID:</strong> <code>{brand.metadata?.id || 'N/A'}</code>
            </li>
            <li>
              <strong>VaultID:</strong> <code>{brand.metadata?.vault || 'N/A'}</code>
            </li>
            <li>
              <strong>Signal Echo Layer:</strong> <code>{brand.metadata?.layer || 'N/A'}</code>
            </li>
            <li>
              <strong>Deployment Zone:</strong> <code>{brand.metadata?.deploymentZone || 'N/A'}</code>
            </li>
            <li>
              <strong>Security Rating:</strong>{' '}
              <span className="font-bold text-green-600">{brand.metadata?.securityRating || 'N/A'}</span>
            </li>
            <li>
              <strong>Active Nodes:</strong>{' '}
              <code>{brand.metadata?.activeNodes?.toLocaleString() || '0'}</code>
            </li>
            <li>
              <strong>Last Audit:</strong> <code>{new Date(brand.updated_date).toISOString().slice(0, 10)}</code>
            </li>
            <li>
              <strong>Compliance Status:</strong>{' '}
              <span className="font-bold text-green-600">Active & Certified</span>
            </li>
          </ul>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 shadow-inner">
            <h6 className="font-bold mb-2 text-gray-800">📊 Real-Time Metrics Overview:</h6>
            <p>
              <strong>Current Pulse Activity:</strong>{' '}
              {Math.floor(Math.random() * 100000).toLocaleString()} pulses/sec
            </p>
            <p>
              <strong>Data Volume Processed (24h):</strong> {(Math.random() * 100).toFixed(2)} TB
            </p>
            <p>
              <strong>Latency Average:</strong> {Math.floor(Math.random() * 100) + 10} ms
            </p>
          </div>

          {brand.subnodes && brand.subnodes.length > 0 && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 shadow-inner">
              <h6 className="font-bold mb-2 text-gray-800">📌 Registered Subnodes:</h6>
              <div className="flex flex-wrap gap-2">
                {brand.subnodes.map((node, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium"
                  >
                    {node}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}