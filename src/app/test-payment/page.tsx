'use client';

import { useState } from 'react';
import { runAllPaymentTests, testPaymentScenarios } from '../lib/paymentTest';

export default function PaymentTestPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setLogs([]);
    setTestResults([]);

    addLog('🚀 Starting payment flow tests...');

    try {
      // Override console.log to capture logs
      const originalLog = console.log;
      console.log = (...args) => {
        originalLog(...args);
        addLog(args.join(' '));
      };

      const results = await runAllPaymentTests();
      setTestResults(results);

      // Restore console.log
      console.log = originalLog;

      addLog('✅ All tests completed!');
    } catch (error) {
      addLog(`❌ Test execution failed: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const runSingleTest = async (testName: string) => {
    setIsRunning(true);
    setLogs([]);

    addLog(`🧪 Running single test: ${testName}`);

    try {
      const testData = testPaymentScenarios[testName as keyof typeof testPaymentScenarios];
      if (!testData) {
        throw new Error(`Test scenario "${testName}" not found`);
      }

      // Import and run single test
      const { testPaymentFlow } = await import('../lib/paymentTest');
      const result = await testPaymentFlow(testData);
      
      setTestResults([{ testName, result }]);
      addLog(`✅ Single test completed: ${testName}`);
    } catch (error) {
      addLog(`❌ Single test failed: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Flow Testing
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Test Scenarios</h2>
              <div className="space-y-2">
                {Object.keys(testPaymentScenarios).map((testName) => (
                  <div key={testName} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">{testName}</span>
                    <button
                      onClick={() => runSingleTest(testName)}
                      disabled={isRunning}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      Run Test
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Test Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={runTests}
                  disabled={isRunning}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                >
                  {isRunning ? 'Running Tests...' : 'Run All Tests'}
                </button>
                
                <button
                  onClick={() => {
                    setLogs([]);
                    setTestResults([]);
                  }}
                  className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Clear Results
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="space-y-3">
              {testResults.map(({ testName, result }, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{testName}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {result.success ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                  {result.error && (
                    <div className="mt-2 text-sm text-red-600">
                      Error: {result.error.message || result.error}
                    </div>
                  )}
                  {result.data && (
                    <div className="mt-2 text-sm text-gray-600">
                      Order ID: {result.data.order_id}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test Logs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Test Logs</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-96 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs yet. Run a test to see logs here.</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
