'use client'
import { useState } from 'react'
import { useCertificate } from '@/context/ContractContext'
import Link from 'next/link'
import { 
  Shield, 
  Search, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ArrowLeft, 
  Copy, 
  FileText,
  User,
  Calendar,
  Award,
  Hash,
  Loader
} from 'lucide-react'

export default function UserPortal() {
  const { 
    isConnected, 
    verifyCertificate, 
    checkCertificateExists, 
    loading, 
    error, 
    clearError,
    generateCertificateHash 
  } = useCertificate()

  const [certificateId, setCertificateId] = useState('')
  const [certificateData, setCertificateData] = useState('')
  const [verificationResult, setVerificationResult] = useState(null)
  const [existsResult, setExistsResult] = useState(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isCheckingExists, setIsCheckingExists] = useState(false)

  // Sample certificate data for demo
  const sampleData = {
    studentName: "John Doe",
    courseName: "Blockchain Development",
    institution: "Tech University",
    issueDate: "2024-01-15",
    grade: "A+",
    certificateType: "Completion Certificate"
  }

  const handleVerifyCertificate = async () => {
    if (!certificateId.trim() || !certificateData.trim()) {
      alert('Please enter both certificate ID and data')
      return
    }

    try {
      clearError()
      setIsVerifying(true)
      setVerificationResult(null)

      // Parse certificate data
      const parsedData = JSON.parse(certificateData)
      const result = await verifyCertificate(certificateId, parsedData)
      setVerificationResult(result)
    } catch (err) {
      console.error('Verification error:', err)
      setVerificationResult({
        isValid: false,
        exists: false,
        message: err.message || 'Invalid certificate data format'
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleCheckExists = async () => {
    if (!certificateId.trim()) {
      alert('Please enter certificate ID')
      return
    }

    try {
      clearError()
      setIsCheckingExists(true)
      setExistsResult(null)

      const exists = await checkCertificateExists(certificateId)
      setExistsResult(exists)
    } catch (err) {
      console.error('Check exists error:', err)
      setExistsResult(false)
    } finally {
      setIsCheckingExists(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Hash copied to clipboard!')
    }).catch(() => {
      alert('Failed to copy to clipboard')
    })
  }

  const loadSampleData = () => {
    setCertificateData(JSON.stringify(sampleData, null, 2))
  }

  const generateHash = () => {
    if (!certificateData.trim()) {
      alert('Please enter certificate data first')
      return
    }

    try {
      const parsedData = JSON.parse(certificateData)
      const hash = generateCertificateHash(parsedData)
      copyToClipboard(hash)
    } catch (err) {
      alert('Invalid JSON format')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-600 rounded-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">User Portal</h1>
                  <p className="text-sm text-gray-600">Certificate Verification Hub</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {!isConnected && (
                <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">
                  Not Connected
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          <div className="text-center py-16">
            <Shield className="mx-auto h-24 w-24 text-gray-400 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Wallet Connection Required</h2>
            <p className="text-gray-600 mb-8">
              Please connect your wallet to verify certificates on the blockchain
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Search className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">Certificate Verification</h2>
                  <p className="text-green-100">
                    Verify the authenticity and validity of certificates stored on the blockchain
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                  <Search className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Quick Check</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Check if a certificate exists on the blockchain
                </p>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter Certificate ID"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    className="text-[#000] w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleCheckExists}
                    disabled={isCheckingExists || !certificateId.trim()}
                    className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isCheckingExists ? (
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                    ) : (
                      <Search className="h-4 w-4 mr-2" />
                    )}
                    {isCheckingExists ? 'Checking...' : 'Check Existence'}
                  </button>
                </div>

                {/* Exists Result */}
                {existsResult !== null && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    existsResult 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center space-x-2">
                      {existsResult ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className={`font-medium ${
                        existsResult ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {existsResult ? 'Certificate Found' : 'Certificate Not Found'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                  <Hash className="h-6 w-6 text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Generate Hash</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Generate the hash for your certificate data
                </p>
                <div className="space-y-4">
                  <button
                    onClick={loadSampleData}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Load Sample Data
                  </button>
                  <button
                    onClick={generateHash}
                    disabled={!certificateData.trim()}
                    className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                  >
                    <Hash className="h-4 w-4 mr-2" />
                    Generate & Copy Hash
                  </button>
                </div>
              </div>
            </div>

            {/* Main Verification Form */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Full Certificate Verification</h3>
                <p className="text-gray-600">
                  Enter the certificate ID and data to perform complete verification
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Certificate ID Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificate ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter Certificate ID (e.g., CERT-2024-001)"
                      value={certificateId}
                      onChange={(e) => setCertificateId(e.target.value)}
                      className="w-full text-[#000] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <FileText className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* Certificate Data Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Certificate Data (JSON Format)
                    </label>
                    <button
                      onClick={loadSampleData}
                      className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      Load Sample Data
                    </button>
                  </div>
                  <textarea
                    rows={10}
                    placeholder='Enter certificate data in JSON format, e.g.:
{
  "studentName": "John Doe",
  "courseName": "Blockchain Development",
  "institution": "Tech University",
  "issueDate": "2024-01-15",
  "grade": "A+",
  "certificateType": "Completion Certificate"
}'
                    value={certificateData}
                    onChange={(e) => setCertificateData(e.target.value)}
                    className="w-full text-[#000] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={handleVerifyCertificate}
                    disabled={isVerifying || !certificateId.trim() || !certificateData.trim()}
                    className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all duration-200 shadow-lg"
                  >
                    {isVerifying ? (
                      <Loader className="animate-spin h-5 w-5 mr-2" />
                    ) : (
                      <CheckCircle className="h-5 w-5 mr-2" />
                    )}
                    {isVerifying ? 'Verifying...' : 'Verify Certificate'}
                  </button>

                  <button
                    onClick={() => {
                      setCertificateId('')
                      setCertificateData('')
                      setVerificationResult(null)
                      setExistsResult(null)
                      clearError()
                    }}
                    className="px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Clear
                  </button>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span className="text-red-800 font-medium">Error</span>
                    </div>
                    <p className="text-red-700 mt-1">{error}</p>
                  </div>
                )}

                {/* Verification Results */}
                {verificationResult && (
                  <div className="space-y-4">
                    <div className={`p-6 rounded-xl border-2 ${
                      verificationResult.isValid && verificationResult.exists
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center space-x-3 mb-4">
                        {verificationResult.isValid && verificationResult.exists ? (
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        ) : (
                          <XCircle className="h-8 w-8 text-red-600" />
                        )}
                        <div>
                          <h4 className={`text-xl font-bold ${
                            verificationResult.isValid && verificationResult.exists
                              ? 'text-green-800' 
                              : 'text-red-800'
                          }`}>
                            {verificationResult.isValid && verificationResult.exists
                              ? 'Certificate Verified ✓' 
                              : 'Verification Failed ✗'
                            }
                          </h4>
                          <p className={`${
                            verificationResult.isValid && verificationResult.exists
                              ? 'text-green-700' 
                              : 'text-red-700'
                          }`}>
                            {verificationResult.message}
                          </p>
                        </div>
                      </div>

                      {/* Detailed Results */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className={`p-4 rounded-lg ${
                          verificationResult.exists ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <div className="flex items-center space-x-2">
                            {verificationResult.exists ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                            <span className={`font-medium ${
                              verificationResult.exists ? 'text-green-800' : 'text-red-800'
                            }`}>
                              Certificate Exists: {verificationResult.exists ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </div>

                        <div className={`p-4 rounded-lg ${
                          verificationResult.isValid ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <div className="flex items-center space-x-2">
                            {verificationResult.isValid ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                            <span className={`font-medium ${
                              verificationResult.isValid ? 'text-green-800' : 'text-red-800'
                            }`}>
                              Data Valid: {verificationResult.isValid ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Certificate Details Display */}
                    {verificationResult.isValid && verificationResult.exists && certificateData && (
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Award className="h-5 w-5 mr-2 text-blue-600" />
                          Certificate Details
                        </h5>
                        <div className="grid md:grid-cols-2 gap-4">
                          {(() => {
                            try {
                              const parsedData = JSON.parse(certificateData)
                              return Object.entries(parsedData).map(([key, value]) => (
                                <div key={key} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                  <div className="flex-shrink-0">
                                    {key.toLowerCase().includes('name') ? (
                                      <User className="h-4 w-4 text-gray-500" />
                                    ) : key.toLowerCase().includes('date') ? (
                                      <Calendar className="h-4 w-4 text-gray-500" />
                                    ) : (
                                      <FileText className="h-4 w-4 text-gray-500" />
                                    )}
                                  </div>
                                  <div>
                                    <dt className="text-xs text-gray-500 uppercase tracking-wide">
                                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                    </dt>
                                    <dd className="text-sm font-medium text-gray-900">{String(value)}</dd>
                                  </div>
                                </div>
                              ))
                            } catch (error) {
                              return <div className="text-red-600">Error parsing certificate data</div>
                            }
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h4 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                How to Use
              </h4>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-blue-800">
                <div>
                  <h5 className="font-medium mb-2">Quick Check:</h5>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Enter just the Certificate ID</li>
                    <li>Check if it exists on blockchain</li>
                    <li>Fast verification without data</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Full Verification:</h5>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Enter Certificate ID and Data</li>
                    <li>Validates data integrity</li>
                    <li>Confirms authenticity</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}