'use client'
import { useCertificate } from '@/context/ContractContext'
import Link from 'next/link'
import { Shield, UserCheck, Settings, FileCheck, Wallet, TrendingUp, Users, Award, ArrowRight } from 'lucide-react'

export default function Home() {
  const { isConnected, account, isAdmin, connectWallet, loading, totalCertificates, networkInfo } = useCertificate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CertificateValidator</h1>
                <p className="text-sm text-gray-600">Blockchain-based verification</p>
              </div>
            </div>
            
            {isConnected ? (
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>{`${account.slice(0, 6)}...${account.slice(-4)}`}</span>
                  </div>
                </div>
                {networkInfo && (
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
                    {networkInfo.name}
                  </div>
                )}
                {isAdmin && (
                  <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium border border-purple-200">
                    <Award className="inline w-4 h-4 mr-1" />
                    Admin
                  </span>
                )}
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={loading}
                className="group inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Wallet className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                {loading ? (
                  <>
                    <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    Connecting...
                  </>
                ) : (
                  'Connect Wallet'
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isConnected ? (
          <div className="text-center">
            {/* Hero Section */}
            <div className="mb-12">
              <div className="relative inline-block mb-6">
                <Shield className="mx-auto h-32 w-32 text-blue-600 drop-shadow-lg" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Certificate Validation System
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Secure, tamper-proof certificate validation powered by blockchain technology. 
                Ensure authenticity and prevent fraud with our decentralized verification system.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Storage</h3>
                <p className="text-gray-600">Certificates stored on blockchain with cryptographic hashing</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileCheck className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Verification</h3>
                <p className="text-gray-600">Real-time certificate validation with immediate results</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Multi-Admin Support</h3>
                <p className="text-gray-600">Flexible admin management with transfer capabilities</p>
              </div>
            </div>

            <button
              onClick={connectWallet}
              disabled={loading}
              className="group inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <Wallet className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
              {loading ? (
                <>
                  <div className="animate-spin w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                  Connecting to Blockchain...
                </>
              ) : (
                <>
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        ) : (
          <div>
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
                  <p className="text-blue-100">
                    Connected as {isAdmin ? 'Administrator' : 'User'} • 
                    Network: {networkInfo?.name || 'Unknown'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold mb-1">{totalCertificates}</div>
                  <div className="text-blue-100 text-sm">Total Certificates</div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Certificates</p>
                    <p className="text-3xl font-bold text-gray-900">{totalCertificates}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">User Role</p>
                    <p className="text-xl font-bold text-gray-900">{isAdmin ? 'Administrator' : 'Verifier'}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${isAdmin ? 'bg-purple-100' : 'bg-green-100'}`}>
                    {isAdmin ? (
                      <Award className="h-6 w-6 text-purple-600" />
                    ) : (
                      <Users className="h-6 w-6 text-green-600" />
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Network</p>
                    <p className="text-lg font-bold text-gray-900">
                      {networkInfo?.name?.replace(' Testnet', '') || 'Connected'}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* User Portal */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-green-100 rounded-xl mr-4 group-hover:bg-green-200 transition-colors">
                      <UserCheck className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">User Portal</h3>
                      <p className="text-green-600 font-medium">Verification Hub</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Verify certificate authenticity and validity using certificate ID and data. 
                    Get instant results with detailed verification status.
                  </p>
                  <div className="flex items-center justify-between">
                    <Link
                      href="/user"
                      className="group/btn inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <FileCheck className="h-4 w-4 mr-2" />
                      Verify Certificate
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                    <div className="text-sm text-gray-500">
                      Public Access
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Portal */}
              <div className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden ${
                isAdmin ? 'hover:border-blue-200' : 'opacity-75'
              }`}>
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className={`p-3 rounded-xl mr-4 transition-colors ${
                      isAdmin 
                        ? 'bg-blue-100 group-hover:bg-blue-200' 
                        : 'bg-gray-100'
                    }`}>
                      <Settings className={`h-8 w-8 ${isAdmin ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Admin Portal</h3>
                      <p className={`font-medium ${isAdmin ? 'text-blue-600' : 'text-gray-400'}`}>
                        Management Hub
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Issue new certificates, perform batch uploads, manage admin privileges, 
                    and monitor the entire certificate ecosystem.
                  </p>
                  <div className="flex items-center justify-between">
                    <Link
                      href="/admin"
                      className={`group/btn inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 shadow-lg ${
                        isAdmin 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500 hover:shadow-xl' 
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                      style={!isAdmin ? { pointerEvents: 'none' } : {}}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      {isAdmin ? 'Manage System' : 'Admin Access Required'}
                      {isAdmin && <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />}
                    </Link>
                    <div className={`text-sm ${isAdmin ? 'text-blue-600' : 'text-gray-400'}`}>
                      {isAdmin ? 'Admin Access' : 'Restricted'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Notice */}
            {!isAdmin && (
              <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Shield className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-1">Admin Privileges Required</h4>
                    <p className="text-amber-800 text-sm leading-relaxed">
                      To access the admin portal and manage certificates, you need administrator privileges. 
                      Only the contract admin can issue, batch upload, and manage certificates. 
                      Current admin can transfer privileges to other trusted addresses.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">Powered by Ethereum Blockchain</p>
            <p className="text-sm">
              Contract: {isConnected && (
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  0x8eB...89cD
                </span>
              )}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}