import re

def convert_app(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Change min-h-screen layout
    content = content.replace('<div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row font-sans text-slate-800">', '<div className="min-h-screen bg-slate-200 flex flex-col font-sans text-slate-800">')
    
    # Extract the navigation items (we will rebuild the header)
    header_html = """
      {/* Header - Top Bar Layout */}
      <header className="shrink-0 bg-slate-800 text-white border-b border-slate-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-1.5 rounded-sm shadow-inner">
                <Printer className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm tracking-tight">PrintEst Pro</h1>
                <span className="bg-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded-sm tracking-widest text-slate-300">
                  v1.2
                </span>
              </div>
            </div>
            
            {/* Top Navigation */}
            <nav className="hidden md:flex bg-slate-900 rounded-sm p-0.5 border border-slate-700 items-center">
              {[
                { id: 'modeA', icon: FileIcon, label: 'Mode A' },
                { id: 'modeB', icon: BookOpen, label: 'Mode B' },
                { id: 'compare', icon: BarChart3, label: 'Compare' },
                { id: 'history', icon: History, label: 'History' },
                { id: 'admin', icon: Settings, label: 'Admin Panel', adminOnly: true }
              ].filter(t => !t.adminOnly || currentUser?.role === 'admin').map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabId)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold transition ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-inner'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </nav>
            
            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-200">{currentUser?.name}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">{currentUser?.role}</div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-sm transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 overflow-hidden bg-slate-300 relative flex flex-col">
        <div className="flex-1 overflow-y-auto p-2 sm:p-4">
          <div className="max-w-[1600px] mx-auto w-full">
            <AnimatePresence mode="wait">
"""
    
    # Replace the old layout structure
    # The old structure has `<aside className="hidden lg:flex...` up to `</aside>`
    # and a mobile header `<div className="lg:hidden bg-[#0F172A] text-white...` up to `</div>`
    # and `<main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 relative overflow-hidden">`
    # and `<header className="hidden lg:flex...`
    
    content = re.sub(r'\{/\* Sidebar - Desktop Layout \*/\}.*?<AnimatePresence mode="wait">', header_html, content, flags=re.DOTALL)
    
    # We should also update the footer inside `App.tsx`
    content = content.replace('bg-indigo-600', 'bg-blue-600')
    content = content.replace('text-indigo-600', 'text-blue-600')

    with open(filepath, 'w') as f:
        f.write(content)

convert_app('src/App.tsx')

