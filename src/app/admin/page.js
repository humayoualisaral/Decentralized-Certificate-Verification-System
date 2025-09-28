'use client'
import { useState, useEffect } from 'react'
import { useCertificate } from '@/context/ContractContext'
import Link from 'next/link'
import { 
  Shield, 
  Plus, 
  Upload, 
  Users, 
  ArrowLeft, 
  Save,
  Trash2,
  Copy,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  FileText,
  Hash,
  User,
  Calendar,
  Award,
  Download,
  RefreshCw,
  Loader
} from 'lucide-react'

export default function AdminPortal() {
  const { 
    isConnected, 
    isAdmin, 
    account,
    storeCertificate, 
    batchStoreCertificates,
    transferAdmin,
    totalCertificates,
    refreshData,
    loading, 
    error, 
    clearError,
    generateCertificateHash 
  } = useCertificate()

  // Single certificate form
  const [singleCert, setSingleCert] = useState({
    id: '',
    data: ''
  })

  // Batch upload
  const [batchCerts, setBatchCerts] = useState([])
  const [batchInput, setBatchInput] = useState('')

  // Admin transfer
  const [newAdminAddress, setNewAdminAddress] = useState('')

  // UI state
  const [activeTab, setActiveTab] = useState('single')
  const [isProcessing, setIsProcessing] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Sample certificate data
  const sampleCertificate = {
    studentName: "Alice Johnson",
    courseName: "Advanced React Development",
    institution: "Tech Institute",
    issueDate: "2024-03-15",
    grade: "A+",
    certificateType: "Course Completion",
    instructor: "Dr. Smith",
    credits: "3.0"
  }

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const handleSingleCertSubmit = async () => {
    if (!singleCert.id.trim() || !singleCert.data.trim()) {
      alert('Please enter both certificate ID and data')
      return
    }

    try {
      setIsProcessing(true)
      clearError()
      
      const parsedData = JSON.parse(singleCert.data)
      const result = await storeCertificate(singleCert.id, parsedData)
      
      if (result.success) {
        setSuccessMessage(`Certificate ${singleCert.id} stored successfully! Transaction: ${result.transactionHash}`)
        setSingleCert({ id: '', data: '' })
        await refreshData()
      }
    } catch (err) {
      console.error('Store certificate error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBatchSubmit = async () => {
    if (batchCerts.length === 0) {
      alert('Please add certificates to the batch')
      return
    }

    try {
      setIsProcessing(true)
      clearError()
      
      const result = await batchStoreCertificates(batchCerts)
      
      if (result.success) {
        setSuccessMessage(`${batchCerts.length} certificates stored successfully! Transaction: ${result.transactionHash}`)
        setBatchCerts([])
        setBatchInput('')
        await refreshData()
      }
    } catch (err) {
      console.error('Batch store error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleTransferAdmin = async () => {
    if (!newAdminAddress.trim()) {
      alert('Please enter the new admin address')
      return
    }

    if (!confirm('Are you sure you want to transfer admin privileges? This action cannot be undone.')) {
      return
    }

    try {
      setIsProcessing(true)
      clearError()
      
      const result = await transferAdmin(newAdminAddress)
      
      if (result.success) {
        setSuccessMessage(`Admin privileges transferred successfully! Transaction: ${result.transactionHash}`)
        setNewAdminAddress('')
      }
    } catch (err) {
      console.error('Transfer admin error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const addToBatch = () => {
    if (!batchInput.trim()) return

    try {
      const lines = batchInput.trim().split('\n')
      const newCerts = []

      lines.forEach((line, index) => {
        if (line.trim()) {
          const [id, ...dataParts] = line.split('|')
          if (id && dataParts.length > 0) {
            const dataStr = dataParts.join('|')
            try {
              const data = JSON.parse(dataStr)
              newCerts.push({ id: id.trim(), data })
            } catch (err) {
              console.error(`Invalid JSON on line ${index + 1}:`, err)
            }
          }
        }
      })

      setBatchCerts([...batchCerts, ...newCerts])
      setBatchInput('')
    } catch (err) {
      alert('Invalid batch format')
    }
  }

  const removeBatchItem = (index) => {
    setBatchCerts(batchCerts.filter((_, i) => i !== index))
  }

  const loadSampleData = () => {
    setSingleCert({
      ...singleCert,
      data: JSON.stringify(sampleCertificate, null, 2)
    })
  }

  const generateSampleId = () => {
    const timestamp = Date.now()
    setSingleCert({
      ...singleCert,
      id: `CERT-${timestamp}`
    })
  }

  const exportBatchTemplate = () => {
    const template = `CERT-001|${JSON.stringify(sampleCertificate)}
CERT-002|${JSON.stringify({...sampleCertificate, studentName: "Bob Smith", grade: "A"})}
CERT-003|${JSON.stringify({...sampleCertificate, studentName: "Carol Davis", grade: "B+"})}`
    
    const blob = new Blob([template], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'batch_template.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
            </div>
          </div>
        </header>
        
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <Shield className="mx-auto h-24 w-24 text-gray-400 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Wallet Connection Required</h2>
            <p className="text-gray-600 mb-8">
              Please connect your wallet to access the admin portal
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
            </div>
          </div>
        </header>
        
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <XCircle className="mx-auto h-24 w-24 text-red-500 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-8">
              You don't have admin privileges to access this portal
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
                  <p className="text-sm text-gray-600">Certificate Management Hub</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                <Award className="inline w-4 h-4 mr-1" />
                Administrator
              </div>
              <button
                onClick={refreshData}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh Data"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
              <p className="text-blue-100">
                Manage certificates, batch uploads, and system administration
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold mb-1">{totalCertificates}</div>
              <div className="text-blue-100 text-sm">Total Certificates</div>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Success</span>
            </div>
            <p className="text-green-700 mt-1">{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">Error</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('single')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'single'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Plus className="inline h-4 w-4 mr-2" />
                Single Certificate
              </button>
              <button
                onClick={() => setActiveTab('batch')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'batch'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Upload className="inline h-4 w-4 mr-2" />
                Batch Upload
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'admin'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="inline h-4 w-4 mr-2" />
                Admin Management
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Single Certificate Tab */}
            {activeTab === 'single' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Issue Single Certificate</h3>
                  <p className="text-gray-600 mb-6">
                    Create and store a single certificate on the blockchain
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certificate ID
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Enter unique certificate ID"
                        value={singleCert.id}
                        onChange={(e) => setSingleCert({...singleCert, id: e.target.value})}
                        className="text-[#000] flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={generateSampleId}
                        className="px-4 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Generate Sample ID"
                      >
                        <Hash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={loadSampleData}
                      className="w-full px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                    >
                      Load Sample Data
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificate Data (JSON Format)
                  </label>
                  <textarea
                    rows={12}
                    placeholder='Enter certificate data in JSON format...'
                    value={singleCert.data}
                    onChange={(e) => setSingleCert({...singleCert, data: e.target.value})}
                    className="w-full text-[#000] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleSingleCertSubmit}
                    disabled={isProcessing || !singleCert.id.trim() || !singleCert.data.trim()}
                    className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 shadow-lg"
                  >
                    {isProcessing ? (
                      <Loader className="animate-spin h-5 w-5 mr-2" />
                    ) : (
                      <Save className="h-5 w-5 mr-2" />
                    )}
                    {isProcessing ? 'Storing...' : 'Store Certificate'}
                  </button>

                  <button
                    onClick={() => setSingleCert({id: '', data: ''})}
                    className="px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Batch Upload Tab */}
            {activeTab === 'batch' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Batch Certificate Upload</h3>
                  <p className="text-gray-600 mb-6">
                    Upload multiple certificates at once. Use format: ID|JSON_DATA per line
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Batch Format Instructions:</h4>
                  <p className="text-blue-800 text-sm mb-3">
                    Each line should contain: <code className="bg-blue-100 px-2 py-1 rounded">CERTIFICATE_ID|JSON_DATA</code>
                  </p>
                  <button
                    onClick={exportBatchTemplate}
                    className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch Input
                  </label>
                  <textarea
                    rows={8}
                    placeholder='CERT-001|{"studentName":"John Doe","courseName":"React Basics","institution":"Tech University","issueDate":"2024-01-15","grade":"A+","certificateType":"Completion Certificate"}
CERT-002|{"studentName":"Jane Smith","courseName":"Node.js Advanced","institution":"Tech University","issueDate":"2024-01-16","grade":"A","certificateType":"Completion Certificate"}'
                    value={batchInput}
                    onChange={(e) => setBatchInput(e.target.value)}
                    className="w-full text-[#000] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={addToBatch}
                    disabled={!batchInput.trim()}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add to Batch
                  </button>

                  <button
                    onClick={() => setBatchInput('')}
                    className="px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Clear Input
                  </button>
                </div>

                {/* Batch Preview */}
                {batchCerts.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-medium text-gray-900">
                          Batch Preview ({batchCerts.length} certificates)
                        </h4>
                        <button
                          onClick={() => setBatchCerts([])}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {batchCerts.map((cert, index) => (
                        <div key={index} className="px-6 py-4 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <FileText className="h-4 w-4 text-gray-400" />
                                <span className="font-medium text-gray-900">{cert.id}</span>
                              </div>
                              <div className="mt-1 text-sm text-gray-600 font-mono">
                                {JSON.stringify(cert.data).substring(0, 100)}...
                              </div>
                            </div>
                            <button
                              onClick={() => removeBatchItem(index)}
                              className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-6 py-4 border-t border-gray-200">
                      <button
                        onClick={handleBatchSubmit}
                        disabled={isProcessing || batchCerts.length === 0}
                        className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all duration-200 shadow-lg"
                      >
                        {isProcessing ? (
                          <Loader className="animate-spin h-5 w-5 mr-2" />
                        ) : (
                          <Upload className="h-5 w-5 mr-2" />
                        )}
                        {isProcessing ? 'Uploading...' : `Upload ${batchCerts.length} Certificates`}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Admin Management Tab */}
            {activeTab === 'admin' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Admin Management</h3>
                  <p className="text-gray-600 mb-6">
                    Transfer admin privileges to another address. This action is irreversible.
                  </p>
                </div>

                <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                  <div className="flex items-start space-x-4">
                    <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-900 mb-2">Important Warning</h4>
                      <ul className="text-amber-800 text-sm space-y-1">
                        <li>• Admin transfer is permanent and cannot be undone</li>
                        <li>• You will lose all admin privileges immediately</li>
                        <li>• Ensure the new address is correct and trusted</li>
                        <li>• The new admin will have full control over the system</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Current Admin Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Current Admin Address:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm text-gray-900">{account}</span>
                        <button
                          onClick={() => copyToClipboard(account)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Total Certificates Managed:</span>
                      <span className="font-medium text-gray-900">{totalCertificates}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Transfer Admin Privileges</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Admin Address
                      </label>
                      <input
                        type="text"
                        placeholder="Enter new admin Ethereum address (0x...)"
                        value={newAdminAddress}
                        onChange={(e) => setNewAdminAddress(e.target.value)}
                        className="text-[#000] w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm"
                      />
                    </div>

                    <button
                      onClick={handleTransferAdmin}
                      disabled={isProcessing || !newAdminAddress.trim()}
                      className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-all duration-200"
                    >
                      {isProcessing ? (
                        <Loader className="animate-spin h-5 w-5 mr-2" />
                      ) : (
                        <Users className="h-5 w-5 mr-2" />
                      )}
                      {isProcessing ? 'Transferring...' : 'Transfer Admin Rights'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Certificates</p>
                <p className="text-3xl font-bold text-gray-900">{totalCertificates}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Admin Status</p>
                <p className="text-xl font-bold text-gray-900">Active</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">System Status</p>
                <p className="text-xl font-bold text-gray-900">Operational</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      setSuccessMessage('Address copied to clipboard!')
    })
  }
}